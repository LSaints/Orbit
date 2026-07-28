using Orbit.Application.Requests.Usuario;
using Orbit.Application.Responses.Usuario;

namespace Orbit.Application.Services.Interfaces;

public interface IAuthService
{
    Task<LoginTokenResponse> LoginAsync(LoginRequest request);
    Task<UsuarioResponse> RegisterAsync(CriarUsuarioRequest request);
}
