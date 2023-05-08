using AppDevCw2WebApi.Data;
using AppDevCw2WebApi.DTOs;
using AppDevCw2WebApi.DTOs.RentalHistory;
using AppDevCw2WebApi.Models;
using AppDevCw2WebApi.Models.Static;
using AppDevCw2WebApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AppDevCw2WebApi.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]

    public class RentalHistoryController : ControllerBase
    {
        private readonly RentalHistoryService _rentalService;
        private readonly AppDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;


        // Constructor for initializing instances of AppDbContext, RentalHistoryService and UserManager
        public RentalHistoryController(RentalHistoryService rentalHistory, AppDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
            _rentalService = rentalHistory;
        }

        // Fetch all rental history
        [HttpGet]
        [Route("get_rental_history")]
        public IActionResult GetAllRentalHistory([FromQuery] string? status, [FromQuery] string? userId)
        {
            try
            {
                var rentalHistory = _rentalService.GetRentalHistory(status, userId);
                return Ok(new
                {
                    message = "success",
                    history = rentalHistory
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

       
        // Approve user request
        [Authorize(Roles = "Admin,Staff")]
        [HttpPatch]
        [Route("approve_request")]
        public IActionResult ApproveRequest(Guid requestId)
        {
            try
            {
                var authUsername = User.Identity!.Name;
                _rentalService.ApproveRequest(requestId, authUsername);
                return Ok(new
                {
                    message = "success"
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

        // Get bill status
        [Authorize(Roles = "Admin,Staff")]
        [HttpPost]
        [Route("bill_status")]
        public IActionResult GetBillStatus(string customerId)
        {
            try
            {
                var status =  _rentalService.GetBillStatus(customerId);
                return Ok(new
                {
                    message = "success",
                    billStatus = status
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

        // Deny rental request
        [Authorize(Roles = "Admin,Staff")]
        [HttpPatch]
        [Route("deny_request")]
        public IActionResult DenyRequest(Guid requestId)
        {
            try
            {
                var authUsername = User.Identity!.Name;

                _rentalService.DenyRequest(requestId, authUsername);
                return Ok(new
                {
                    message = "success"
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

        // Return rented car
        [Authorize(Roles = "Admin,Staff")]
        [HttpPut("return_car")]
        public async Task<IActionResult> ReturnCar(ReturnCarDto dto)
        {
            var rentalId = dto.RentalId;
            try
            {

                var rental =  _context.RentalHistory.Where(rh=> rh.Id == rentalId && rh.RequestStatus == RequestStatus.Paid).FirstOrDefault();

                if (rental == null)
                {
                    return NotFound(
                        new
                        {
                            message = "Invalid request"
                        }
                        );
                }
                var returnDate = DateTime.Parse(dto.ReturnDate);
                var currentDate = DateTime.Now.Date;
                if (returnDate.Date > currentDate && rental.StartDate <= currentDate)
                {
                    return BadRequest(new
                    {
                        message = "Invalid return date"
                    }) ;
                }

                // Check if the user is authorized to update the rental
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized();
                }
                var roles = await _userManager.GetRolesAsync(user);
                    rental.ReturnDate = returnDate;
                    rental.RequestStatus = RequestStatus.Returned;

                    var carReturn = await _context.Cars.FindAsync(rental.CarId);

                    carReturn.Status = CarStatus.Available;
                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        message = "success"
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
