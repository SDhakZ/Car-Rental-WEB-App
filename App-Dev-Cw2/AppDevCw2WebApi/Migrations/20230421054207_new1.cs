using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppDevCw2WebApi.Migrations
{
    /// <inheritdoc />
    public partial class new1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StaffId",
                table: "RentalHistory",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_RentalHistory_StaffId",
                table: "RentalHistory",
                column: "StaffId");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalHistory_AspNetUsers_StaffId",
                table: "RentalHistory",
                column: "StaffId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RentalHistory_AspNetUsers_StaffId",
                table: "RentalHistory");

            migrationBuilder.DropIndex(
                name: "IX_RentalHistory_StaffId",
                table: "RentalHistory");

            migrationBuilder.DropColumn(
                name: "StaffId",
                table: "RentalHistory");
        }
    }
}
