using AppDevCw2WebApi.Data;
using AppDevCw2WebApi.DTOs;
using AppDevCw2WebApi.Models;
using AppDevCw2WebApi.Models.Static;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Cryptography;

namespace AppDevCw2WebApi.Services
{
    public class RentalHistoryService
    {
        // Creating fields for constructor injection
        private readonly AppDbContext _dbContext;
        private readonly UserManager<IdentityUser> _userManager;

        // Constructor Injection
        public RentalHistoryService(AppDbContext dbContext, UserManager<IdentityUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        // Service used to approve the request made by customer.
        public void ApproveRequest(Guid requestId, string authUsername)
        {
            var request = _dbContext.RentalHistory.FirstOrDefault(x => x.Id == requestId && x.RequestStatus == RequestStatus.Pending);

            if (request == null)
            {
                throw new Exception("Invalid request");
            }
            var billStatus = GetBillStatus(request.CustomerId);
            if (billStatus == BillStatus.Due)
            {
                throw new Exception("You can't approve this request as the customer has pending bills.");

            }
            var staff = _dbContext.ApplicationUsers.FirstOrDefault(x => x.UserName == authUsername);
            if (staff == null)
            {
                throw new Exception("Invalid staff id!");
            }

            var carDetails = _dbContext.Cars.FirstOrDefault(x => x.Id == request.CarId);
            if (carDetails == null)
            {
                throw new Exception("Car doesn't exist.");
            }
           
            request.RequestStatus = RequestStatus.Approved;
            request.AuthorizedBy = staff.Id;

            int rentedDays = (int)(request.EndDate - request.StartDate).TotalDays == 0 ? 1 : (int)(request.EndDate - request.StartDate).TotalDays;
            var payment = new RentalPayment
            {
                PaymentId = Guid.NewGuid(),
                Amount = request.TotalCharge,
                PaymentStatus = PaymentStatus.Pending,
                RentalId = request.Id
            };
            _dbContext.RentalHistory.Update(request);
            _dbContext.RentalPayment.Add(payment);
            _dbContext.SaveChanges();
        }

        // Service used to reject the request made by customer.
        public void DenyRequest(Guid requestId, string authUsername)
        {
            var request = _dbContext.RentalHistory.FirstOrDefault(x => x.Id == requestId &&  x.RequestStatus == RequestStatus.Pending);

            if (request == null)
            {
                throw new Exception("Invalid request");
            }
            var billStatus = GetBillStatus(request.CustomerId);
            if (billStatus == BillStatus.Paid)
            {
                throw new Exception("You can't deny this request.");

            }
            var staff = _dbContext.ApplicationUsers.FirstOrDefault(x => x.UserName == authUsername);
            if (staff == null)
            {
                throw new Exception("Invalid staff id!");
            }

            request.RequestStatus = "Denied";
            request.AuthorizedBy = staff.Id;

            var car = _dbContext.Cars.Find(request.CarId);
            car.Status = CarStatus.Available;
            _dbContext.RentalHistory.Update(request);
            _dbContext.Cars.Update(car);
            _dbContext.SaveChanges();
        }

        // Service used to get rental history
        public dynamic GetRentalHistory(string? status, string? userId)
        {
            var rentalHistory = _dbContext.RentalHistory.ToList();
            var pendingApproved = $"{RequestStatus.Pending}-{RequestStatus.Approved}";
            var validStatus = new List<String> { RequestStatus.Pending, RequestStatus.Approved, RequestStatus.Denied, RequestStatus.Cancelled, RequestStatus.Paid, RequestStatus.Returned, RequestStatus.Rented,pendingApproved };

            if (status != null)
            {
                if (!validStatus.Contains(status))
                {
                    throw new Exception("Invalid status.");
                }
                if(status == pendingApproved)
                {
                    var statusList = status.Split('-');
                    rentalHistory = rentalHistory.Where(rh =>  status.Contains(rh.RequestStatus)).ToList();

                }
                else
                {
                    rentalHistory = rentalHistory.Where(rh => rh.RequestStatus == status).ToList();

                }
            }
            if (userId != null)
            {
                rentalHistory = rentalHistory.Where(rh => rh.CustomerId == userId).ToList();
            }
            
            var rentalDetails = rentalHistory.Select(rh =>
            {
                var customer = _dbContext.ApplicationUsers.FirstOrDefault(customer => customer.Id == rh.CustomerId);
                var staff = _dbContext.ApplicationUsers.FirstOrDefault(staff => staff.Id == rh.AuthorizedBy);
                var car = _dbContext.Cars.FirstOrDefault(car => car.Id == rh.CarId);
                return new
                {
                    id = rh.Id,
                    startDate = rh.StartDate.ToShortDateString(),
                    endDate = rh.EndDate.ToShortDateString(),
                    requestStatus = rh.RequestStatus,
                    totalCharge = rh.TotalCharge,
                    returnDate = rh.ReturnDate,
                    customer = new
                    {
                        id = customer.Id,
                        name = customer.Name,
                        username = customer.UserName
                    },
                    authorizedBy = staff == null ? null : new
                    {
                        id = staff.Id,
                        name = staff.Name,
                        username = staff.UserName
                    },
                    car = new
                    {
                        id = car.Id,
                        name = car.CarName,
                        brand = car.Brand,
                        image = car.ImageUrl
                    }


                };



            });
            return rentalDetails;
        }


        // Service used to get the bill status
        public string GetBillStatus(string customerId)
        {
            var prevUser = _dbContext.ApplicationUsers.Find(customerId);
            if(prevUser == null)
            {
                throw new Exception("Inavlid user id");
            }
            var unpaidDamageBill =

                _dbContext.DamagePayment
                .Where(rh => rh.PaymentStatus == PaymentStatus.Pending).ToList()
                .Where(data =>
                    {
                 var damageRecord = _dbContext.DamageRecord.FirstOrDefault(dr => dr.Id == data.DamageRecordId);
            var rentalHistory = damageRecord != null ? _dbContext.RentalHistory.Find(damageRecord.RentalId) : null;
            var customer = _dbContext.ApplicationUsers.Find(damageRecord.RentalHistory.CustomerId)!;

            return customer.Id == customerId;

            }).FirstOrDefault();

            if (unpaidDamageBill != null)
            {
                return BillStatus.Due;
            }
                return BillStatus.Paid;
        }

        // Service used to get the rental history 
        public RentalHistory GetRentalHistoryById(Guid Id)
        {
            var rentalHistory = _dbContext.RentalHistory.FirstOrDefault(x => x.Id == Id);
            return rentalHistory;
        }
    }
}
