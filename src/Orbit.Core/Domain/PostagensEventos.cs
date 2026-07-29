using Orbit.Core.Enums;

namespace Orbit.Core.Domain;

public class PostagensEventos
{
    public Guid Id { get; set; }
    public Guid PostagemId { get; set; }
    public Guid UsuarioId { get; set; }
    public TipoEventoPostagem TipoEventoPostagem { get; set; }
    public DateTime DataEmissao { get; set; }
    
    public Postagem Postagem { get; set; }
    public Usuario Usuario { get; set; }

    public PostagensEventos(Guid postagemId, Guid usuarioId, TipoEventoPostagem tipoEventoPostagem)
    {
        Id = Guid.NewGuid();
        PostagemId = postagemId;
        UsuarioId = usuarioId;
        TipoEventoPostagem = tipoEventoPostagem;
        DataEmissao = DateTime.UtcNow;
    }

    public PostagensEventos()
    {
        
    }
}