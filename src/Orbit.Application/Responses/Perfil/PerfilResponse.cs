namespace Orbit.Application.Responses.Perfil;

public record PerfilResponse(Guid Id, Guid UsuarioId, string UrlImagemPerfil, Core.Domain.Usuario usuario);
