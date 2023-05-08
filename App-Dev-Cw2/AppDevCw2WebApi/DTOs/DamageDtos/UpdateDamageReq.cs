namespace AppDevCw2WebApi.DTOs.DamageDtos
{
    //DTO for update damage request 
    public class UpdateDamageReq
    {
        public Guid Id { get; set; }
        public string DamageDescription { get; set; }
        public DateTime ReportDate { get; set; }
        public Guid? CarId { get; set; }
        public Guid? RentalId { get; set; }
        public string? CheckedBy { get; set; }
    }
}
