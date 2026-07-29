using Microsoft.EntityFrameworkCore;
using Orbit.Application.Responses.Postagem;
using Orbit.Application.Responses.Usuario;
using Orbit.Application.Services.Interfaces;
using Orbit.Core.Domain;
using Orbit.Core.Enums;
using Orbit.Infrastructure.Data;

namespace Orbit.Application.Services.Implementations;

public class PostagemEventoService : IPostagemEventoService
{
    private readonly OrbitDbContext _context;

    public PostagemEventoService(OrbitDbContext context)
    {
        _context = context;
    }

    public async Task<List<PostagemEventoResponse>> GetAllByPostagemIdAsync(Guid postagemId)
    {
        return await _context.PostagensEventos
            .Include(e => e.Usuario)
            .Where(e => e.PostagemId == postagemId)
            .OrderByDescending(e => e.DataEmissao)
            .Select(e => MapToResponse(e))
            .ToListAsync();
    }

    public async Task<PostagemEventoResponse?> GetByIdAsync(Guid id)
    {
        return await _context.PostagensEventos
            .Include(e => e.Usuario)
            .Where(e => e.Id == id)
            .Select(e => MapToResponse(e))
            .FirstOrDefaultAsync();
    }

    public async Task<PostagemEventoResponse?> GetByPostagemEUsuarioAsync(Guid postagemId, Guid usuarioId)
    {
        return await _context.PostagensEventos
            .Include(e => e.Usuario)
            .Where(e => e.PostagemId == postagemId && e.UsuarioId == usuarioId)
            .Select(e => MapToResponse(e))
            .FirstOrDefaultAsync();
    }

    public async Task<PostagemEventoResponse> CurtirPostagemAsync(Guid usuarioId, Guid postagemId)
    {
        var evento = new PostagensEventos(postagemId, usuarioId, TipoEventoPostagem.Curtir);

        _context.PostagensEventos.Add(evento);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(evento.Id)
               ?? MapToResponse(evento);
    }

    public async Task<PostagemEventoResponse> DescutirPostagemAsync(Guid usuarioId, Guid postagemId)
    {
        var evento = new PostagensEventos(postagemId, usuarioId, TipoEventoPostagem.Descutir);

        _context.PostagensEventos.Add(evento);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(evento.Id)
               ?? MapToResponse(evento);
    }

    private static PostagemEventoResponse MapToResponse(PostagensEventos e)
    {
        return new PostagemEventoResponse(
            e.Id,
            e.PostagemId,
            e.UsuarioId,
            e.TipoEventoPostagem.ToString(),
            new UsuarioResponse(e.Usuario.Id, e.Usuario.Nome, e.Usuario.Email),
            e.DataEmissao
        );
    }
}
