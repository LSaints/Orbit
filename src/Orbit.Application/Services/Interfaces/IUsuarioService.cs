using Orbit.Application.Requests.Usuario;
using Orbit.Application.Responses.Usuario;

namespace Orbit.Application.Services.Interfaces;

public interface IUsuarioService
{
    Task<IEnumerable<UsuarioResponse>> GetAllAsync();
    Task<UsuarioResponse?> GetByIdAsync(Guid id);
    Task<UsuarioResponse> CreateAsync(CriarUsuarioRequest request);
    Task<UsuarioResponse?> UpdateAsync(Guid id, CriarUsuarioRequest request);
    Task<bool> DeleteAsync(Guid id);
}
