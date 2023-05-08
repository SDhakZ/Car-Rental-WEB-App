using AppDevCw2.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppDevCw2WebApi.Models
{
    // Model for damage record

    public class DamageRecord
    {
        [Key]
        public Guid Id { get; set; }

        public string DamageDescription { get; set; }

        public DateTime ReportDate { get; set; }

        public string RequestStatus { get; set; }


        [ForeignKey("RentalHistory")]
        public Guid? RentalId { get; set; }

        public virtual RentalHistory RentalHistory { get; set; }

        [ForeignKey("Staff")]
        public string? CheckedBy { get; set; }

        public virtual ApplicationUser Staff { get; set; }

    }
}
