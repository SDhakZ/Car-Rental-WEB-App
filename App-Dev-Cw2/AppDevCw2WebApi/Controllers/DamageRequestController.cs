using AppDevCw2WebApi.Data;
using AppDevCw2WebApi.DTOs;
using AppDevCw2WebApi.DTOs.DamageDtos;
using AppDevCw2WebApi.Models.Static;
using AppDevCw2WebApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppDevCw2WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class DamageRequestController : ControllerBase
    {
        private readonly DamageRequestService _damageRequest;

        public DamageRequestController(DamageRequestService damageReq)
        {
            _damageRequest = damageReq;
        }

        // Makes the damage request done by customer
        [HttpPost]
        [Route("make_request")]
        [Authorize]
        public IActionResult MakeDamageReq(AddDamageReq damagedReqDto)
        {
            try
            {
                var rentalHistory = _damageRequest.MakeDamageRequest(damagedReqDto);
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


        // Gets all the damage requests based on request status
        [HttpGet]
        [Route("get_all_req")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult GetAllRequest(string? requestStatus)
        {
            try
            {
               var damageRecords = _damageRequest.GetAllDamageRequests(requestStatus);
                return Ok(new
                {
                    message = "success",
                    damageRequests = damageRecords
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