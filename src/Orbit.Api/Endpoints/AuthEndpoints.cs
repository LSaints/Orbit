using Orbit.Application.Requests.Usuario;
using Orbit.Application.Services.Interfaces;

namespace Orbit.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/auth")
            .WithTags("Auth");

        group.MapPost("/register", async (CriarUsuarioRequest request, IAuthService service) =>
        {
            try
            {
                var usuario = await service.RegisterAsync(request);
                return Results.Created($"/usuarios/{usuario.Id}", usuario);
            }
            catch (InvalidOperationException ex)
            {
                return Results.Conflict(new { error = ex.Message });
            }
        });

        group.MapPost("/login", async (LoginRequest request, IAuthService service) =>
        {
            try
            {
                var result = await service.LoginAsync(request);
                return Results.Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return Results.Unauthorized();
            }
        });
    }
}
