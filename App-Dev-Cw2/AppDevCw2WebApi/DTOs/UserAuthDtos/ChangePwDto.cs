namespace AppDevCw2WebApi.DTOs.UserAuthDtos
{
    //DTO for change password
    public class ChangePwDto
    {
        public string UserId { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
