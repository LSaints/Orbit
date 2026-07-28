using Orbit.Application.Requests.Perfil;
using Orbit.Application.Responses.Perfil;

namespace Orbit.Application.Services.Interfaces;

public interface IPerfilService
{
    Task<PerfilResponse?> GetByUsuarioIdAsync(Guid usuarioId);
    Task<PerfilResponse?> UpdateAsync(Guid usuarioId, AtualizarPerfilRequest request);
}
