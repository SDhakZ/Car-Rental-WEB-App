using AppDevCw2WebApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sprache;

namespace AppDevCw2WebApi.Controllers
{
    // Authorized user
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CarRentalController : ControllerBase
    {
        // AppDbContext to manage data
        private readonly AppDbContext _dbContext;

        public CarRentalController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        // Gets frequently rented cars
        [HttpGet("frequently_rented_cars")]
        public IActionResult GetFrequentlyRentedCars()
        {
            try
            {
                var rentedCars = _dbContext.RentalHistory
                    .GroupBy(r => r.CarId)
                    .Where(g => g.Count() >= 3 && g.Max(r => r.StartDate) > DateTimeOffset.UtcNow.AddMonths(-1))
                    .Select(g => new
                    {
                        CarId = g.Key,
                        RentalCount = g.Count()
                    })
                    .ToList().Join(_dbContext.Cars, s => s.CarId, c => c.Id, (o, c) => new { Result = o, Car = c })
                            .Select(x => new
                            {
                                rentalCount = x.Result.RentalCount,
                                car = new
                                {
                                    carId = x.Car.Id,
                                    name = x.Car.CarName,
                                    brand = x.Car.Brand,
                                }
                            });
                return Ok(
                    new
                    {
                        message = "success",
                        rentedCars
                    }
                    );
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    
                    message = ex.Message
                });
            }
        }


        // Gets not at all rented cars
        [HttpGet("not_rented_cars")]
        public IActionResult GetNotRentedCars()
        {
            try
            {
                var notRentedCars = _dbContext.Cars
                    .Where(c => !_dbContext.RentalHistory.Any(r => r.CarId == c.Id))
                    .Select(car => new
                    {
                        id = car.Id,
                        name = car.CarName,
                                    brand = car.Brand,

                    });

                return Ok(new
                {
                    message = "success",
                    notRentedCars
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


        // Gets regular customers
        [HttpGet("regular_customers")]
        public IActionResult GetFrequentCustomers()
        {
            try
            {
                var regularCustomers = _dbContext.ApplicationUsers
                    .Where(u => _dbContext.RentalHistory
                        .Count(r => r.CustomerId == u.Id && r.StartDate > DateTimeOffset.UtcNow.AddMonths(-1)) >= 3)
                    .Select(customer => new
                    {
                        id = customer.Id,
                        username = customer.UserName,
                        fullName = customer.Name,
                        email = customer.Email,
                        phoneNumber = customer.PhoneNumber,

                    });

                return Ok(new { message = "success", regularCustomers });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    
                    message = ex.Message
                });
            }
        }


        // Gets customer details that have been inactive for 3months
        [HttpGet("inactive_customers")]
        public IActionResult GetInactiveCustomers()
        {
            try
            {
                var currentDate = DateTimeOffset.UtcNow;
                var inactiveCustomers = _dbContext.ApplicationUsers.ToList().Where(user =>
                currentDate.Date.Subtract(user.CreatedAt).Days > 90
                 
                    
                    )
                    .Where(u =>  !_dbContext.RentalHistory
                        .Any(r => r.CustomerId == u.Id && r.StartDate > DateTimeOffset.UtcNow.AddMonths(-3)))
                    .Select(customer => new
                    {
                        id = customer.Id,
                        username = customer.UserName,
                        fullName = customer.Name,
                        email = customer.Email,
                        phoneNumber = customer.PhoneNumber,

                    });

                return Ok(new
                {
                    message = "success",
                    inactiveCustomers
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

    }
}
