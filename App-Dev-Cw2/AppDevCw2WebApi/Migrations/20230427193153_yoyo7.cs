using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppDevCw2WebApi.Migrations
{
    /// <inheritdoc />
    public partial class yoyo7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DamageRecord_Cars_CarId",
                table: "DamageRecord");

            migrationBuilder.DropIndex(
                name: "IX_DamageRecord_CarId",
                table: "DamageRecord");

            migrationBuilder.DropColumn(
                name: "CarId",
                table: "DamageRecord");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CarId",
                table: "DamageRecord",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DamageRecord_CarId",
                table: "DamageRecord",
                column: "CarId");

            migrationBuilder.AddForeignKey(
                name: "FK_DamageRecord_Cars_CarId",
                table: "DamageRecord",
                column: "CarId",
                principalTable: "Cars",
                principalColumn: "Id");
        }
    }
}
