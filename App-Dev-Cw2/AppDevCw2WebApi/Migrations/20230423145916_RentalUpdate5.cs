using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppDevCw2WebApi.Migrations
{
    /// <inheritdoc />
    public partial class RentalUpdate5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SpecialOffers_Cars_CarId",
                table: "SpecialOffers");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "SpecialOffers",
                newName: "Id");

            migrationBuilder.AlterColumn<Guid>(
                name: "CarId",
                table: "SpecialOffers",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SpecialOffers_Cars_CarId",
                table: "SpecialOffers",
                column: "CarId",
                principalTable: "Cars",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SpecialOffers_Cars_CarId",
                table: "SpecialOffers");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "SpecialOffers",
                newName: "id");

            migrationBuilder.AlterColumn<Guid>(
                name: "CarId",
                table: "SpecialOffers",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_SpecialOffers_Cars_CarId",
                table: "SpecialOffers",
                column: "CarId",
                principalTable: "Cars",
                principalColumn: "Id");
        }
    }
}
