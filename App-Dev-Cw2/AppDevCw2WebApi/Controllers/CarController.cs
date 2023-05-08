using AppDevCw2WebApi.DTOs;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using AppDevCw2WebApi.Models;
using System.Reflection.Metadata;
using AppDevCw2WebApi.Services;
using System.Xml.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.FileIO;
using AppDevCw2WebApi.Data;
using AppDevCw2WebApi.Models.Static;

namespace AppDevCw2WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        // CarService, ImageService and AppDbContext to manage and access user data
        private readonly CarService _carService;
        private readonly ImageService _imgService;
        private readonly AppDbContext _dbContext;

        public CarController(CarService carService, ImageService imgService, AppDbContext dbContext)
        {
            _carService = carService;
            _imgService = imgService;
            _dbContext = dbContext;
        }

        //Authorized user Staff and Admin
        [Authorize(Roles = "Admin,Staff")]
        [HttpPost]
        [Route("add_car")]
        //Adds new car
        public async Task<IActionResult> AddCar([FromForm] AddCarDto car)
        {
            var carImage = car.Image;
            var imageCheck = CheckImage(carImage);
            if (imageCheck != null)
            {
                return imageCheck;

            }
            try
            {
                var carView = await _carService.AddCar(car);
                return Ok(new
                {
                    message = "success",
                    car = carView
                });

            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        //Checks image
        public IActionResult? CheckImage(IFormFile carImage)
        {
            if (carImage.Length > 5 * 1024 * 1024)
            {
                Response.StatusCode = 413; // Payload Too Large
                return Content("File size exceeds the limit of 5 mb");
            }
            if (!_imgService.IsImage(carImage))
            {
                Response.StatusCode = 415; // Unsupported Media type
                return Content("File type not supported");

            }
            return null;
        }
        //Gets all car
        [HttpGet]
        [Route("get_cars")]
        public IActionResult GetAllCars(string? brandName, string? fuelType, string? status)
        {
            try
            {
                List<Cars> cars = _carService.GetAllCars();
                if (!string.IsNullOrEmpty(brandName))
                {
                    cars = cars.Where(car => car.Brand == brandName).ToList();

                }
                if (!string.IsNullOrEmpty(fuelType))
                {
                    var validFuelTypes = new List<String> { "Petrol", "Diesel", "Electric", "Hybrid" };
                    if (!validFuelTypes.Contains(fuelType))
                    {
                        return BadRequest(new
                        {
                            message = "Invalid fuel type!"
                        });
                    }
                    cars = cars.Where(car => car.FuelType == fuelType).ToList();

                }
                if (!string.IsNullOrEmpty(status))
                {
                    var validStatus = new List<String> { CarStatus.Available, CarStatus.Unavailable, CarStatus.Damaged, CarStatus.Rented };

                    if (!validStatus.Contains(status))
                    {
                        return BadRequest(new
                        {
                            message = "Invalid car status"
                        });
                    }
                    cars = cars.Where(car => car.Status == status).ToList();

                }
                return Ok(new
                {
                    message = "success",
                    cars
                });
            }
            catch (Exception ex)
            {
                return BadRequest(
                    new
                    {
                        message = ex.Message
                    });
            }
        }

        //Updates car details
        [HttpPatch]
        [Authorize(Roles = "Admin")]
        [Route("update_car")]
        public async Task<IActionResult> UpdateCar([FromForm] UpdateCarDto car)
        {
            var carImage = car.Image;

            try

            {
                if (carImage != null)
                {
                    var imageCheck = CheckImage(carImage);

                    if (imageCheck != null)
                    {
                        return imageCheck;

                    }

                }
                Cars updatedCar = await _carService.UpdateCar(car);

                return Ok(
                    new
                    {
                        message = "success",
                        car = updatedCar
                    }
                    );

            }
            catch (Exception ex)
            {
                return BadRequest(
                    new
                    {
                        message = ex.Message
                    }
                    );
            }

        }
        //Gets the detail of car by id
        [HttpGet]
        [Route("car_details")]
        public IActionResult GetCarById(Guid id)
        {
            try
            {
                var carDetail = _carService.GetCarById(id);
                return Ok(new
                {
                    message = "success",
                    car = carDetail
                });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //Delete the car details
        [Authorize(Roles = "Admin,Staff")]
        [HttpDelete("remove_car")]
        public async Task<IActionResult> RemoveCar(String id)
        {
            try
            {
                var guId = Guid.Parse(id);
                bool success = await _carService.RemoveCar(guId);
                if (success)
                {
                    return Ok(new
                    {
                        message = "Car removed successfully."
                    });

                }
                else
                {
                    return BadRequest(new { message = "Failed to delete car image data" });
                }


            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    }
}
