using AppDevCw2WebApi.Data;
using AppDevCw2WebApi.DTOs;
using AppDevCw2WebApi.Models;
using AppDevCw2WebApi.Models.Static;
using AppDevCw2WebApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;

namespace AppDevCw2WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly AppDbContext _dbContext;


        // Constructor for instances of AppDbContext
        public SalesController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Fetch customer rental details
        [HttpPost]
        [Route("rentals_paid")]
        public ActionResult<dynamic> GetCustomerRentals([FromBody] SalesDto salesDto)
        {
            var rentalHistory = _dbContext.RentalHistory
                 .Where(r => r.RequestStatus == RequestStatus.Paid || r.RequestStatus == RequestStatus.Returned).ToList();

            if (!string.IsNullOrEmpty(salesDto.CustomerId))
            {

                var customerId = salesDto.CustomerId;
                var prevCustomer = _dbContext.ApplicationUsers.FirstOrDefault(u => u.Id == customerId);
                if (prevCustomer == null)
                {
                    return BadRequest(
                        new
                        {
                            message = "Invalid customer id."
                        });
                }

                var currentDate = DateTime.Now.Date;
                DateTime startDate;
                DateTime endDate;
                try
                {
                    startDate = DateTime.Parse(salesDto.StartDate).Date;
                    if (startDate > currentDate)
                    {
                        throw new Exception();
                    }

                }
                catch (Exception)
                {
                    return BadRequest(new { message = "Invalid start date." });
                }

                try
                {
                    endDate = DateTime.Parse(salesDto.EndDate).Date;
                    if (endDate <= startDate
                        )
                    {
                        throw new Exception();
                    }
                }
                catch (Exception)
                {
                    return BadRequest(new { message = "Invalid end date." });
                }
                rentalHistory = rentalHistory
                   .Where(r => {
                       return r.CustomerId == customerId && r.StartDate >= startDate && r.EndDate <= endDate.AddDays(1);
                   
                   }).ToList();

            }

            var rentalDetails = rentalHistory.Select(rh =>
            {
                var customer = _dbContext.ApplicationUsers.First(customer => customer.Id == rh.CustomerId);
                var staff = _dbContext.ApplicationUsers.FirstOrDefault(staff => staff.Id == rh.AuthorizedBy);
                var car = _dbContext.Cars.First(car => car.Id == rh.CarId);
                var rp = _dbContext.RentalPayment.First(rp => rp.RentalId == rh.Id);
                return new
                {
                    id = rh.Id,
                    startDate = rh.StartDate.ToShortDateString(),
                    endDate = rh.EndDate.ToShortDateString(),
                    requestStatus = rh.RequestStatus,
                    totalCharge = rh.TotalCharge,
                    paymentType = rp.PaymentType,
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

            return Ok(new
            {
                message = "success",
                rentalData = rentalDetails
            });
        }
    }
}




