using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Orbit.Core.Domain;

namespace Orbit.Infrastructure.Data.Configurations;

public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Nome).IsRequired().HasMaxLength(200);
        builder.Property(e => e.Email).IsRequired().HasMaxLength(256);
        builder.Property(e => e.Senha).IsRequired().HasMaxLength(512);
        builder.Property(e => e.DataNascimento).IsRequired();
        builder.Property(e => e.DataCadastro).IsRequired();

        builder.HasOne(p => p.Perfil).WithOne(p => p.Usuario);
    }
}
