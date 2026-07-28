using Orbit.Application.Requests.Usuario;
using Orbit.Application.Services.Interfaces;

namespace Orbit.Api.Endpoints;

public static class UsuarioEndpoints
{
    public static void MapUsuarioEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/usuarios")
            .WithTags("Usuarios")
            .RequireAuthorization();

        group.MapGet("/", async (IUsuarioService service) =>
        {
            var usuarios = await service.GetAllAsync();
            return Results.Ok(usuarios);
        });

        group.MapGet("/{id:guid}", async (Guid id, IUsuarioService service) =>
        {
            var usuario = await service.GetByIdAsync(id);
            return usuario is not null ? Results.Ok(usuario) : Results.NotFound();
        });

        group.MapPut("/{id:guid}", async (Guid id, CriarUsuarioRequest request, IUsuarioService service) =>
        {
            var usuario = await service.UpdateAsync(id, request);
            return usuario is not null ? Results.Ok(usuario) : Results.NotFound();
        });

        group.MapDelete("/{id:guid}", async (Guid id, IUsuarioService service) =>
        {
            var deleted = await service.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        });
    }
}
