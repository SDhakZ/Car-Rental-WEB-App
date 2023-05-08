using System.ComponentModel.DataAnnotations;

namespace AppDevCw2WebApi.DTOs.UserAuthDtos;

//DTO for register 
public class RegisterDto
{
    public string FullName { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }

    [RegularExpression(@"^(?=.*\d).{6,}$", ErrorMessage = "Password must be at least 6 characters long and contain at least one digit.")]
    public string Password { get; set; }
    public string PhoneNumber { get; set; }


    public string Address { get; set; }

    public IFormFile? Document { get; set; }
    public string? DocType { get; set; }

}