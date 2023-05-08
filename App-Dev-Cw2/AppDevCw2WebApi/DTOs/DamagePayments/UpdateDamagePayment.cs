namespace AppDevCw2WebApi.DTOs.DamagePayments
{
    //DTO for update damage payment 
    public class UpdateDamagePayment
    {
        public string Id { get; set; }
        public DateTime PaymentDate { get; set; }
        public double Amount { get; set; }
        public string? PaymentType { get; set; }
        public string PaymentStatus { get; set; }
        public string? CheckedBy { get; set; }
        public Guid DamageRecordId { get; set; }

    }
}
