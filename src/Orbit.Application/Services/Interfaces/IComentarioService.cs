using Orbit.Application.Requests.Comentario;
using Orbit.Application.Responses.Comentarios;

namespace Orbit.Application.Services.Interfaces;

public interface IComentarioService
{
    Task<ComentarioResponse> CreateAsync(Guid usuarioId, Guid postagemId, CriarComentarioRequest request);
    Task<ComentarioResponse> CreateRespostaAsync(Guid usuarioId, Guid postagemId, Guid comentarioPaiId, CriarRespostaRequest request);
    Task<List<ComentarioResponse>> GetAllByPostagemIdAsync(Guid postagemId);
    Task<ComentarioResponse?> GetByIdAsync(Guid id);
}
