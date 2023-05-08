using AppDevCw2.Models;
using AppDevCw2WebApi.Data;
using AppDevCw2WebApi.DTOs;
using AppDevCw2WebApi.DTOs.CustomerRequests;
using AppDevCw2WebApi.DTOs.OfferDtos;
using AppDevCw2WebApi.Models;
using AppDevCw2WebApi.Models.Static;
using AppDevCw2WebApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AppDevCw2WebApi.Controllers
{
    // Authorized user
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        // UserManager , RentRequestService and AppDbContext to manage and access user data
        private readonly RentRequestService _rentService;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly AppDbContext _dbContext;

        public CustomerController(RentRequestService rentRequestService, UserManager<IdentityUser> userManager, AppDbContext dbContext)
        {
            _rentService = rentRequestService;
            _userManager = userManager;
            _dbContext = dbContext;

        }


        // Makes the request for renting the car
        [HttpPost]
        [Route("make_request")]
        public IActionResult MakeRentRequest(MakeRequestDto makeRequestDto)
        {
            try
            {
                var request =  _rentService.MakeRequest(makeRequestDto);
                return Ok(new
                {
                    message = "success",
                    request = request
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }


        // Gets the discount
        [HttpPost]
        [Route("get_discount")]
        public async Task<IActionResult> GetTotalDiscount(Guid carId)
        {
            try
            {
                var authUsername = User.Identity!.Name;
                var customerId = _dbContext.ApplicationUsers.Where(user => user.UserName == authUsername).First().Id;

                var totalDiscount =  _rentService.GetTotalDiscount(carId,customerId);

                var user = _userManager.Users.Where(user => user.Id == customerId).FirstOrDefault();
                if (user != null)
                {
                    var role = await _userManager.GetRolesAsync(user);
                    var staffRoles = new List<String>{ UserRoles.Admin, UserRoles.Staff };
                    if (staffRoles.Contains( role[0]))
                    {
                        totalDiscount += 25;
                    }
                }
                if(totalDiscount > 50) {
                    totalDiscount = 50;
                }
                return Ok(new
                {
                    message = "success",
                    discount = totalDiscount

                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        // Gets the notification
        [HttpGet]
        [Route("get_notifs")]
        public IActionResult GetNotifications()
        {
            try
            {
                var authUsername = User.Identity.Name;
                var userId = _dbContext.ApplicationUsers.Where(user => user.UserName == authUsername).First().Id!;
                var rentalPayments = _dbContext.RentalHistory.Where(rh => rh.CustomerId == userId && rh.RequestStatus == RequestStatus.Approved ).ToList().Select(rh =>
                {
                    var car = _dbContext.Cars.Find(rh.CarId)!;
                    var rentalPayment = _dbContext.RentalPayment.Where(rp => rp.RentalId == rh.Id).FirstOrDefault();

                    return new
                    {
                        historyId = rh.Id,
                        paymentId = rentalPayment.PaymentId,
                        startDate = rh.StartDate.ToShortDateString(),
                        endDate = rh.EndDate.ToShortDateString(),
                        amount = rh.TotalCharge,
                        status = rh.RequestStatus,
                        car = new
                        {
                            id = car.Id,
                            name = car.CarName,
                            brand = car.Brand,
                        }
                    };
                }

                );

                var deniedRequests = _dbContext.RentalHistory.Where(rh => rh.CustomerId == userId && rh.RequestStatus == RequestStatus.Denied).ToList().Select(rh =>
                {
                    var car = _dbContext.Cars.Find(rh.CarId)!;
                    return new
                    {
                        historyId = rh.Id,
                        startDate = rh.StartDate.ToShortDateString(),
                        endDate = rh.EndDate.ToShortDateString(),
                        amount = rh.TotalCharge,
                        status = rh.RequestStatus,
                        car = new
                        {
                            id = car.Id,
                            name = car.CarName,
                            brand = car.Brand,
                        }
                    };
                }
                );
              
                    var damagePayments = _dbContext.DamagePayment.Where(dp => dp.PaymentStatus == PaymentStatus.Pending).ToList().Select(dp =>
                {
                    var damageRecord = _dbContext.DamageRecord.Include(dr => dr.RentalHistory).FirstOrDefault(dr => dr.Id == dp.DamageRecordId);
                    var rentalHistory = damageRecord != null ? _dbContext.RentalHistory.Find(damageRecord.RentalId) : null;
                    
                var car = damageRecord != null ? _dbContext.Cars.Find(damageRecord.RentalHistory.CarId) : null;

                    if (rentalHistory.CustomerId == userId )
                    {
                        return new
                        {
                            id = dp.PaymentId,
                            amount = dp.Amount,
                            status = dp.PaymentStatus,
                            car = car == null? null: new
                            {
                                id = car.Id,
                                name = car.CarName,
                                brand = car.Brand,
                            }
                        };
                    }
                    return null;

                }).Where(data=> data!=null)
                 
                    ;
                return Ok(new { message ="success", rentalPayments, deniedRequests, damagePayments  });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        // Cancel the request made for renting car
        [HttpPost]
        [Route("cancel_request")]
        public IActionResult CancelRequest(Guid id)
        {
            try
            {
                RentalHistory updatedData =  _rentService.CancelReq(id);

               return  Ok(
                    new
                    {
                        message = "success"
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

    }
}
