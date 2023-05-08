namespace AppDevCw2WebApi.DTOs.RentalHistory
{
    //DTO for request approve
    public class RequestApproveDto
    {
         public Guid RequestId { get; set; }
         public string StaffId { get; set; }
    }
}
