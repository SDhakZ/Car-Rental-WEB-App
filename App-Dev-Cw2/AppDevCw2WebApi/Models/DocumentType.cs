using AppDevCw2.Models;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace AppDevCw2WebApi.Models
{
    // Model for document type
    public class DocumentType
    {
        [Key]
        public int Id { get; set; }

        public string Title { get; set; }

        public virtual ICollection<ApplicationUser> Users { get; set; }
    }
}
