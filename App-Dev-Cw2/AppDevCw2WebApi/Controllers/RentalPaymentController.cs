using AppDevCw2WebApi.Data;
using AppDevCw2WebApi.Models;
using AppDevCw2WebApi.Models.Static;
using AppDevCw2WebApi.Services;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AppDevCw2WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RentalPaymentController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly PaymentService _paymentService;

        // Constructor for instances of AppDbContext and PaymentServices
        public RentalPaymentController(AppDbContext dbContext, PaymentService paymentService)
        {
            _dbContext = dbContext;
            _paymentService = paymentService;
        }

        // User role authorization
        [Authorize(Roles = "Admin,Staff")]
        // Get method to fetch rental payments
        [HttpGet("rental_payments")]
        public async Task<ActionResult<dynamic>> GetRentalPayments(string?
            paymentStatus)
        {
            var validStatus = new List<String> { PaymentStatus.Paid, PaymentStatus.Pending, PaymentStatus.Cancelled };
            var payments = await _dbContext.RentalPayment.ToListAsync();

            if (paymentStatus != null)
            {
                if (!validStatus.Contains(paymentStatus))
                {
                    return BadRequest(new { message = "Invalid payment status" });
                }
                payments = _dbContext.RentalPayment
                     .Where(p => p.PaymentStatus == paymentStatus)
                     .ToList();


            }
            var paymentDetails = payments.Select(payment =>
            {
                var checkedBy = _dbContext.ApplicationUsers.Find(payment.CheckedBy);
                var rh = _dbContext.RentalHistory.Find(payment.RentalId)!;
                var customer = _dbContext.ApplicationUsers.FirstOrDefault(customer => customer.Id == rh.CustomerId);
                var car = _dbContext.Cars.FirstOrDefault(car => car.Id == rh.CarId);

                return new
                {
                    id = payment.PaymentId,
                    date = payment.PaymentDate.ToShortDateString(),
                    amount = payment.Amount,
                    paymentStatus = payment.PaymentStatus,

                    checkedBy = checkedBy == null ? null :
                    new
                    {
                        id = checkedBy.Id,
                        name = checkedBy.Name,
                        username = checkedBy.UserName,
                    }
                    ,
                    rentalDetails = new
                    {

                        id = rh.Id,
                        customer = new
                        {
                            id = customer.Id,
                            name = customer.Name,
                            username = customer.UserName
                        },
                        car = new
                        {
                            id = car.Id,
                            name = car.CarName,
                            brand = car.Brand,
                            image = car.ImageUrl
                        },
                    },
                };
            });
            return new
            {
                message = "success",
                payments = paymentDetails
            };
        }


        // Confirm payment methods
        [Authorize(Roles = "Admin,Staff")]
        [HttpPut("confirm_payment")]
        public async Task<IActionResult> ConfirmPayment(Guid paymentId)
        {
            try
            {
                var authUsername = User.Identity!.Name!;
                var response = await _paymentService.ConfirmRentalPayment(paymentId, authUsername);

                return Ok(new
                {
                    message = "success"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        // Verify payment method
        [Authorize]
        [HttpPost("verify_payment")]
        public async Task<IActionResult> VerifyPayment(string token, double amount)
        {
            try
            {
                var authUsername = User.Identity!.Name!;

                var response = await _paymentService.VerifyPaymentData(token, amount, authUsername);

                return Ok(new
                {
                    message = "success"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

