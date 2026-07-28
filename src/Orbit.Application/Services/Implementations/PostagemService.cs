using Microsoft.EntityFrameworkCore;
using Orbit.Application.Requests.Postagem;
using Orbit.Application.Responses.Postagem;
using Orbit.Application.Services.Interfaces;
using Orbit.Core.Domain;
using Orbit.Infrastructure.Data;
using Orbit.Infrastructure.Storage;

namespace Orbit.Application.Services.Implementations;

public class PostagemService : IPostagemService
{
    private readonly OrbitDbContext _context;
    private readonly IFileStorageService _storageService;

    private const int MaxConcurrencyRetries = 3;

    private static readonly HashSet<string> AllowedImageTypes =
        ["image/jpeg", "image/png", "image/webp"];

    private static readonly HashSet<string> AllowedVideoTypes =
        ["video/mp4", "video/webm", "video/ogg"];

    public PostagemService(OrbitDbContext context, IFileStorageService storageService)
    {
        _context = context;
        _storageService = storageService;
    }

    private async Task<int> SaveChangesWithRetryAsync(CancellationToken cancellationToken = default)
    {
        for (var attempt = 0; ; attempt++)
        {
            try
            {
                return await _context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException) when (attempt < MaxConcurrencyRetries - 1)
            {
                _context.ChangeTracker.Clear();
            }
        }
    }

    public async Task<PostagemResponse?> GetByIdAsync(Guid id)
    {
        return await _context.Postagens
            .Include(p => p.Medias)
            .Where(p => p.Id == id)
            .Select(p => MapToResponse(p))
            .FirstOrDefaultAsync();
    }

    public async Task<List<PostagemResponse>> GetAllByUsuarioIdAsync(Guid usuarioId)
    {
        return await _context.Postagens
            .Include(p => p.Medias)
            .Where(p => p.UsuarioId == usuarioId)
            .OrderByDescending(p => p.DataCriacao)
            .Select(p => MapToResponse(p))
            .ToListAsync();
    }

    public async Task<List<PostagemResponse>> GetAllAsync(int page = 1, int pageSize = 20)
    {
        return await _context.Postagens
            .Include(p => p.Medias)
            .OrderByDescending(p => p.DataCriacao)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => MapToResponse(p))
            .ToListAsync();
    }

    public async Task<PostagemResponse> CreateAsync(Guid usuarioId, CriarPostagemRequest request)
    {
        var postagem = new Postagem(usuarioId, request.Descricao);

        if (request.Categorias is { Count: > 0 })
        {
            postagem.Categorias = request.Categorias
                .Select(c => new PostagemCategoria(postagem.Id, c))
                .ToList();
        }

        _context.Postagens.Add(postagem);
        await SaveChangesWithRetryAsync();

        return await GetByIdAsync(postagem.Id)
               ?? MapToResponse(postagem);
    }

    public async Task<PostagemResponse?> UpdateAsync(Guid usuarioId, Guid postagemId, AtualizarPostagemRequest request)
    {
        var postagem = await _context.Postagens
            .Include(p => p.Categorias)
            .FirstOrDefaultAsync(p => p.Id == postagemId && p.UsuarioId == usuarioId);

        if (postagem is null) return null;

        postagem.Descricao = request.Descricao;
        postagem.DataAtualizacao = DateTime.UtcNow;

        if (request.Categorias is not null)
        {
            postagem.Categorias.Clear();

            postagem.Categorias = request.Categorias
                .Select(c => new PostagemCategoria(postagemId, c))
                .ToList();
        }

        await SaveChangesWithRetryAsync();

        return await GetByIdAsync(postagemId);
    }

    public async Task<bool> DeleteAsync(Guid usuarioId, Guid postagemId)
    {
        var postagem = await _context.Postagens
            .Include(p => p.Medias)
            .FirstOrDefaultAsync(p => 
                p.Id == postagemId && p.UsuarioId == usuarioId);

        if (postagem is null) return false;

        foreach (var media in postagem.Medias)
        {
            var objectName = ExtractObjectName(media.Url);
            await _storageService.RemoveAsync("", objectName);
        }

        _context.Postagens.Remove(postagem);
        await SaveChangesWithRetryAsync();

        return true;
    }

    public async Task<PostagemResponse?> UploadMediaAsync(Guid usuarioId, Guid postagemId, Stream fileStream, string fileName, string contentType)
    {
        var postagem = await _context.Postagens
            .Include(p => p.Medias)
            .FirstOrDefaultAsync(p => p.Id == postagemId && p.UsuarioId == usuarioId);

        if (postagem is null) return null;

        var tipo = GetMediaType(contentType);

        var ext = Path.GetExtension(fileName);
        var mediaId = Guid.NewGuid();
        var objectName = $"{usuarioId}/postagens/{postagemId}/{mediaId}{ext}";

        await _storageService.UploadAsync("", objectName, fileStream, contentType);

        var url = _storageService.GetObjectUrl(objectName);
        var media = new PostagemMedia(postagemId, url, tipo);

        await _context.PostagemMedias.AddAsync(media);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(postagemId);
    }

    public async Task<bool> RemoveMediaAsync(Guid usuarioId, Guid postagemId, Guid mediaId)
    {
        var postagem = await _context.Postagens
            .Include(p => p.Medias)
            .FirstOrDefaultAsync(p => p.Id == postagemId && p.UsuarioId == usuarioId);

        if (postagem is null) return false;

        var media = postagem.Medias.FirstOrDefault(m => m.Id == mediaId);

        if (media is null) return false;

        var objectName = ExtractObjectName(media.Url);
        await _storageService.RemoveAsync("", objectName);

        postagem.Medias.Remove(media);
        await SaveChangesWithRetryAsync();

        return true;
    }

    public static bool IsValidMediaType(string contentType)
    {
        return AllowedImageTypes.Contains(contentType) || AllowedVideoTypes.Contains(contentType);
    }

    private static string GetMediaType(string contentType)
    {
        return AllowedImageTypes.Contains(contentType) ? "imagem" : "video";
    }

    private static string ExtractObjectName(string url)
    {
        const string prefix = "/uploads/";
        var index = url.IndexOf(prefix, StringComparison.Ordinal);
        return index >= 0 ? url[(index + prefix.Length)..] : url;
    }

    private static PostagemResponse MapToResponse(Postagem p)
    {
        return new PostagemResponse(
            p.Id,
            p.UsuarioId,
            p.Descricao,
            p.Medias.Select(m => 
                new PostagemMediaResponse(m.Id, m.Url, m.Tipo)).ToList(),
            p.Categorias.Select(c => 
                new PostagemCategoriaResponse(c.Id, c.Descricao)).ToList(),
            p.DataCriacao,
            p.DataAtualizacao
        );
    }
}
