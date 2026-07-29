using Orbit.Application.Requests.Postagem;
using Orbit.Application.Responses.Postagem;

namespace Orbit.Application.Services.Interfaces;

public interface IPostagemService
{
    Task<PostagemResponse?> GetByIdAsync(Guid id);
    Task<List<PostagemResponse>> GetAllByUsuarioIdAsync(Guid usuarioId);
    Task<List<PostagemResponse>> GetAllAsync(int page = 1, int pageSize = 20);
    Task<PostagemResponse> CreateAsync(Guid usuarioId, CriarPostagemRequest request);
    Task<PostagemResponse?> UpdateAsync(Guid usuarioId, Guid postagemId, AtualizarPostagemRequest request);
    Task<bool> DeleteAsync(Guid usuarioId, Guid postagemId);
    Task<PostagemResponse?> UploadMediaAsync(Guid usuarioId, Guid postagemId, Stream fileStream, string fileName, string contentType);
    Task<PostagemResponse?> UploadMediasAsync(Guid usuarioId, Guid postagemId, IReadOnlyList<(Stream FileStream, string FileName, string ContentType)> medias);
    Task<bool> RemoveMediaAsync(Guid usuarioId, Guid postagemId, Guid mediaId);
}
