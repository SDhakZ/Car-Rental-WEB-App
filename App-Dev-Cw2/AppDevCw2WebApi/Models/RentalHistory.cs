using AppDevCw2.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppDevCw2WebApi.Models
{

    // Model for rental history
    public class RentalHistory
    {
        [Key]
        public Guid Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string RequestStatus { get; set; }

        public double TotalCharge { get; set; }

        public DateTime? ReturnDate { get; set; }


        [ForeignKey("Customer")]

        public string CustomerId { get; set; }

        public virtual ApplicationUser Customer { get; set; }

        [ForeignKey("Staff")]
        public string? AuthorizedBy { get; set; }

        public virtual ApplicationUser Staff { get; set; }

        [ForeignKey("Cars")]
        public Guid CarId { get; set; }

        public virtual Cars Cars { get; set; }
    }
}
