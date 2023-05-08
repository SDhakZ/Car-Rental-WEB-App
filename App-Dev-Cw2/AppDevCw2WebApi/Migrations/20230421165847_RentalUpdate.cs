using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppDevCw2WebApi.Migrations
{
    /// <inheritdoc />
    public partial class RentalUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Charges",
                table: "RentalHistory");

            migrationBuilder.DropColumn(
                name: "RepairCost",
                table: "DamageRecord");

            migrationBuilder.AddColumn<int>(
                name: "RentDays",
                table: "RentalHistory",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RentDays",
                table: "RentalHistory");

            migrationBuilder.AddColumn<float>(
                name: "Charges",
                table: "RentalHistory",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "RepairCost",
                table: "DamageRecord",
                type: "real",
                nullable: true);
        }
    }
}
