﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppDevCw2WebApi.Migrations
{
    /// <inheritdoc />
    public partial class yoyo3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "returnDate",
                table: "RentalHistory",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "request_status",
                table: "DamageRecord",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "returnDate",
                table: "RentalHistory");

            migrationBuilder.DropColumn(
                name: "request_status",
                table: "DamageRecord");
        }
    }
}
