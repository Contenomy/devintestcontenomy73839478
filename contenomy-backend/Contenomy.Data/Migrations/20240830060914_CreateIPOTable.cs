using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Contenomy.Data.Migrations
{
    /// <inheritdoc />
    public partial class CreateIPOTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assets_AspNetUsers_CreatorId",
                table: "Assets");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Assets_CreatorAssetId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_PriceHistories_Assets_CreatorAssetId",
                table: "PriceHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Assets_CreatorAssetId",
                table: "Transactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_WalletEntry_WalletEntryId",
                table: "Transactions");

            migrationBuilder.DropForeignKey(
                name: "FK_WalletEntry_Assets_CreatorAssetId",
                table: "WalletEntry");

            migrationBuilder.DropForeignKey(
                name: "FK_WalletEntry_Wallets_WalletId",
                table: "WalletEntry");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WalletEntry",
                table: "WalletEntry");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Assets",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "WalletEntry");

            migrationBuilder.DropColumn(
                name: "Value",
                table: "Assets");

            migrationBuilder.RenameTable(
                name: "WalletEntry",
                newName: "WalletEntries");

            migrationBuilder.RenameTable(
                name: "Assets",
                newName: "CreatorAssets");

            migrationBuilder.RenameColumn(
                name: "Amount",
                table: "WalletEntries",
                newName: "Quantity");

            migrationBuilder.RenameIndex(
                name: "IX_WalletEntry_WalletId",
                table: "WalletEntries",
                newName: "IX_WalletEntries_WalletId");

            migrationBuilder.RenameIndex(
                name: "IX_WalletEntry_CreatorAssetId",
                table: "WalletEntries",
                newName: "IX_WalletEntries_CreatorAssetId");

            migrationBuilder.RenameColumn(
                name: "Cap",
                table: "CreatorAssets",
                newName: "TotalQuantity");

            migrationBuilder.RenameIndex(
                name: "IX_Assets_CreatorId",
                table: "CreatorAssets",
                newName: "IX_CreatorAssets_CreatorId");

            migrationBuilder.AddColumn<decimal>(
                name: "AvailableBalance",
                table: "Wallets",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "UpdateType",
                table: "PriceHistories",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "Orders",
                type: "numeric(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AddColumn<string>(
                name: "CreatorId",
                table: "Orders",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Direction",
                table: "Orders",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "AveragePrice",
                table: "WalletEntries",
                type: "numeric(18,8)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "AvailableQuantity",
                table: "CreatorAssets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "CurrentValue",
                table: "CreatorAssets",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "CreatorAssets",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "CreatorAssets",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "CreatorAssets",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "CreatorAssets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_WalletEntries",
                table: "WalletEntries",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CreatorAssets",
                table: "CreatorAssets",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "IPOs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CreatorId = table.Column<string>(type: "text", nullable: false),
                    CreatorAssetId = table.Column<int>(type: "integer", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    InitialQuantity = table.Column<int>(type: "integer", nullable: false),
                    InitialPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IPOs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IPOs_AspNetUsers_CreatorId",
                        column: x => x.CreatorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IPOs_CreatorAssets_CreatorAssetId",
                        column: x => x.CreatorAssetId,
                        principalTable: "CreatorAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CreatorId",
                table: "Orders",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_IPOs_CreatorAssetId",
                table: "IPOs",
                column: "CreatorAssetId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IPOs_CreatorId",
                table: "IPOs",
                column: "CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_CreatorAssets_AspNetUsers_CreatorId",
                table: "CreatorAssets",
                column: "CreatorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_AspNetUsers_CreatorId",
                table: "Orders",
                column: "CreatorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_CreatorAssets_CreatorAssetId",
                table: "Orders",
                column: "CreatorAssetId",
                principalTable: "CreatorAssets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PriceHistories_CreatorAssets_CreatorAssetId",
                table: "PriceHistories",
                column: "CreatorAssetId",
                principalTable: "CreatorAssets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_CreatorAssets_CreatorAssetId",
                table: "Transactions",
                column: "CreatorAssetId",
                principalTable: "CreatorAssets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_WalletEntries_WalletEntryId",
                table: "Transactions",
                column: "WalletEntryId",
                principalTable: "WalletEntries",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WalletEntries_CreatorAssets_CreatorAssetId",
                table: "WalletEntries",
                column: "CreatorAssetId",
                principalTable: "CreatorAssets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WalletEntries_Wallets_WalletId",
                table: "WalletEntries",
                column: "WalletId",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CreatorAssets_AspNetUsers_CreatorId",
                table: "CreatorAssets");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_AspNetUsers_CreatorId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_CreatorAssets_CreatorAssetId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_PriceHistories_CreatorAssets_CreatorAssetId",
                table: "PriceHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_CreatorAssets_CreatorAssetId",
                table: "Transactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_WalletEntries_WalletEntryId",
                table: "Transactions");

            migrationBuilder.DropForeignKey(
                name: "FK_WalletEntries_CreatorAssets_CreatorAssetId",
                table: "WalletEntries");

            migrationBuilder.DropForeignKey(
                name: "FK_WalletEntries_Wallets_WalletId",
                table: "WalletEntries");

            migrationBuilder.DropTable(
                name: "IPOs");

            migrationBuilder.DropIndex(
                name: "IX_Orders_CreatorId",
                table: "Orders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WalletEntries",
                table: "WalletEntries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CreatorAssets",
                table: "CreatorAssets");

            migrationBuilder.DropColumn(
                name: "AvailableBalance",
                table: "Wallets");

            migrationBuilder.DropColumn(
                name: "UpdateType",
                table: "PriceHistories");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Direction",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "AveragePrice",
                table: "WalletEntries");

            migrationBuilder.DropColumn(
                name: "AvailableQuantity",
                table: "CreatorAssets");

            migrationBuilder.DropColumn(
                name: "CurrentValue",
                table: "CreatorAssets");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "CreatorAssets");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "CreatorAssets");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "CreatorAssets");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "CreatorAssets");

            migrationBuilder.RenameTable(
                name: "WalletEntries",
                newName: "WalletEntry");

            migrationBuilder.RenameTable(
                name: "CreatorAssets",
                newName: "Assets");

            migrationBuilder.RenameColumn(
                name: "Quantity",
                table: "WalletEntry",
                newName: "Amount");

            migrationBuilder.RenameIndex(
                name: "IX_WalletEntries_WalletId",
                table: "WalletEntry",
                newName: "IX_WalletEntry_WalletId");

            migrationBuilder.RenameIndex(
                name: "IX_WalletEntries_CreatorAssetId",
                table: "WalletEntry",
                newName: "IX_WalletEntry_CreatorAssetId");

            migrationBuilder.RenameColumn(
                name: "TotalQuantity",
                table: "Assets",
                newName: "Cap");

            migrationBuilder.RenameIndex(
                name: "IX_CreatorAssets_CreatorId",
                table: "Assets",
                newName: "IX_Assets_CreatorId");

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "Orders",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)");

            migrationBuilder.AddColumn<double>(
                name: "Price",
                table: "WalletEntry",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Value",
                table: "Assets",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_WalletEntry",
                table: "WalletEntry",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Assets",
                table: "Assets",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Assets_AspNetUsers_CreatorId",
                table: "Assets",
                column: "CreatorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Assets_CreatorAssetId",
                table: "Orders",
                column: "CreatorAssetId",
                principalTable: "Assets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PriceHistories_Assets_CreatorAssetId",
                table: "PriceHistories",
                column: "CreatorAssetId",
                principalTable: "Assets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Assets_CreatorAssetId",
                table: "Transactions",
                column: "CreatorAssetId",
                principalTable: "Assets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_WalletEntry_WalletEntryId",
                table: "Transactions",
                column: "WalletEntryId",
                principalTable: "WalletEntry",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WalletEntry_Assets_CreatorAssetId",
                table: "WalletEntry",
                column: "CreatorAssetId",
                principalTable: "Assets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WalletEntry_Wallets_WalletId",
                table: "WalletEntry",
                column: "WalletId",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
