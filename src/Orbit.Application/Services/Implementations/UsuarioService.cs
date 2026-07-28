using Microsoft.EntityFrameworkCore;
using Orbit.Application.Requests.Usuario;
using Orbit.Application.Responses.Usuario;
using Orbit.Application.Services.Interfaces;
using Orbit.Core.Domain;
using Orbit.Infrastructure.Data;

namespace Orbit.Application.Services.Implementations;

public class UsuarioService : IUsuarioService
{
    private readonly OrbitDbContext _context;

    public UsuarioService(OrbitDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UsuarioResponse>> GetAllAsync()
    {
        return await _context.Usuarios
            .Select(u => new UsuarioResponse(u.Id, u.Nome, u.Email))
            .ToListAsync();
    }

    public async Task<UsuarioResponse?> GetByIdAsync(Guid id)
    {
        return await _context.Usuarios
            .Where(u => u.Id == id)
            .Select(u => new UsuarioResponse(u.Id, u.Nome, u.Email))
            .FirstOrDefaultAsync();
    }

    public async Task<UsuarioResponse> CreateAsync(CriarUsuarioRequest request)
    {
        var usuario = new Usuario(
            request.Nome,
            request.Email,
            request.Senha,
            DateTime.MinValue);

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return new UsuarioResponse(usuario.Id, usuario.Nome, usuario.Email);
    }

    public async Task<UsuarioResponse?> UpdateAsync(Guid id, CriarUsuarioRequest request)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario is null) return null;

        usuario.Nome = request.Nome;
        usuario.Email = request.Email;
        usuario.Senha = request.Senha;

        await _context.SaveChangesAsync();

        return new UsuarioResponse(usuario.Id, usuario.Nome, usuario.Email);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario is null) return false;

        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync();

        return true;
    }
}
