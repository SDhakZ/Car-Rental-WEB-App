using AppDevCw2WebApi.Data;
using AppDevCw2WebApi.DTOs.AdminDtos;
using AppDevCw2WebApi.Models.Static;
using Microsoft.AspNetCore.Identity;
using System.Transactions;

namespace AppDevCw2WebApi.Services
{
    public class AdminService 
    {
        // Creating fields for constructor injection
        private readonly AppDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        // Constructor Injection
        public AdminService(UserManager<IdentityUser> userManager, AppDbContext context, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _context = context;
            _roleManager = roleManager;
        }

        // Service used to get the staff member through ID
        public async Task<StaffMemberDTO> GetStaffMemberById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return null;
            }

            var staffMember = new StaffMemberDTO
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Role = (await _userManager.GetRolesAsync(user)).FirstOrDefault(),

            };

            return staffMember;
        }

        // Service used to validate admin
        public void ValidateAdmin()
        {
            var users = _userManager.Users.ToList();
            var adminCount = users.Count( user =>
            {
                var roles =  _userManager.GetRolesAsync(user);
                return roles.Result[0] == "Admin";
            });
            if(adminCount >= 2)
            {
                throw new Exception("There can't be more than 2 admins");
            }
        }

        // Service used to update staff member
        public async Task<StaffUpdateDTO> UpdateStaffMember( StaffUpdateDTO staffUpdateDto)
        {
            var id = staffUpdateDto.Id;
            var staffMember =  _context.ApplicationUsers.FirstOrDefault(u => u.Id == id);

            if (staffMember == null)
            {
                throw new Exception("Staff member not found");
            }
            if(staffMember.UserName == "admin")
            {
                throw new Exception("You can not update this user.");

            }
           
            var user = await _userManager.FindByNameAsync(staffUpdateDto.Username);
            if (user != null && staffMember.Id != user.Id  )
            {
                throw new Exception("Username already taken.");

            }
                using (var scope = new TransactionScope())
                {
                    staffMember.Email = staffUpdateDto.Email;
                    staffMember.PhoneNumber = staffUpdateDto.PhoneNumber;
                    staffMember.UserName = staffUpdateDto.Username;
                    staffMember.Name = staffUpdateDto.FullName;
                    staffMember.NormalizedUserName = staffUpdateDto.Username.ToUpper();

                    if (staffMember != null)
                    {
                        staffMember.Address = staffUpdateDto.Address;
                        var roleName = staffUpdateDto.Role;
                        var validRoles = new List<String> { UserRoles.Admin, UserRoles.Staff };
                        if (!validRoles.Contains(roleName))
                        {
                            throw new Exception("Invalid role.");
                        }
                    if (roleName == UserRoles.Admin)
                    {
                        ValidateAdmin();

                    }
                    var role = await _roleManager.FindByNameAsync(roleName);
                        if (role != null)
                        {
                            var roles =  _context.UserRoles.Where(r => r.UserId == staffMember.Id).ToList();
                            foreach (var userRole in roles)
                            {
                            if (role.Id == userRole.RoleId) {
                                continue;
                            };
                                _context.UserRoles.Remove(userRole);
                            }
                           var a = await _userManager.AddToRoleAsync(staffMember, staffUpdateDto.Role);
                        }
                    }

                    await _context.SaveChangesAsync();
                    scope.Complete();
                    return staffUpdateDto;

                }
            }


       // Service used to delete staff member
        public async Task<bool> DeleteStaffMember(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return false;
            }

            var result = await _userManager.DeleteAsync(user);

            return result.Succeeded;
        }
    }
}
