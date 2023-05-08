using AppDevCw2.Models;
using AppDevCw2WebApi.Data;
using AppDevCw2WebApi.DTOs.AdminDtos;
using AppDevCw2WebApi.Models.Static;
using AppDevCw2WebApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AppDevCw2WebApi.Controllers
{
    // Authorized user with the "Admin" role 
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        // UserManager and AppDbContext to manage and access user data
        private readonly UserManager<IdentityUser> _userManager;
        private readonly AppDbContext _dbContext;
        private readonly AdminService _adminService;

        public AdminController(UserManager<IdentityUser> userManager, AppDbContext appDbContext, AdminService adminService)
        {
            _userManager = userManager;
            _dbContext = appDbContext;
            _adminService = adminService;
        }

        // Adds a new staff member
        [HttpPost]
        [Route("add_staff")]
        public async Task<IActionResult> CreateNewStaffMember([FromBody] RegisterStaffDto registerDto)
        {

            var prevUser = await _userManager.FindByNameAsync(registerDto.Username);
            if (prevUser != null)
            {
                return BadRequest(new { message = "Username already taken." });
            }
            var prevEmailUser = await _userManager.FindByEmailAsync(registerDto.Email);
            if (prevEmailUser != null)
            {
                return BadRequest(new { message = "Email already taken." });
            }
            var validRoles = new List<String> { UserRoles.Admin, UserRoles.Staff };
            if (!validRoles.Contains(registerDto.Role))
            {
                throw new Exception("Invalid role.");
            }
            try
            {
                if (registerDto.Role == UserRoles.Admin)
                {
                    _adminService.ValidateAdmin();

                }
                var createdAt = DateTime.UtcNow;

                ApplicationUser user = new ApplicationUser
                {

                    UserName = registerDto.Username,
                    Email = registerDto.Email,
                    PhoneNumber = registerDto.PhoneNumber,
                    Address = registerDto.Address,
                    Name = registerDto.FullName,
                    CreatedAt = createdAt,
                  
                };
                var result = await _userManager.CreateAsync(user, registerDto.Password);
                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }
                else if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, registerDto.Role);

                }
                var addedUser = await _userManager.FindByNameAsync(registerDto.Username);
                var staffMemberDto =new
                {
                    id = addedUser.Id,

                    username = addedUser.UserName,
                    email = addedUser.Email,
                    phoneNumber = registerDto.PhoneNumber,
                    address = registerDto.Address,
                    fullName = registerDto.FullName,
                    role = registerDto.Role,
                     createdAt = createdAt.ToShortDateString(),
                };

                return Ok(new { message = "success", staffMember = staffMemberDto });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        // Retrieves a list of all staff members from the system
        [HttpGet]
        [Route("get_staffs")]
        public IActionResult GetStaffs()
        {
            var users = _dbContext.ApplicationUsers.ToList();
            var viewUsers = users.Select(user =>
            {
                var result = _userManager.GetRolesAsync(user).Result;
                var userRole = result == null ? "" : result[0];
                if (userRole != UserRoles.Customer)
                {
                    return new ViewUsersDto
                    {
                        Id = user.Id,
                        FullName = user.Name,
                        Username = user.UserName,

                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        Address = user.Address,
                        Role = userRole,
                    };
                }
                return null;
            }).Where(user => user != null);
            return Ok(new
            {
                message = "success",
                users = viewUsers
            });
        }


        // Retrieves a list of all customers from 
        [HttpGet]
        [Route("get_customers")]
        public IActionResult GetCustomers()
        {
            var users = _dbContext.ApplicationUsers.ToList();
            var viewUsers = users. Select(user =>
            {
                var result = _userManager.GetRolesAsync(user).Result;
                var userRole = result == null ? "" : result[0];
               
                    return new 
                    {
                        id = user.Id,
                        fullName = user.Name,
                        username = user.UserName,

                        email = user.Email,
                        phoneNumber = user.PhoneNumber,
                        address = user.Address,
                        role = userRole,
                        documentUrl = user.DocumentUrl,
                    };
               
            }).Where(user => user != null);
            return Ok(new
            {
                message = "success",
                users = viewUsers
            });
        }


        // Retrieves a list of all users in the system
        [HttpGet]
        [Route("get_basic_users")]
        public IActionResult GetUsers(string? role)
        {
            var validRoles = new List<String> { UserRoles.Admin, UserRoles.Staff, UserRoles.Customer };
            if (role != null && !validRoles.Contains(role))
            {
                return BadRequest(
                new
                {
                    message = "Inavlid role"
                });
            }
            var users = _dbContext.ApplicationUsers.ToList();
            var viewUsers = users.Select(user =>
            {
                var result = _userManager.GetRolesAsync(user).Result;
                var userRole = result == null ? "" : result[0];
                if (userRole != null && userRole == role)
                {
                    return new
                    {
                        id = user.Id,
                        fullName = user.Name,
                        username = user.UserName,
                        role = userRole

                    };
                }
                else
                {
                    return new
                    {
                        id = user.Id,
                        fullName = user.Name,
                        username = user.UserName,
                        role = userRole!


                    };
                }
                ;
            });
             if(!string.IsNullOrEmpty(role)){
                viewUsers = viewUsers.Where(user => user.role == role);

            }
            return Ok(new
            {
                message = "success",
                users = viewUsers
            });
        }


        // Change password
        [HttpPost]
        [Route("change_password")]
        public async Task<IActionResult> ChangePassword(ChangeStaffPasswordDto changePasswordDto)
        {
            var user = await _userManager.FindByIdAsync(changePasswordDto.UserId);

            if (user == null)
            {
                return BadRequest(new { message = "User not found" });
            }
            if (user.UserName == "admin")
            {
                return Unauthorized(new { message = "You can not update this user." });

            }
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, changePasswordDto.NewPassword);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors.FirstOrDefault()?.Description);
            }

            return Ok(new
            {
                message = "You have sucessfully changed your password"
            });
        }

        // Update the staff details
        [HttpPut("update_user")]
        public async Task<IActionResult> UpdateStaffMember([FromBody] StaffUpdateDTO staffUpdateDto)
        {
            try
            {
                var updatedStaff = await _adminService.UpdateStaffMember(staffUpdateDto);
                return Ok(new { message = "Staff Updated succesfully", staff = staffUpdateDto });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        // Delete staff member
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaffMember(string id)
        {
            try
            {
                var result = await _adminService.DeleteStaffMember(id);
                if (!result)
                {
                    return NotFound(new { message = "Staff not found." });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            return Ok(new { message = "Staff removed successfully" });
        }
    }
}
