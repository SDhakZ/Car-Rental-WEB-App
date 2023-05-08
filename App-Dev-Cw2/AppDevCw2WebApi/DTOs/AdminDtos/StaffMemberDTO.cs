using System.ComponentModel.DataAnnotations;

namespace AppDevCw2WebApi.DTOs.AdminDtos
{
    //DTO for staff
    public class StaffMemberDTO
    {
        public string Id { get; set; }
        [Required(ErrorMessage = "Username is required")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Email address is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Password is required")]
        [RegularExpression(@"^(?=.*\d).{6,}$", ErrorMessage = "Password must be at least 6 characters long and contain at least one digit.")]
        public string Password { get; set; }
        [Required(ErrorMessage = "Role is required")]
        public string Role { get; set; }
    }
}
