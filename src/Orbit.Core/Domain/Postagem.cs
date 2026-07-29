namespace Orbit.Core.Domain;

public class Postagem
{
    public Guid Id { get; init; }
    public Guid UsuarioId { get; init; }
    public string? Descricao { get; set; }
    public List<PostagemMedia> Medias { get; set; } = [];
    public List<PostagemCategoria> Categorias { get; set; } = [];
    public DateTime DataCriacao { get; init; }
    public DateTime DataAtualizacao { get; set; }

    public Usuario Usuario { get; set; }
    public Postagem(Guid usuarioId, string? descricao = null)
    {
        Id = Guid.NewGuid();
        UsuarioId = usuarioId;
        Descricao = descricao;
        DataCriacao = DateTime.UtcNow;
        DataAtualizacao = DateTime.UtcNow;
    }

    public Postagem()
    {
    }
}
