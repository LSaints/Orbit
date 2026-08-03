using Microsoft.EntityFrameworkCore;
using Orbit.Application.Requests.Comentario;
using Orbit.Application.Responses.Comentarios;
using Orbit.Application.Responses.Usuario;
using Orbit.Application.Services.Interfaces;
using Orbit.Core.Domain;
using Orbit.Infrastructure.Data;

namespace Orbit.Application.Services.Implementations;

public class ComentarioService : IComentarioService
{
    private readonly OrbitDbContext _context;

    public ComentarioService(OrbitDbContext context)
    {
        _context = context;
    }

    public async Task<ComentarioResponse> CreateAsync(Guid usuarioId, Guid postagemId, CriarComentarioRequest request)
    {
        var comentario = new PostagemComentario(postagemId, usuarioId, null, request.Conteudo);

        _context.PostagemComentarios.Add(comentario);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(comentario.Id)
               ?? MapToResponse(comentario);
    }

    public async Task<ComentarioResponse> CreateRespostaAsync(Guid usuarioId, Guid postagemId, Guid comentarioPaiId, CriarRespostaRequest request)
    {
        var comentario = new PostagemComentario(postagemId, usuarioId, comentarioPaiId, request.Conteudo);

        _context.PostagemComentarios.Add(comentario);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(comentario.Id)
               ?? MapToResponse(comentario);
    }

    public async Task<List<ComentarioResponse>> GetAllByPostagemIdAsync(Guid postagemId)
    {
        var comentarios = await _context.PostagemComentarios
            .Include(c => c.Usuario)
            .Where(c => c.PostagemId == postagemId)
            .OrderBy(c => c.DataCriacao)
            .ToListAsync();

        var filhosPorPai = comentarios
            .Where(c => c.ComentarioPaiId.HasValue)
            .GroupBy(c => c.ComentarioPaiId!.Value)
            .ToDictionary(
                g => g.Key,
                g => g.OrderBy(c => c.DataCriacao).ToList()
            );

        ComentarioResponse Montar(PostagemComentario c)
        {
            return MapToResponse(c) with
            {
                Respostas = (filhosPorPai.GetValueOrDefault(c.Id) ?? [])
                    .Select(Montar)
                    .ToList()
            };
        }

        return comentarios
            .Where(c => !c.ComentarioPaiId.HasValue)
            .Select(Montar)
            .ToList();
    }

    public async Task<ComentarioResponse?> GetByIdAsync(Guid id)
    {
        return await _context.PostagemComentarios
            .Include(c => c.Usuario)
            .Where(c => c.Id == id)
            .Select(c => MapToResponse(c))
            .FirstOrDefaultAsync();
    }

    private static ComentarioResponse MapToResponse(PostagemComentario c)
    {
        return new ComentarioResponse(
            c.Id,
            c.PostagemId,
            c.ComentarioPaiId,
            c.UsuarioId,
            new UsuarioResponse(c.Usuario.Id, c.Usuario.Nome, c.Usuario.Email),
            c.Conteudo,
            c.DataCriacao,
            []
        );
    }
}
