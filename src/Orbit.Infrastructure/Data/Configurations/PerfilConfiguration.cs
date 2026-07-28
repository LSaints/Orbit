using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Orbit.Core.Domain;

namespace Orbit.Infrastructure.Data.Configurations;

public class PerfilConfiguration : IEntityTypeConfiguration<Perfil>
{
    public void Configure(EntityTypeBuilder<Perfil> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.UrlImagemPerfil).IsRequired().HasMaxLength(2048);
        builder.HasOne<Usuario>()
            .WithOne(p => p.Perfil)
            .HasForeignKey<Perfil>(p => p.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
