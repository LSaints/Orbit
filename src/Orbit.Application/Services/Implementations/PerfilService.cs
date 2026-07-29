using Microsoft.EntityFrameworkCore;
using Orbit.Application.Requests.Perfil;
using Orbit.Application.Responses.Perfil;
using Orbit.Application.Services.Interfaces;
using Orbit.Infrastructure.Data;

namespace Orbit.Application.Services.Implementations;

public class PerfilService : IPerfilService
{
    private readonly OrbitDbContext _context;

    public PerfilService(OrbitDbContext context)
    {
        _context = context;
    }

    public async Task<PerfilResponse?> GetByUsuarioIdAsync(Guid usuarioId)
    {
        return await _context.Perfils
            .Include(p => p.Usuario)
            .Where(p => p.UsuarioId == usuarioId)
            .Select(p => new PerfilResponse(p.Id, p.UsuarioId, p.UrlImagemPerfil,  p.Usuario))
            .FirstOrDefaultAsync();
    }

    public async Task<PerfilResponse?> UpdateAsync(Guid usuarioId, AtualizarPerfilRequest request)
    {
        var perfil = await _context.Perfils.Include(perfil => perfil.Usuario)
            .FirstOrDefaultAsync(p => p.UsuarioId == usuarioId);

        if (perfil is null) return null;

        perfil.UrlImagemPerfil = request.UrlImagemPerfil;
        await _context.SaveChangesAsync();

        return new PerfilResponse(perfil.Id, perfil.UsuarioId, perfil.UrlImagemPerfil, perfil.Usuario);
    }
}
