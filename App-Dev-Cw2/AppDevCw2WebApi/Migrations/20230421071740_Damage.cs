using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppDevCw2WebApi.Migrations
{
    /// <inheritdoc />
    public partial class Damage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RentalHistory_AspNetUsers_StaffId",
                table: "RentalHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_RentalPayment_AspNetUsers_CheckedBy",
                table: "RentalPayment");

            migrationBuilder.DropForeignKey(
                name: "FK_RentalPayment_RentalHistory_RentalId",
                table: "RentalPayment");

            migrationBuilder.DropIndex(
                name: "IX_RentalHistory_StaffId",
                table: "RentalHistory");

            migrationBuilder.DropColumn(
                name: "StaffId",
                table: "RentalHistory");

            migrationBuilder.RenameColumn(
                name: "CheckedBy",
                table: "RentalPayment",
                newName: "CheckedBy");

            migrationBuilder.RenameIndex(
                name: "IX_RentalPayment_CheckedBy",
                table: "RentalPayment",
                newName: "IX_RentalPayment_CheckedBy");

            migrationBuilder.AlterColumn<Guid>(
                name: "RentalId",
                table: "RentalPayment",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PaymentStatus",
                table: "RentalPayment",
                type: "text",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AddColumn<string>(
                name: "CheckedBy",
                table: "RentalHistory",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RentalHistory_CheckedBy",
                table: "RentalHistory",
                column: "CheckedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalHistory_AspNetUsers_CheckedBy",
                table: "RentalHistory",
                column: "CheckedBy",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalPayment_AspNetUsers_CheckedBy",
                table: "RentalPayment",
                column: "CheckedBy",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalPayment_RentalHistory_RentalId",
                table: "RentalPayment",
                column: "RentalId",
                principalTable: "RentalHistory",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RentalHistory_AspNetUsers_CheckedBy",
                table: "RentalHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_RentalPayment_AspNetUsers_CheckedBy",
                table: "RentalPayment");

            migrationBuilder.DropForeignKey(
                name: "FK_RentalPayment_RentalHistory_RentalId",
                table: "RentalPayment");

            migrationBuilder.DropIndex(
                name: "IX_RentalHistory_CheckedBy",
                table: "RentalHistory");

            migrationBuilder.DropColumn(
                name: "CheckedBy",
                table: "RentalHistory");

            migrationBuilder.RenameColumn(
                name: "CheckedBy",
                table: "RentalPayment",
                newName: "CheckedBy");

            migrationBuilder.RenameIndex(
                name: "IX_RentalPayment_CheckedBy",
                table: "RentalPayment",
                newName: "IX_RentalPayment_CheckedBy");

            migrationBuilder.AlterColumn<Guid>(
                name: "RentalId",
                table: "RentalPayment",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<DateTime>(
                name: "PaymentStatus",
                table: "RentalPayment",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

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

            migrationBuilder.AddForeignKey(
                name: "FK_RentalPayment_AspNetUsers_CheckedBy",
                table: "RentalPayment",
                column: "CheckedBy",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalPayment_RentalHistory_RentalId",
                table: "RentalPayment",
                column: "RentalId",
                principalTable: "RentalHistory",
                principalColumn: "Id");
        }
    }
}
