using System.Security.Claims;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Orbit.Application.Requests.Perfil;
using Orbit.Application.Services.Interfaces;

namespace Orbit.Api.Endpoints;

public static class PerfilEndpoints
{
    public static void MapPerfilEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/perfil")
            .WithTags("Perfil")
            .RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal user, IPerfilService service) =>
        {
            var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var perfil = await service.GetByUsuarioIdAsync(usuarioId);
            return perfil is not null ? Results.Ok(perfil) : Results.NotFound();
        });

        group.MapGet("/{usuarioId:guid}", async (Guid usuarioId, IPerfilService service) =>
        {
            var perfil = await service.GetByUsuarioIdAsync(usuarioId);
            return perfil is not null ? Results.Ok(perfil) : Results.NotFound();
        });

        group.MapPut("/", async (AtualizarPerfilRequest request, ClaimsPrincipal user, IPerfilService service) =>
        {
            var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var perfil = await service.UpdateAsync(usuarioId, request);
            return perfil is not null ? Results.Ok(perfil) : Results.NotFound();
        });

        group.MapPost("/imagem", async (IFormFile file, ClaimsPrincipal user, IPerfilImagemService imagemService) =>
        {
            var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            if (file.Length == 0)
                return Results.BadRequest(new { error = "Arquivo vazio" });

            var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType))
                return Results.BadRequest(new { error = "Tipo de arquivo não permitido. Use JPG, PNG ou WebP" });

            using var stream = file.OpenReadStream();
            var perfil = await imagemService.UploadAsync(usuarioId, stream, file.FileName, file.ContentType);
            return perfil is not null ? Results.Ok(perfil) : Results.NotFound();
        }).DisableAntiforgery();
    }
}
