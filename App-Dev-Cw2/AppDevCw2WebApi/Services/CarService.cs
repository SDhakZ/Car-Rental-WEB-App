using AppDevCw2WebApi.Data;
using AppDevCw2WebApi.DTOs;
using AppDevCw2WebApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AppDevCw2WebApi.Services
{
    public class CarService 
    {
        // Creating fields for constructor injection
        private readonly AppDbContext _dbContext;
        private readonly ImageService _imgService;

        // Constructor Injection
        public CarService(AppDbContext dbContext, ImageService imgService)
        {
            _dbContext = dbContext;
            _imgService = imgService;
        }


        // Service used to add cars 
        public async Task<Cars> AddCar(AddCarDto car) 
        {
            ValidateData(car.FuelType, car.SafetyRating);
            var imgUrl = await _imgService.UploadImage(car.Image, isUser: false);

            var CarId = Guid.NewGuid();
            var carStatus = "Available";
            var newCar = new Cars
            {
                Id = CarId,
                CarName = car.CarName,
                Description = car.Description,
                Brand = car.Brand,
                RatePerDay = car.RatePerDay,
                Color = car.Color,
                Status = carStatus,
                Mileage = car.Mileage,
                FuelType = car.FuelType,
                SafetyRating = car.SafetyRating,
                ImageUrl = imgUrl,
            };
            _dbContext.Cars.Add(newCar);
            _dbContext.SaveChanges();

            return newCar;
        }


        // Service used to get all cars 
        public List<Cars> GetAllCars()
        {
            var cars = _dbContext.Cars
                .ToList();

            return cars;
        }


        // Service used to get car by id 
        public Cars GetCarById(Guid id)
        {

            var data = _dbContext.Cars.FirstOrDefault(x => x.Id == id);
            return data;
        }


        // Service used to remove car 
        public async Task<bool> RemoveCar(Guid id)
        {
            var car = _dbContext.Cars.FirstOrDefault(x => x.Id == id);
            if (car == null)
            {
                throw new Exception("Invalid car id!");
            }

            _dbContext.Cars.Remove(car);
       
            var success = await _imgService.DeleteImage(car.ImageUrl);
            if (success) {
                _dbContext.SaveChanges();
            }

            return success;
        }


        // Service used to validate data of cars 
        private void ValidateData(string fuelType, string safetyRating)
        {
            var validFuelTypes = new List<String> { "Petrol", "Diesel", "Electric", "Hybrid" };
            if (!validFuelTypes.Contains(fuelType))
            {
                throw new Exception("Invalid fuel type!");
            }
            var validRatings = new List<String> { "A", "B", "C", "D", "E" };

            if (!validRatings.Contains(safetyRating))
            {
                throw new Exception("Invalid safety rating!");
            }
        }


        // Service used to update the cars details 
        public async Task<Cars> UpdateCar(UpdateCarDto car)
        {
            var carId = Guid.Parse(car.Id);
            var prevCar = CarExists(carId);
            if (prevCar == null)
            {
                throw new Exception("Invalid car id!");
            }
            _dbContext.Entry(prevCar).State = EntityState.Detached;
            ValidateData(car.FuelType, car.SafetyRating);

            var updatedCar = new Cars
            {
                Id = prevCar.Id,
                CarName = car.CarName,
                Description = car.Description,
                Brand = car.Brand,
                RatePerDay = car.RatePerDay,
                Color = car.Color,
                Status = prevCar.Status,
                Mileage = car.Mileage,
                FuelType = car.FuelType,
                SafetyRating = car.SafetyRating,
                ImageUrl =  prevCar.ImageUrl ,
            };
            if (car.Image != null)
            {
                updatedCar.ImageUrl = await _imgService.UploadImage(car.Image, isUser: false);
                bool isDeleted = await _imgService.DeleteImage(prevCar.ImageUrl);
                if (!isDeleted)
                {
                    throw new Exception("Failed to update the image.");

                }

            }
           
            _dbContext.Cars.Update(updatedCar);
            _dbContext.SaveChanges();
            return updatedCar;

        }


        // Service used check if the car exists or not in database
        private Cars? CarExists(Guid id)
        {
            return (_dbContext.Cars?.FirstOrDefault(e => e.Id == id));
        }

    }
   
}