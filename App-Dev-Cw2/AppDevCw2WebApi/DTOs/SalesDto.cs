namespace AppDevCw2WebApi.DTOs
{
    //DTO for sales for date filtering
    public class SalesDto
    {
        public string CustomerId { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
    }
}
