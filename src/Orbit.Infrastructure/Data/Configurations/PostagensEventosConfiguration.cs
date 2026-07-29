using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Orbit.Core.Domain;

namespace Orbit.Infrastructure.Data.Configurations;

public class PostagensEventosConfiguration : IEntityTypeConfiguration<PostagensEventos>
{
    public void Configure(EntityTypeBuilder<PostagensEventos> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.TipoEventoPostagem)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.DataEmissao).IsRequired();

        builder.HasOne(e => e.Postagem)
            .WithMany(p => p.Eventos)
            .HasForeignKey(e => e.PostagemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Usuario)
            .WithMany()
            .HasForeignKey(e => e.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
