namespace Orbit.Core.Domain;

public class Perfil
{
    public Guid Id { get; set; }
    public Guid UsuarioId { get; set; }
    public string UrlImagemPerfil { get; set; }
    
    public Usuario Usuario { get; set; }

    public Perfil(Guid userId, string urlImagemPerfil)
    {
        Id = Guid.NewGuid();
        UsuarioId = userId;
        UrlImagemPerfil = urlImagemPerfil;
    }

    public Perfil()
    {
        
    }
}