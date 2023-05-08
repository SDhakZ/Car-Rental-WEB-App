namespace AppDevCw2WebApi.DTOs
{
    //DTO for updating car
    public class UpdateCarDto
    {
        public string Id { get; set; }
        public string CarName { get; set; }
        public string Description { get; set; }
        public string Brand { get; set; }
        public float RatePerDay { get; set; }
        public string Color { get; set; }
        public float Mileage { get; set; }
        public string FuelType { get; set; }
        public string SafetyRating { get; set; }
        public IFormFile? Image { get; set; }
    }
}
