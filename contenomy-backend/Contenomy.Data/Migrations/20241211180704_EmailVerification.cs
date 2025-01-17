using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Contenomy.Data.Migrations
{
    /// <inheritdoc />
    public partial class EmailVerification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EmailVerificationRequests",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(36)", maxLength: 36, nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    RequestOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ExpiresOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Valid = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailVerificationRequests", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailVerificationRequests");
        }
    }
}
