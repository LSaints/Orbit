using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Orbit.Application.Requests.Postagem;
using Orbit.Application.Services.Interfaces;
using Orbit.Infrastructure.Services;

namespace Orbit.Api.Endpoints;

public static class PostagemEndpoints
{
    public static void MapPostagemEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/postagens")
            .WithTags("Postagem")
            .RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal user, IPostagemService service) =>
        {
            var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var postagens = await service.GetAllByUsuarioIdAsync(usuarioId);
            return Results.Ok(postagens);
        });

        group.MapGet("/feed", async (int page, int pageSize, IPostagemService service) =>
        {
            var postagens = await service.GetAllAsync(page, pageSize);
            return Results.Ok(postagens);
        });

        group.MapGet("/{id:guid}", async (Guid id, IPostagemService service) =>
        {
            var postagem = await service.GetByIdAsync(id);
            return postagem is not null ? Results.Ok(postagem) : Results.NotFound();
        });

        group.MapPost("/", async (CriarPostagemRequest request, ClaimsPrincipal user, IPostagemService service) =>
        {
            var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var postagem = await service.CreateAsync(usuarioId, request);
            return Results.Created($"/postagens/{postagem.Id}", postagem);
        });

        group.MapPut("/{id:guid}", async (Guid id, AtualizarPostagemRequest request, ClaimsPrincipal user, IPostagemService service) =>
        {
            var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var postagem = await service.UpdateAsync(usuarioId, id, request);
            return postagem is not null ? Results.Ok(postagem) : Results.NotFound();
        });

        group.MapDelete("/{id:guid}", async (Guid id, ClaimsPrincipal user, IPostagemService service) =>
        {
            var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var deleted = await service.DeleteAsync(usuarioId, id);
            return deleted ? Results.NoContent() : Results.NotFound();
        });

        group.MapPost("/{id:guid}/media", async (Guid id, IFormFile file, ClaimsPrincipal user, IPostagemService service) =>
        {
            var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            if (file.Length == 0)
                return Results.BadRequest(new { error = "Arquivo vazio" });

            if (!PostagemService.IsValidMediaType(file.ContentType))
                return Results.BadRequest(new { error = "Tipo de arquivo não permitido. Use JPG, PNG, WebP, MP4, WebM ou OGG" });

            using var stream = file.OpenReadStream();
            var postagem = await service.UploadMediaAsync(usuarioId, id, stream, file.FileName, file.ContentType);
            return postagem is not null ? Results.Ok(postagem) : Results.NotFound();
        }).DisableAntiforgery();

        group.MapDelete("/{id:guid}/media/{mediaId:guid}", async (Guid id, Guid mediaId, ClaimsPrincipal user, IPostagemService service) =>
        {
            var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var removed = await service.RemoveMediaAsync(usuarioId, id, mediaId);
            return removed ? Results.NoContent() : Results.NotFound();
        });
    }
}
