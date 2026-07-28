using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Orbit.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarRelacionamentoPerfilUsuarioCorrecao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Perfils_Usuarios_Id",
                table: "Perfils");

            migrationBuilder.CreateIndex(
                name: "IX_Perfils_UsuarioId",
                table: "Perfils",
                column: "UsuarioId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Perfils_Usuarios_UsuarioId",
                table: "Perfils",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Perfils_Usuarios_UsuarioId",
                table: "Perfils");

            migrationBuilder.DropIndex(
                name: "IX_Perfils_UsuarioId",
                table: "Perfils");

            migrationBuilder.AddForeignKey(
                name: "FK_Perfils_Usuarios_Id",
                table: "Perfils",
                column: "Id",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
