namespace AppDevCw2WebApi.DTOs.UserAuthDtos
{
    //DTO for uploading document
    public class UploadDocDto
    {
        public string UserId { get; set; }

        public IFormFile Document { get; set; }
        public string DocType { get; set; }
    }
}
