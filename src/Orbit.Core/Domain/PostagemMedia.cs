namespace Orbit.Core.Domain;

public class PostagemMedia
{
    public Guid Id { get; init; }
    public Guid PostagemId { get; init; }
    public string Url { get; set; }
    public string Tipo { get; set; }

    public PostagemMedia(Guid postagemId, string url, string tipo)
    {
        Id = Guid.NewGuid();
        PostagemId = postagemId;
        Url = url;
        Tipo = tipo;
    }

    public PostagemMedia()
    {
    }
}
