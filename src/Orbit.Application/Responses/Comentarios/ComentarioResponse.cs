using Orbit.Application.Responses.Usuario;

namespace Orbit.Application.Responses.Comentarios;

public record ComentarioResponse(Guid Id, Guid PostagemId, Guid? ComentarioPaiId, Guid UsuarioId,
    UsuarioResponse Usuario, string Conteudo, DateTime DataCriacao, List<ComentarioResponse> Respostas);