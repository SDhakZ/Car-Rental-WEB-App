namespace AppDevCw2WebApi.DTOs.OfferDtos
{
    //DTO for view offer
    public class ViewOfferDto
    {
        public Guid Id { get; set; }
        public string offerTitle { get; set; }
        public string offerDescription { get; set; }
        public float Discount { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public Guid CarId { get; set; }
        public string CarName { get; set; }
    }
}
