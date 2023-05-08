using AppDevCw2.Models;
using AppDevCw2WebApi.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppDevCw2WebApi.DTOs
{
    //DTO for adding rental history
    public class AddRentalHistory
    {
        public DateTime StartDate { get; set; } = DateTime.Now;
        public DateTime EndDate { get; set; } = DateTime.Now;
        public string RequestStatus { get; set; }
        public float Charges { get; set; }
        public string NotificationStatus { get; set; }

        public string CustomerId { get; set; }
        public string? CheckedBy { get; set; }
        public Guid CarId { get; set; }

    }
}
