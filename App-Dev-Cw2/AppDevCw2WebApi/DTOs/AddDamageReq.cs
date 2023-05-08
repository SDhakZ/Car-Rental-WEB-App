namespace AppDevCw2WebApi.DTOs
{
    //DTO for adding damage request
    public class AddDamageReq
    {
        public string DamageDescription { get; set; }
        public Guid? RentalId { get; set; }
    }
}
