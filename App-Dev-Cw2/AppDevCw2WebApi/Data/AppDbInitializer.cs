using AppDevCw2.Models;
using AppDevCw2WebApi.DTOs;
using AppDevCw2WebApi.Models;
using AppDevCw2WebApi.Models.Static;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AppDevCw2WebApi.Data
{
    public class AppDbInitializer
    {
        public static async Task SeedUsersAndRoles(IApplicationBuilder applicationBuilder)
        {
            using (var serviceScope = applicationBuilder.ApplicationServices.CreateScope())
            {
                //Roles
                var roleManager = serviceScope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var adminRoleExists = await roleManager.RoleExistsAsync(UserRoles.Admin);
                if (!adminRoleExists)
                    await roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));

                if (!await roleManager.RoleExistsAsync(UserRoles.Staff))
                    await roleManager.CreateAsync(new IdentityRole(UserRoles.Staff));

                if (!await roleManager.RoleExistsAsync(UserRoles.Customer))
                    await roleManager.CreateAsync(new IdentityRole(UserRoles.Customer));

                //Users
                var userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
                var adminName = "admin";
                var adminUser = await userManager.FindByNameAsync(adminName);
                if (adminUser == null)
                {
                    var newAdminUser = new ApplicationUser
                    {
                        Name = "App Admin",
                        UserName = adminName,
                        Email = "admin@gmail.com",
                        Address = "Home",
                        PhoneNumber="9876543210",
                        SecurityStamp = Guid.NewGuid().ToString(),
                        CreatedAt=DateTime.UtcNow,
                        EmailConfirmed = true
                    };
                    await userManager.CreateAsync(newAdminUser, "admin@12");
                    await userManager.AddToRoleAsync(newAdminUser, UserRoles.Admin);
                }


                var staffName = "staff";
                var staffUser = await userManager.FindByNameAsync(staffName);
                if (staffUser == null)
                {
                    var newStaffUser = new ApplicationUser
                    {
                        Name = "App Staff",
                        UserName = staffName,
                        Email = "staff@gmail.com",
                        Address = "Staff-Home",
                        PhoneNumber = "9876543220",
                        SecurityStamp = Guid.NewGuid().ToString(),
                        CreatedAt = DateTime.UtcNow,
                        EmailConfirmed = true
                    };
                    await userManager.CreateAsync(newStaffUser, "staff@12");
                    await userManager.AddToRoleAsync(newStaffUser, UserRoles.Staff);
                }

                var inactiveUsername = "ram";
                var inactiveUser = await userManager.FindByNameAsync(inactiveUsername);
                if (inactiveUser == null)
                {
                    var newInactiveUser = new ApplicationUser
                    {
                        Name = "Ram Prasad",
                        UserName = inactiveUsername,
                        Email = "ram.prasad@gmail.com",
                        Address = "Ram's Home",
                        PhoneNumber = "9876543211",
                        SecurityStamp = Guid.NewGuid().ToString(),
                        CreatedAt = DateTime.UtcNow.AddMonths(-4),
                        EmailConfirmed = true
                    };
                    await userManager.CreateAsync(newInactiveUser, "ram@12");
                    await userManager.AddToRoleAsync(newInactiveUser, UserRoles.Customer);
                }


                //Document Details
                var licenseId =1;
                var citizenshipId = 2;
                var context = serviceScope.ServiceProvider.GetRequiredService<AppDbContext>();
                var docs = context.DocumentType;
                if(docs.FindAsync(licenseId).Result == null)
                {
                   await  docs.AddAsync(new DocumentType
                    {
                        Id = licenseId,
                        Title = "License",
                    });
                }

                if (docs.FindAsync(citizenshipId).Result == null)
                {
                    await docs.AddAsync(new DocumentType
                    {
                        Id = citizenshipId,
                        Title = "Citizenship",
                    });
                }
                context.SaveChanges();

            }
        }
    }
}
