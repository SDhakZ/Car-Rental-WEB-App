using AppDevCw2.Models;
using AppDevCw2WebApi.Data;
using AppDevCw2WebApi.DTOs.UserAuthDtos;
using AppDevCw2WebApi.Models.Static;
using AppDevCw2WebApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata;
using System.Security.Claims;
using System.Text;
using System.Xml.Linq;

namespace AppDevCw2WebApi.Controllers
{

    [Route("api/[controller]")]
    [ApiController]

    public class UserAuthController : ControllerBase

    {

        private readonly UserManager<IdentityUser> _userManager;

        private readonly SignInManager<IdentityUser> _signInManager;

        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly AppDbContext _dbContext;

        private readonly ImageService _imgService;
        private readonly DocUploadService _docUploadService;
        private readonly IConfiguration _configuration;


        // Constructor for initializing instances of classes for authentication and autjorization
        public UserAuthController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, RoleManager<IdentityRole> roleManager,
            ImageService imageService, IConfiguration configuration, DocUploadService docUploadService, AppDbContext appDbContext 
            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _imgService = imageService;
            _configuration = configuration;
            _docUploadService = docUploadService;
            _dbContext = appDbContext;

        }

        // Customer registration method
        [HttpPost("register_customer")]
        public async Task<IActionResult> Register([FromForm] RegisterDto model)
        {
            try
            {
                var prevUser = await _userManager.FindByNameAsync(model.Username);
                if (prevUser != null)
                {
                    return BadRequest(new { message = "Username already taken." });
                }
                var prevEmailUser = await _userManager.FindByEmailAsync(model.Email);
                if (prevEmailUser != null)
                {
                    return BadRequest(new { message = "Email already taken." });
                }

                ApplicationUser user = new ApplicationUser
                {
                    UserName = model.Username,
                    Email = model.Email,
                    PhoneNumber = model.PhoneNumber,
                    Address = model.Address,
                    Name = model.FullName,
                    CreatedAt = DateTime.UtcNow,
                };
                var document = model.Document;
                if (document != null)
                {
                    var imageCheck = CheckImage(document);
                    if (imageCheck != null)
                    {
                        return imageCheck;

                    }
                    var docType = model.DocType;
                    if (string.IsNullOrEmpty(docType))
                    {
                        return BadRequest(new { message = "DocType not found" });
                    }

                    var validDoctypes = new List<String> { "license", "citizenship" };

                    if (!validDoctypes.Contains(docType))
                    {
                        return BadRequest(new { message = "Invalid DocType." });

                    }


                    try
                    {
                        var imgUrl = await _imgService.UploadImage(document);
                        user.DocumentUrl = imgUrl;
                        user.DocType = validDoctypes.IndexOf(docType) + 1;

                    }
                    catch (Exception ex)
                    {
                        return BadRequest(ex.Message);
                    }

                }

                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }
                else if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, UserRoles.Customer);

                }

                await _signInManager.SignInAsync(user, isPersistent: false);

                return Ok(new { message = "Registration successful" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        // Validation of image
        [ApiExplorerSettings(IgnoreApi = true)]
        public IActionResult? CheckImage(IFormFile document)
        {
            if (document.Length > 1.5 * 1024 * 1024)
            {
                Response.StatusCode = 413; // Payload Too Large
                return Content("File size exceeds the limit of 1.5 mb");
            }
            if (!_imgService.IsDoc(document))
            {
                Response.StatusCode = 415; // Unsupported Media type
                return Content("File type not supported");

            }
            return null;
        }

        // User login for all roles
        [Route("login")]
        [HttpPost]
        public async Task<IActionResult> Login(LoginDto model)
        {
            try
            {

                var result =
                    await _signInManager.PasswordSignInAsync(model.Username, model.Password, false,
                        lockoutOnFailure: false);

                if (!result.Succeeded)
                {
                    return Unauthorized(new { message = "Invalid username or password" });
                }
                var user = _dbContext.ApplicationUsers.Where(user => user.UserName.ToLower() == model.Username.ToLower()).First();
                var token = GenerateJwtToken(user);
                var role = _userManager.GetRolesAsync(user);

                return Ok(new
                {
                    message = "success",
                    user =
                    new
                    {
                        id = user.Id,
                        username = user.UserName,
                        email = user.Email,
                        role = role.Result[0],
                        hasDocument = !string.IsNullOrEmpty(user.DocumentUrl)

                    },
                    token = token
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Change password of the user
        [Authorize]
        [Route("change_password")]
        [HttpPost]
        public async Task<IActionResult> ChangePassword(ChangePwDto details)
        {
            var user = await _userManager.FindByIdAsync(details.UserId);
            if (user == null)
            {
                return NotFound(new { message = "Invalid user id." });
            }
            
            try
            {
                var response = await _userManager.ChangePasswordAsync(user, details.CurrentPassword, details.NewPassword);
               if( response.Succeeded)
                {
                    return Ok(new {message = "Password changed successfully."});

                }
                else
                {
                    return BadRequest(response);
                }

            }
            catch (Exception ex)
            {
                return BadRequest(new {message = ex.Message });
            }
        }

        // Logout user
        [HttpPost("logout")]
        public async Task<IActionResult> LogOut()
        {
            await _signInManager.SignOutAsync();
            return Ok(new
            {
                message = "success"
            });

        }

        // JwtToken generation
        private string GenerateJwtToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(_configuration["Jwt:ExpiryInMinutes"]));

            var token = new JwtSecurityToken(
                _configuration["Jwt:ValidIssuer"],
                _configuration["Jwt:ValidIssuer"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Upload user document
        [Authorize]
        [HttpPost("upload_doc")]
        public async Task<IActionResult> UploadDoc([FromForm] UploadDocDto docDto)
        {
            try
            {
               
                var imageCheck = CheckImage(docDto.Document);
                if (imageCheck != null)
                {
                    return imageCheck;

                }

                var docUrl = await _docUploadService.UploadDoc(docDto);
                
                return Ok(new {message = "success",
                uploadedDoc = docUrl
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }
    }
}
