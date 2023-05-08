using AppDevCw2.Models;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppDevCw2WebApi.Models
{
    // Model for special offers
    public class SpecialOffers
    {
        [Key]
        public Guid Id { get; set; }
        public string OfferTitle { get; set; }
        public string OfferDescription { get; set; }
        public float Discount { get; set; }
        public DateTime StartDate { get; set; } 
        public DateTime EndDate { get; set; }

        [ForeignKey("Cars")]
        public Guid CarId { get; set; }

        public virtual Cars Cars { get; set; }
    }
}
