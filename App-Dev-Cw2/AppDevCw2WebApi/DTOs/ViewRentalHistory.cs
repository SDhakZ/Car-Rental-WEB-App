using AppDevCw2.Models;
using AppDevCw2WebApi.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppDevCw2WebApi.DTOs
{
    //DTO for view rental history
    public class ViewRentalHistory
    {
        public DateTime StartDate { get; set; } 
        public DateTime EndDate { get; set; } 
        public string RequestStatus { get; set; }
        public float Charges { get; set; }
        public string NotificationStatus { get; set; }
        public string CustomerId { get; set; }
        public string? CheckedBy { get; set; }
        public Guid CarId { get; set; }
    }
}

