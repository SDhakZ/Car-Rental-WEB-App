using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppDevCw2WebApi.Migrations
{
    /// <inheritdoc />
    public partial class yoyo4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "returnDate",
                table: "RentalHistory",
                newName: "ReturnDate");

            migrationBuilder.RenameColumn(
                name: "request_status",
                table: "DamageRecord",
                newName: "Request_status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ReturnDate",
                table: "RentalHistory",
                newName: "returnDate");

            migrationBuilder.RenameColumn(
                name: "Request_status",
                table: "DamageRecord",
                newName: "request_status");
        }
    }
}
