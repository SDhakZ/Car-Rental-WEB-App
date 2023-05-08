namespace AppDevCw2WebApi.DTOs
{
    //DTO for view cars
    public class ViewCarDto
    {
        public Guid Id { get; set; }
        public string CarName { get; set; }
        public string Description { get; set; }
        public string Brand { get; set; }
        public float RatePerDay { get; set; }
        public string Color { get; set; }
        public string Status { get; set; }
        public float Mileage { get; set; }
        public string FuelType { get; set; }
        public string SafetyRating { get; set; }
        public string ImageUrl { get; set; }
    }
}
