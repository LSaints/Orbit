using Orbit.Application.Responses.Postagem;

namespace Orbit.Application.Services.Interfaces;

public interface IPostagemEventoService
{
    Task<List<PostagemEventoResponse>> GetAllByPostagemIdAsync(Guid postagemId);
    Task<PostagemEventoResponse?> GetByIdAsync(Guid id);
    Task<PostagemEventoResponse?> GetByPostagemEUsuarioAsync(Guid postagemId, Guid usuarioId);
    Task<PostagemEventoResponse> CurtirPostagemAsync(Guid usuarioId, Guid postagemId);
    Task<PostagemEventoResponse> DescutirPostagemAsync(Guid usuarioId, Guid postagemId);
}
