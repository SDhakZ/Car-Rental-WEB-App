using AppDevCw2WebApi.Models;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;


namespace AppDevCw2.Models
{
    // Model for users of the application
    public class ApplicationUser : IdentityUser

    {
        public string Name { get; set; }
        public DateTime  CreatedAt { get; set; }
        public string Address { get; set; }



        public string? DocumentUrl { get; set; }

        [ForeignKey("DocumentType")]

        public int? DocType { get; set; }


        public virtual DocumentType DocumentType { get; set; }
    }
}
