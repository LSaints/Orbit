namespace Orbit.Core.Domain;

public class PostagemComentario
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PostagemId { get; set; }
    public Guid UsuarioId { get; set; }
    public Guid? ComentarioPaiId { get; set; }
    public string Conteudo { get; set; } = string.Empty;
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    public Postagem Postagem { get; set; }
    public Usuario Usuario { get; set; }
    
    public PostagemComentario(Guid postagemId, Guid usuarioId, Guid? comentarioPaiId, string conteudo)
    {
        PostagemId = postagemId;
        UsuarioId = usuarioId;
        ComentarioPaiId = comentarioPaiId;
        Conteudo = conteudo;
    }

    public PostagemComentario()
    {
        
    }
}