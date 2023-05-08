


using AppDevCw2WebApi.Data;

using AppDevCw2WebApi.DTOs.OfferDtos;
using AppDevCw2WebApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace AppDevCw2WebApi.Services
{
    public class SpecialOffersService 
    {

        private readonly AppDbContext _dbContext;
        public SpecialOffersService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void RemoveOffer(Guid id)
        {
            var offer = _dbContext.Offers.FirstOrDefault(x => x.Id == id);
            if (offer == null)
            {
                throw new Exception("Invalid offer id!");
            }

            _dbContext.Offers.Remove(offer);

            _dbContext.SaveChanges();
        }
        public List<ViewOfferDto> ViewAllOffers()
        {
            var currentDate = DateTimeOffset.UtcNow;
            var dbOffers = _dbContext.Offers.ToList();
            var offers = dbOffers.Select(offer => {
                var carName = _dbContext.Cars.Find(offer.CarId).CarName;
                return new ViewOfferDto
                {
                    Id = offer.Id,

                    CarId = offer.CarId,
                    CarName = carName,
                    offerTitle = offer.OfferTitle,
                    offerDescription = offer.OfferDescription,
                    Discount = offer.Discount,
                    StartDate =  offer.StartDate.ToShortDateString(),
                    EndDate = offer.EndDate.ToShortDateString(),
                };
                }
            ) .ToList();


            return offers;
        }

        public List<OfferCars> GetCarList()
        {
          var offerCars = _dbContext.Cars.Select(car=> new OfferCars
          {
              Id= car.Id,
              Name = car.CarName

          }). ToList();


            return offerCars;
        }

        public List<DTOs.OfferDtos.ViewOfferDto> ViewValidOffers()
        {
            var currentDate = DateTimeOffset.UtcNow;
            var offers = _dbContext.Offers.Where(x => currentDate <= x.EndDate.AddDays(1)  ).ToList().Select(offer=>
            {
                var carName = _dbContext.Cars.Find(offer.CarId).CarName;
                return new ViewOfferDto
                {
                    Id = offer.Id,

                    CarId = offer.CarId,
                    CarName = carName,
                    offerTitle = offer.OfferTitle,
                    offerDescription = offer.OfferDescription,
                    Discount = offer.Discount,
                    StartDate = offer.StartDate.ToShortDateString(),
                    EndDate = offer.EndDate.ToShortDateString(),
                };
            }
            ).ToList();
      

            return offers;
        }

        

        public ViewOfferDto AddOffer(AddSpecialOffersDto offer)
        {
            var carName = ValidateData(addDto: offer);
            var startDate = DateTime.Parse(offer.StartDate).Date;
            if (startDate < DateTime.Now.Date)
            {
                throw new Exception("Invalid start date.");

            }
            var offerId = Guid.NewGuid();
            
            var endDate = DateTime.Parse(offer.EndDate).Date;
            var newOffer = new SpecialOffers
            {
                Id = offerId,
                CarId = offer.CarId,
                OfferTitle = offer.offerTitle,
                OfferDescription = offer.offerDescription,
                Discount = offer.Discount,
                StartDate = startDate,
                EndDate = endDate,

            };
            _dbContext.Offers.Add(newOffer);
            _dbContext.SaveChanges();
            
                var offerView = new ViewOfferDto
            {
                Id= offerId,
                CarId = offer.CarId,
                CarName = carName,
                offerTitle = offer.offerTitle,
                offerDescription = offer.offerDescription,
               Discount = offer.Discount,
                StartDate = startDate.ToShortDateString(),
               EndDate = endDate.ToShortDateString(),

            };
            return offerView;
        }

        private string ValidateData(AddSpecialOffersDto? addDto =default, UpdateSpecialOfferDto? updateDto= default)
        {
            var offer = addDto ?? new AddSpecialOffersDto
            {
                StartDate = updateDto.StartDate,
                EndDate = updateDto.EndDate,
                CarId = updateDto.CarId,
              Discount = updateDto.Discount,
              
              
            };
           
            var car = _dbContext.Cars.FirstOrDefault(car => car.Id == offer.CarId);
            if (car == null)
            {
                throw new Exception("Invalid car id.");
            }

            var carOffers =ViewValidOffers(). Where(prevOffer=> prevOffer.CarId == offer.CarId && DateTime.Parse( prevOffer.StartDate) >=DateTimeOffset.UtcNow && prevOffer.CarId != offer.CarId).ToList();
            carOffers.ForEach(prevOffer =>
            {
                var offerStartDate = DateTime.Parse(offer.StartDate).Date;
                if (DateTime.Parse(prevOffer.StartDate).Date >= offerStartDate && offerStartDate <= DateTime.Parse(offer.EndDate).Date)
                {
                    throw new Exception("There can't be 2 offers for a car at the same time");
                }

            });

            var discount = offer.Discount;
            if (discount < 10 || discount > 90)
            {
                throw new Exception("Invalid discount percent.");
            }

            var startDate = DateTime.Parse(offer.StartDate).Date;
            
            var endDate = DateTime.Parse(offer.EndDate);
            if (startDate >= endDate)
            {
                throw new Exception("End date should be after the start date.");
            }
            return car.CarName;
        }

        public SpecialOffers GetOfferByCarId([FromQuery] Guid carId)
        {
            var currentDate = DateTimeOffset.UtcNow;
            var offer = _dbContext.Offers.Where(offers => offers.CarId == carId && offers.StartDate <= currentDate &&  currentDate <= offers.EndDate.AddDays(1)  ).First();
                
            return offer;
        }

        public ViewOfferDto UpdateOffer(UpdateSpecialOfferDto offer)
        {
            var id = Guid.Parse(offer.Id);
            var prevOffer = _dbContext.Offers.FirstOrDefault(y => y.Id == id);

            if (prevOffer == null)
            {
                throw new Exception("Invalid offer id");

            }
            var startDate = DateTime.Parse(offer.StartDate).Date;
            if (startDate < DateTime.Now.Date && startDate.Date != prevOffer.StartDate.Date)
            {
                throw new Exception("Invalid start date.");

            }
            var carName = ValidateData(updateDto: offer);

           
            
            _dbContext.Entry(prevOffer).State = EntityState.Detached;
            var endDate = DateTime.Parse(offer.EndDate).Date;
            var updatedRecords = new SpecialOffers
            {
                Id = prevOffer.Id,
                CarId = offer.CarId,
                OfferTitle = offer.OfferTitle,
                OfferDescription = offer.OfferDescription,
                Discount = offer.Discount,
                StartDate = startDate.Date,
                EndDate = endDate.Date,

            };
            
            _dbContext.Offers.Update(updatedRecords);
            _dbContext.SaveChanges();

            return new ViewOfferDto
            {
                Id = Guid.Parse(offer.Id),

                CarId = offer.CarId,
                CarName = carName,
                offerTitle = offer.OfferTitle,
                offerDescription = offer.OfferDescription,
                Discount = offer.Discount,
                StartDate = startDate.ToShortDateString(),
                EndDate = endDate.ToShortDateString(),
            };
        }

       
    }
}
