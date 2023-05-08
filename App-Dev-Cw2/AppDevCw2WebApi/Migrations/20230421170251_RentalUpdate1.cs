using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppDevCw2WebApi.Migrations
{
    /// <inheritdoc />
    public partial class RentalUpdate1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RentDays",
                table: "RentalHistory");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RentDays",
                table: "RentalHistory",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
