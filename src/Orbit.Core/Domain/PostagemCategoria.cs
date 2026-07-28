namespace Orbit.Core.Domain;

public class PostagemCategoria
{
    public Guid Id { get; init; }
    public Guid PostagemId { get; init; }
    public string Descricao { get; init; }
    public DateTime DataCriacao { get; init; }

    public PostagemCategoria(Guid postagemId, string descricao)
    {
        Id = Guid.NewGuid();
        PostagemId = postagemId;
        Descricao = descricao;
        DataCriacao = DateTime.UtcNow;
    }

    public PostagemCategoria()
    {
    }
}
