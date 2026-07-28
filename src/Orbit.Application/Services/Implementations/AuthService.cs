using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Orbit.Application.Requests.Usuario;
using Orbit.Application.Responses.Usuario;
using Orbit.Application.Services.Interfaces;
using Orbit.Core.Domain;
using Orbit.Infrastructure.Data;

namespace Orbit.Application.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly OrbitDbContext  _context;
    private readonly IConfiguration _configuration;

    public AuthService(OrbitDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<LoginTokenResponse> LoginAsync(LoginRequest request)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (usuario is null || !BCrypt.Net.BCrypt.Verify(request.Senha, usuario.Senha))
            throw new UnauthorizedAccessException("Email ou senha inválidos");

        var token = GenerateToken(usuario);
        return new LoginTokenResponse(token);
    }

    public async Task<UsuarioResponse> RegisterAsync(CriarUsuarioRequest request)
    {
        if (await _context.Usuarios.AnyAsync(u => u.Email == request.Email))
            throw new InvalidOperationException("Email já cadastrado");

        var usuario = new Usuario(
            request.Nome,
            request.Email,
            BCrypt.Net.BCrypt.HashPassword(request.Senha),
            DateTime.MinValue);

        _context.Usuarios.Add(usuario);

        var perfil = new Perfil(usuario.Id, string.Empty);
        _context.Perfils.Add(perfil);

        await _context.SaveChangesAsync();

        return new UsuarioResponse(usuario.Id, usuario.Nome, usuario.Email);
    }

    private string GenerateToken(Usuario usuario)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
        var expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiresInMinutes"]!));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Email, usuario.Email),
            new Claim(ClaimTypes.Name, usuario.Nome)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
