using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Contenomy.Data.Migrations
{
    /// <inheritdoc />
    public partial class UserWallet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Wallets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Wallets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Wallets_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WalletEntry",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CreatorAssetId = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<double>(type: "double precision", nullable: false),
                    Amount = table.Column<int>(type: "integer", nullable: false),
                    WalletId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WalletEntry", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WalletEntry_Assets_CreatorAssetId",
                        column: x => x.CreatorAssetId,
                        principalTable: "Assets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WalletEntry_Wallets_WalletId",
                        column: x => x.WalletId,
                        principalTable: "Wallets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Issuer = table.Column<string>(type: "text", nullable: false),
                    Amount = table.Column<double>(type: "double precision", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Beneficiary = table.Column<string>(type: "text", nullable: false),
                    CreatorAssetId = table.Column<int>(type: "integer", nullable: false),
                    WalletEntryId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transactions_Assets_CreatorAssetId",
                        column: x => x.CreatorAssetId,
                        principalTable: "Assets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Transactions_WalletEntry_WalletEntryId",
                        column: x => x.WalletEntryId,
                        principalTable: "WalletEntry",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Errors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PurchaseId = table.Column<int>(type: "integer", nullable: true),
                    SellId = table.Column<int>(type: "integer", nullable: true),
                    Error = table.Column<string>(type: "text", nullable: false),
                    SerializedException = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Errors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Errors_Transactions_PurchaseId",
                        column: x => x.PurchaseId,
                        principalTable: "Transactions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Errors_Transactions_SellId",
                        column: x => x.SellId,
                        principalTable: "Transactions",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Errors_PurchaseId",
                table: "Errors",
                column: "PurchaseId");

            migrationBuilder.CreateIndex(
                name: "IX_Errors_SellId",
                table: "Errors",
                column: "SellId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_CreatorAssetId",
                table: "Transactions",
                column: "CreatorAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_WalletEntryId",
                table: "Transactions",
                column: "WalletEntryId");

            migrationBuilder.CreateIndex(
                name: "IX_WalletEntry_CreatorAssetId",
                table: "WalletEntry",
                column: "CreatorAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_WalletEntry_WalletId",
                table: "WalletEntry",
                column: "WalletId");

            migrationBuilder.CreateIndex(
                name: "IX_Wallets_UserId",
                table: "Wallets",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Errors");

            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropTable(
                name: "WalletEntry");

            migrationBuilder.DropTable(
                name: "Wallets");
        }
    }
}
