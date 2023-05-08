namespace AppDevCw2WebApi.DTOs.DamageDtos
{
    //DTO for view damage request 
    public class ViewDamageReq
    {
        public Guid Id { get; set; }
        public string DamageDescription { get; set; }
        public DateTime ReportDate { get; set; }
        public Guid? RentalId { get; set; }
        public string? CheckedBy { get; set; }
    }
}
