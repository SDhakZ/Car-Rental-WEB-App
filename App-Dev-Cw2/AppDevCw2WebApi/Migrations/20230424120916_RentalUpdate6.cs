using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppDevCw2WebApi.Migrations
{
    /// <inheritdoc />
    public partial class RentalUpdate6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RentalHistory_AspNetUsers_CheckedBy",
                table: "RentalHistory");

            migrationBuilder.RenameColumn(
                name: "CheckedBy",
                table: "RentalHistory",
                newName: "AuthorizedBy");

            migrationBuilder.RenameIndex(
                name: "IX_RentalHistory_CheckedBy",
                table: "RentalHistory",
                newName: "IX_RentalHistory_AuthorizedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalHistory_AspNetUsers_AuthorizedBy",
                table: "RentalHistory",
                column: "AuthorizedBy",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RentalHistory_AspNetUsers_AuthorizedBy",
                table: "RentalHistory");

            migrationBuilder.RenameColumn(
                name: "AuthorizedBy",
                table: "RentalHistory",
                newName: "CheckedBy");

            migrationBuilder.RenameIndex(
                name: "IX_RentalHistory_AuthorizedBy",
                table: "RentalHistory",
                newName: "IX_RentalHistory_CheckedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalHistory_AspNetUsers_CheckedBy",
                table: "RentalHistory",
                column: "CheckedBy",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
