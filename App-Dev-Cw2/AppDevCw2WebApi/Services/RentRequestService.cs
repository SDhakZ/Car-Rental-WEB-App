using AppDevCw2WebApi.Data;
using AppDevCw2WebApi.DTOs;
using AppDevCw2WebApi.DTOs.CustomerRequests;
using AppDevCw2WebApi.DTOs.OfferDtos;
using AppDevCw2WebApi.Models;
using AppDevCw2WebApi.Models.Static;
using Microsoft.EntityFrameworkCore;
using System;
using System.Runtime.ConstrainedExecution;

namespace AppDevCw2WebApi.Services
{
    public class RentRequestService
    {
        public AppDbContext _dbContext;


        public RentRequestService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Make car rent request 
        public ViewRequestDto MakeRequest(MakeRequestDto dto)
        {
            var customerId = dto.CustomerId;
            var prevCustomer = _dbContext.ApplicationUsers.FirstOrDefault(customer => customer.Id == customerId);
            if (prevCustomer == null)
            {
                throw new Exception("Invalid customer id.");
            }
            if (string.IsNullOrEmpty( prevCustomer.DocumentUrl))
            {
                throw new Exception("You can't make request without uploading your document.");
            }

            var carId = dto.CarId;
            var prevCar = _dbContext.Cars.FirstOrDefault(car => car.Id == carId);
            if (prevCar == null)
            {
                throw new Exception("Invalid car id.");
            }

            var prevReq = _dbContext.RentalHistory.Where(rh=> rh.CustomerId == dto.CustomerId && rh.CarId == dto.CarId && rh.RequestStatus == RequestStatus.Pending).FirstOrDefault();
            if(prevReq != null)
            {
                throw new Exception("Your previous request for this car is pending. You can't make another request for this car.");

            }

            if(prevCar.Status != CarStatus.Available) {
                throw new Exception("The car is currently unavailable for rent");
            }


            var startDate = DateTime.Parse(dto.StartDate).Date;
            var endDate = DateTime.Parse(dto.EndDate).Date;
            if (startDate < DateTime.Now.Date)
            {
                throw new Exception("Invalid start date.");

            }
            if (startDate >= endDate)
            {
                throw new Exception("End date should be after the start date.");
            }

                        
            var totalDays = (endDate - startDate).TotalDays;
            var charge = (totalDays * prevCar.RatePerDay);
            var discount =  GetTotalDiscount(
                carId,
               customerId
            );

            var totalCharge =Math.Round(charge - ((discount / 100) * charge));
            var historyId = Guid.NewGuid();
            var request = new RentalHistory
            {
                Id =historyId,
                CarId = carId,
                CustomerId = dto.CustomerId,
                StartDate = startDate,
                EndDate = endDate,
                TotalCharge = totalCharge,
                RequestStatus = RequestStatus.Pending,
            };

            _dbContext.RentalHistory.Add(request);
            prevCar.Status = CarStatus.Unavailable;
            _dbContext.Cars.Update(prevCar);
            _dbContext.SaveChanges();


            var viewRequest = new ViewRequestDto
            {
                Id = historyId,
                CustomerId = request.CustomerId,
                CarId = request.CarId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                TotalCharge = totalCharge,

                RequestStatus = request.RequestStatus,
                CheckedBy = request.AuthorizedBy,

            };
            return viewRequest;

        }

        // Get total discount for a rent request
        public float GetTotalDiscount(Guid carId, string customerId)
        {
            var regularUser = _dbContext.ApplicationUsers
                    .Where(u => u.Id == customerId && _dbContext.RentalHistory
                        .Count(r => r.CustomerId == u.Id && r.StartDate > DateTimeOffset.UtcNow.AddMonths(-1)) >= 3)
                    .FirstOrDefault();
            float totalDiscount = 0;
            if (regularUser != null)
            {
                totalDiscount += 10;
            }

            var currentDate = DateTimeOffset.UtcNow;
            var offer = _dbContext.Offers.Where(offers => offers.CarId == carId &&
            offers.StartDate <= currentDate && currentDate <= offers.EndDate.AddDays(1)).FirstOrDefault();
            if (offer != null)
            {
                totalDiscount += offer.Discount;
            }

            return totalDiscount;
        }

        // Cancel the rent request
        public RentalHistory CancelReq(Guid id)
        {
            var rentalHistory = _dbContext.RentalHistory.FirstOrDefault(x => x.Id == id &&
             x.RequestStatus== RequestStatus.Pending || x.RequestStatus == RequestStatus.Approved);

            if (rentalHistory == null)
            {
                throw new Exception("Invalid id!");
            }

            if(rentalHistory.RequestStatus == RequestStatus.Approved){
               var payment = _dbContext.RentalPayment.Where(rp => rp.RentalId == rentalHistory.Id).FirstOrDefault()!;
               payment.PaymentStatus = PaymentStatus.Cancelled;
            }
            rentalHistory.RequestStatus = RequestStatus.Cancelled;

            _dbContext.RentalHistory.Update(rentalHistory);

            var prevCar = _dbContext.Cars.Find(rentalHistory.CarId);
            if (prevCar != null)
            {
                prevCar.Status = CarStatus.Available;
            _dbContext.Cars.Update(prevCar);

            }

            _dbContext.SaveChanges();

            return rentalHistory;
        }
    }

}
