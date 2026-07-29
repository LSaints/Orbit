namespace Orbit.Core.Domain;

public class Usuario
{
    public Guid Id { get; set; }
    public string Nome { get; set; }
    public string Email { get; set; }
    public string Senha { get; set; }
    public DateTime DataNascimento { get; set; }
    public DateTime DataCadastro { get; set; }
    
    public Perfil Perfil { get; set; }
    public List<Postagem> Postages { get; set; } = [];

    public Usuario(string nome, string email, string senha, DateTime dataNascimento)
    {
        Id = Guid.NewGuid();
        Nome = nome;
        Email = email;
        Senha = senha;
        DataNascimento = dataNascimento;
        DataCadastro = DateTime.UtcNow;
    }

    public Usuario()
    {
        
    }

    private void Validar()
    {
        if (string.IsNullOrEmpty(Nome))
            throw new ArgumentException("Nome invalido");
        if (string.IsNullOrEmpty(Email))
            throw new ArgumentException("Email invalido");
        if (string.IsNullOrEmpty(Senha))
            throw new ArgumentException("Senha invalido");
        if (DataNascimento < DateTime.Today)
            throw new ArgumentException("Data nascimento invalido");
    }
}