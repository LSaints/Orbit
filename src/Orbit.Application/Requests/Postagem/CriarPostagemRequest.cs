namespace Orbit.Application.Requests.Postagem;

public record CriarPostagemRequest(string? Descricao, List<string>? Categorias);
