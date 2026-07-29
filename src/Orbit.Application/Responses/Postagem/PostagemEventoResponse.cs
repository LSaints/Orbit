using Orbit.Application.Responses.Usuario;

namespace Orbit.Application.Responses.Postagem;

public record PostagemEventoResponse(
    Guid Id,
    Guid PostagemId,
    Guid UsuarioId,
    string TipoEventoPostagem,
    UsuarioResponse Usuario,
    DateTime DataEmissao
);
