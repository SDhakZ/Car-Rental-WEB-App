using System.ComponentModel.DataAnnotations;

namespace AppDevCw2WebApi.DTOs.AdminDtos
{
    //DTO for changing password
    public class ChangeStaffPasswordDto
    {
        [Required(ErrorMessage = "UserID is required")]
        public string UserId { get; set; }
        [Required(ErrorMessage = "Newpassword is required")]
        public string NewPassword { get; set; }
    }
}
