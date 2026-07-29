using Orbit.Application.Responses.Perfil;
using Orbit.Application.Services.Interfaces;
using Orbit.Infrastructure.Storage;

namespace Orbit.Application.Services.Implementations;

public class PerfilImagemService : IPerfilImagemService
{
    private readonly IFileStorageService _storageService;
    private readonly IPerfilService _perfilService;

    public PerfilImagemService(IFileStorageService storageService, IPerfilService perfilService)
    {
        _storageService = storageService;
        _perfilService = perfilService;
    }

    public async Task<PerfilResponse?> UploadAsync(Guid usuarioId, Stream fileStream, string fileName, string contentType)
    {
        var ext = Path.GetExtension(fileName);
        var profileImageId = Guid.NewGuid();
        var objectName = $"{usuarioId}/profile/{profileImageId}{ext}";

        await _storageService.UploadAsync("", objectName, fileStream, contentType);

        var url = _storageService.GetObjectUrl(objectName);
        var updated = await _perfilService.UpdateAsync(usuarioId,
            new Requests.Perfil.AtualizarPerfilRequest(url));
        
        Console.WriteLine(url);

        return updated;
    }
}
