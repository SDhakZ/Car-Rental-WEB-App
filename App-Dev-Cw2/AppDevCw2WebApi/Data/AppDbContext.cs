using AppDevCw2.Models;
using AppDevCw2WebApi.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace AppDevCw2WebApi.Data
{
    public sealed class AppDbContext : IdentityDbContext
    {
        //using dependency injection to inject the configuration options into the constructor
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            
        }
        //defines the database tables and their relationships with model classes
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<DocumentType> DocumentType { get; set; }
        public DbSet<Cars> Cars { get; set; }
        public DbSet<RentalHistory> RentalHistory { get; set; }
        public DbSet<RentalPayment> RentalPayment { get; set; }
        public DbSet<SpecialOffers> SpecialOffers { get; set; }
        public DbSet<DamageRecord> DamageRecord { get; set; }
        public DbSet<DamagePayment> DamagePayment { get; set; }
        public DbSet<SpecialOffers> Offers { get; set; }
    }
}