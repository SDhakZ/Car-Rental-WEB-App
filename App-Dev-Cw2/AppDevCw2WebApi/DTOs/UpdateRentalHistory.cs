using AppDevCw2.Models;
using AppDevCw2WebApi.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppDevCw2WebApi.DTOs
{
    //DTO for update rental history
    public class UpdateRentalHistory
    {
        public string Id { get; set; } 
        public string RequestStatus { get; set; }
    }
}
