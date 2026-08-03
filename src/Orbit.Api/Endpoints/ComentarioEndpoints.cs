using System.Security.Claims;
using Orbit.Application.Requests.Comentario;
using Orbit.Application.Services.Interfaces;

namespace Orbit.Api.Endpoints;

public static class ComentarioEndpoints
{
    public static void MapComentarioEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/postagens")
            .WithTags("Comentario")
            .RequireAuthorization();

        group.MapGet("/{postagemId:guid}/comentarios", async (Guid postagemId, IComentarioService service) =>
        {
            var comentarios = await service.GetAllByPostagemIdAsync(postagemId);
            return Results.Ok(comentarios);
        });

        group.MapGet("/{postagemId:guid}/comentarios/{id:guid}", async (Guid id, IComentarioService service) =>
        {
            var comentario = await service.GetByIdAsync(id);
            return comentario is not null ? Results.Ok(comentario) : Results.NotFound();
        });

        group.MapPost("/{postagemId:guid}/comentarios", async (
            Guid postagemId, CriarComentarioRequest request, ClaimsPrincipal user, IComentarioService service) =>
        {
            var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var comentario = await service.CreateAsync(usuarioId, postagemId, request);
            return Results.Created($"/postagens/{postagemId}/comentarios/{comentario.Id}", comentario);
        });

        group.MapPost("/{postagemId:guid}/comentarios/{comentarioPaiId:guid}/respostas", async (
            Guid postagemId, Guid comentarioPaiId, CriarRespostaRequest request,
            ClaimsPrincipal user, IComentarioService service) =>
        {
            var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var comentario = await service.CreateRespostaAsync(usuarioId, postagemId, comentarioPaiId, request);
            return Results.Created($"/postagens/{postagemId}/comentarios/{comentario.Id}", comentario);
        });
    }
}
