using AppDevCw2WebApi.DTOs.DamagePayments;
using AppDevCw2WebApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppDevCw2WebApi.Controllers
{

    [Route("api/[controller]")]
    [ApiController]

    public class DamagePaymentController : ControllerBase
    {
        private readonly PaymentService _paymentService;

        public DamagePaymentController(PaymentService damagePaymentService)
        {
            _paymentService = damagePaymentService;
        }

        // Authorized user with the "Admin" and "Staff" role 
        [Authorize(Roles = "Admin,Staff")]
        [HttpPost]
        [Route("create_bill")]
        // Creates damage bill to be sent to the customer
        public IActionResult CreateDamagePaymentBill(CreateDamageBillsDto damagePayment)
        {
            try
            {
                var loggedUsername = User.Identity!.Name!;

                var paymentRecord = _paymentService.CreateNewDamageBill(damagePayment, loggedUsername);

                return Ok(new
                {
                    message = "success",
                    paymentRecord
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

        // Get all damage payment records based on paymentStatus
        [Authorize(Roles = "Admin, Staff")]
        [HttpGet]
        [Route("get_damage_payments")]
        public IActionResult GetAllDamagedPaymentRecords(string? paymentStatus)
        {
            try
            {
                var payment = _paymentService.GetAllPayments(paymentStatus);

                return Ok(new
                {
                    message = "success",
                    payments = payment
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

        // Confirms the offline damage payment done by customer
        [HttpPut("confirm_payment")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> ConfirmPayment(Guid paymentId)
        {
            try
            {
                var loggedInUsername = User.Identity!.Name!;
                var damageRecords = await _paymentService.ConfirmDamagePayment(paymentId, loggedInUsername);
                return Ok(new
                {
                    message = "success",
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

        // Verifies the online damage payment done by customer
        [Authorize]
        [HttpPost("verify_payment")]
        public async Task<IActionResult> VerifyPayment(string token, double amount)
        {
            try
            {
                var authUsername = User.Identity!.Name!;

                var response = await _paymentService.VerifyPaymentData(token, amount, authUsername, isRental: false);

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
