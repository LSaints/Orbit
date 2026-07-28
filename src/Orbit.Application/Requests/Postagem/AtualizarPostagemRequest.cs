namespace Orbit.Application.Requests.Postagem;

public record AtualizarPostagemRequest(string? Descricao, List<string>? Categorias);
