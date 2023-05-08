namespace AppDevCw2WebApi.DTOs.OfferDtos
{
    //DTO for update special offer
    public class UpdateSpecialOfferDto
    {
        public string Id { get; set; }
        public string OfferTitle { get; set; }
        public string OfferDescription { get; set; }
        public float Discount { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public Guid CarId { get; set; }
    }
}
