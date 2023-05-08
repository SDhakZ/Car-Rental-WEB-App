using AppDevCw2.Models;
using AppDevCw2WebApi.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppDevCw2WebApi.DTOs.DamagePayments
{
    //DTO for create damage bill
    public class CreateDamageBillsDto
    {
        public double Amount { get; set; }
        public Guid DamageRecordId { get; set; }
    }
}
