using System.Security.Claims;
using Orbit.Application.Services.Interfaces;

namespace Orbit.Api.Endpoints;

public static class PostagemEventoEndpoints
{
    public static void MapPostagemEventoEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/postagens/{postagemId:guid}")
            .WithTags("Postagem Eventos")
            .RequireAuthorization();

        group.MapPost("/curtir", async (Guid postagemId, ClaimsPrincipal user, IPostagemEventoService service) =>
        {
            var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var evento = await service.CurtirPostagemAsync(usuarioId, postagemId);
            return Results.Created($"/postagens/{postagemId}/eventos/{evento.Id}", evento);
        });

        group.MapPost("/descurtir", async (Guid postagemId, ClaimsPrincipal user, IPostagemEventoService service) =>
        {
            var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var evento = await service.DescutirPostagemAsync(usuarioId, postagemId);
            return Results.Created($"/postagens/{postagemId}/eventos/{evento.Id}", evento);
        });

        group.MapGet("/eventos", async (Guid postagemId, IPostagemEventoService service) =>
        {
            var eventos = await service.GetAllByPostagemIdAsync(postagemId);
            return Results.Ok(eventos);
        });

        group.MapGet("/eventos/{id:guid}", async (Guid postagemId, Guid id, IPostagemEventoService service) =>
        {
            var evento = await service.GetByIdAsync(id);
            return evento is not null ? Results.Ok(evento) : Results.NotFound();
        });

        group.MapGet("/eventos/meu-evento", async (Guid postagemId, ClaimsPrincipal user, IPostagemEventoService service) =>
        {
            var usuarioId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var evento = await service.GetByPostagemEUsuarioAsync(postagemId, usuarioId);
            return evento is not null ? Results.Ok(evento) : Results.NotFound();
        });
    }
}
