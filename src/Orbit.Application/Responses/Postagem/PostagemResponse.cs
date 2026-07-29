using Orbit.Application.Responses.Usuario;

namespace Orbit.Application.Responses.Postagem;

public record PostagemResponse(
    Guid Id,
    Guid UsuarioId,
    string? Descricao,
    List<PostagemMediaResponse> Medias,
    List<PostagemCategoriaResponse> Categorias,
    UsuarioResponse Usuario,
    DateTime DataCriacao,
    DateTime DataAtualizacao
);
