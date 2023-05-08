using CloudinaryDotNet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text.Json;

namespace AppDevCw2WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [Authorize(Roles ="Admin,Staff")]
        [HttpGet("yo")]
        public IActionResult yo()
        {
            return Ok("Mission successful.");
        }

        [HttpPost("yo")]
        public IActionResult yoyo()
        {
            return Ok("Bravo!");
        }

          }
}
