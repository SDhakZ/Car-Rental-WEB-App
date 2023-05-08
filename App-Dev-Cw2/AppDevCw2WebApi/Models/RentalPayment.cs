using AppDevCw2.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppDevCw2WebApi.Models
{
    // Model for rental payment
    public class RentalPayment
    {
        [Key]
        public Guid PaymentId { get; set; }

        public DateTime PaymentDate { get; set; }
        public double Amount { get; set; }
        public string? PaymentType{ get; set; }
        public string PaymentStatus { get; set; }

        [ForeignKey("Staff")]
        public string? CheckedBy { get; set; }

        public virtual ApplicationUser Staff { get; set; }

        [ForeignKey("RentalHistory")]
        public Guid RentalId { get; set; }

        public virtual RentalHistory RentalHistory { get; set; }

    }
}
