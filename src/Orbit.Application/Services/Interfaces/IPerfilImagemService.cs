using Orbit.Application.Responses.Perfil;

namespace Orbit.Application.Services.Interfaces;

public interface IPerfilImagemService
{
    Task<PerfilResponse?> UploadAsync(Guid usuarioId, Stream fileStream, string fileName, string contentType);
}
