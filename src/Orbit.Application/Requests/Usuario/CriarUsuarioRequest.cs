namespace Orbit.Application.Requests.Usuario;

public record CriarUsuarioRequest(string Nome, string Email, string Senha, string SenhaConfirmacao);