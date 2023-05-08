using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppDevCw2WebApi.Migrations
{
    /// <inheritdoc />
    public partial class Rental : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RentalPayment",
                columns: table => new
                {
                    PaymentId = table.Column<Guid>(type: "uuid", nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Amount = table.Column<float>(type: "real", nullable: false),
                    PaymentType = table.Column<string>(type: "text", nullable: true),
                    PaymentStatus = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CheckedBy = table.Column<string>(type: "text", nullable: true),
                    RentalId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentalPayment", x => x.PaymentId);
                    table.ForeignKey(
                        name: "FK_RentalPayment_AspNetUsers_CheckedBy",
                        column: x => x.CheckedBy,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RentalPayment_RentalHistory_RentalId",
                        column: x => x.RentalId,
                        principalTable: "RentalHistory",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SpecialOffers",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    OfferTitle = table.Column<string>(type: "text", nullable: false),
                    OfferDescription = table.Column<string>(type: "text", nullable: false),
                    Discount = table.Column<float>(type: "real", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CarId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecialOffers", x => x.id);
                    table.ForeignKey(
                        name: "FK_SpecialOffers_Cars_CarId",
                        column: x => x.CarId,
                        principalTable: "Cars",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_RentalPayment_CheckedBy",
                table: "RentalPayment",
                column: "CheckedBy");

            migrationBuilder.CreateIndex(
                name: "IX_RentalPayment_RentalId",
                table: "RentalPayment",
                column: "RentalId");

            migrationBuilder.CreateIndex(
                name: "IX_SpecialOffers_CarId",
                table: "SpecialOffers",
                column: "CarId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RentalPayment");

            migrationBuilder.DropTable(
                name: "SpecialOffers");
        }
    }
}
