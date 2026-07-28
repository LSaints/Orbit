namespace Orbit.Application.Responses.Postagem;

public record PostagemResponse(
    Guid Id,
    Guid UsuarioId,
    string? Descricao,
    List<PostagemMediaResponse> Medias,
    List<PostagemCategoriaResponse> Categorias,
    DateTime DataCriacao,
    DateTime DataAtualizacao
);
