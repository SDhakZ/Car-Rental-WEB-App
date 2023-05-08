using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppDevCw2WebApi.Migrations
{
    /// <inheritdoc />
    public partial class Damage1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DamageRecord",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DamageDescription = table.Column<string>(type: "text", nullable: false),
                    RepairCost = table.Column<float>(type: "real", nullable: true),
                    ReportDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CarId = table.Column<Guid>(type: "uuid", nullable: true),
                    RentalId = table.Column<Guid>(type: "uuid", nullable: true),
                    CheckedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DamageRecord", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DamageRecord_AspNetUsers_CheckedBy",
                        column: x => x.CheckedBy,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DamageRecord_Cars_CarId",
                        column: x => x.CarId,
                        principalTable: "Cars",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DamageRecord_RentalHistory_RentalId",
                        column: x => x.RentalId,
                        principalTable: "RentalHistory",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DamagePayment",
                columns: table => new
                {
                    PaymentId = table.Column<Guid>(type: "uuid", nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Amount = table.Column<float>(type: "real", nullable: false),
                    PaymentType = table.Column<string>(type: "text", nullable: true),
                    PaymentStatus = table.Column<string>(type: "text", nullable: false),
                    CheckedBy = table.Column<string>(type: "text", nullable: true),
                    DamageRecordId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DamagePayment", x => x.PaymentId);
                    table.ForeignKey(
                        name: "FK_DamagePayment_AspNetUsers_CheckedBy",
                        column: x => x.CheckedBy,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DamagePayment_DamageRecord_DamageRecordId",
                        column: x => x.DamageRecordId,
                        principalTable: "DamageRecord",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DamagePayment_CheckedBy",
                table: "DamagePayment",
                column: "CheckedBy");

            migrationBuilder.CreateIndex(
                name: "IX_DamagePayment_DamageRecordId",
                table: "DamagePayment",
                column: "DamageRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_DamageRecord_CarId",
                table: "DamageRecord",
                column: "CarId");

            migrationBuilder.CreateIndex(
                name: "IX_DamageRecord_CheckedBy",
                table: "DamageRecord",
                column: "CheckedBy");

            migrationBuilder.CreateIndex(
                name: "IX_DamageRecord_RentalId",
                table: "DamageRecord",
                column: "RentalId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DamagePayment");

            migrationBuilder.DropTable(
                name: "DamageRecord");
        }
    }
}
