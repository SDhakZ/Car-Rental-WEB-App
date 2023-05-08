namespace AppDevCw2WebApi.DTOs.OfferDtos
{
    //DTO for creating special offer
    public class AddSpecialOffersDto
    {
        public string offerTitle { get; set; }
        public string offerDescription { get; set; }
        public float Discount { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public Guid CarId { get; set; }
    }
}
