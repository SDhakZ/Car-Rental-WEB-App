using AppDevCw2.Models;
using AppDevCw2WebApi.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppDevCw2WebApi.DTOs.CustomerRequests
{
    //DTO for make request
    public class MakeRequestDto
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string CustomerId { get; set; }
        public Guid CarId { get; set; }
    }
}
