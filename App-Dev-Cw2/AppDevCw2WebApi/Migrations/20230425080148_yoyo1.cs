using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppDevCw2WebApi.Migrations
{
    /// <inheritdoc />
    public partial class yoyo1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Charges",
                table: "RentalHistory");

            migrationBuilder.AddColumn<double>(
                name: "TotalCharge",
                table: "RentalHistory",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalCharge",
                table: "RentalHistory");

            migrationBuilder.AddColumn<float>(
                name: "Charges",
                table: "RentalHistory",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }
    }
}
