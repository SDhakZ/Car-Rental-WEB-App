using AppDevCw2.Models;
using AppDevCw2WebApi.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppDevCw2WebApi.DTOs.CustomerRequests
{
    //DTO for view request 
    public class ViewRequestDto
    {
        public Guid Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string RequestStatus { get; set; }
        public string? NotificationStatus { get; set; }
        public double TotalCharge { get; set; }
        public string CustomerId { get; set; }
        public string? CheckedBy { get; set; }
        public Guid CarId { get; set; }
    }
}
