using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Orbit.Core.Domain;

namespace Orbit.Infrastructure.Data.Configurations;

public class PostagemConfiguration : IEntityTypeConfiguration<Postagem>
{
    public void Configure(EntityTypeBuilder<Postagem> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Descricao).HasMaxLength(2000);
        builder.Property(e => e.DataCriacao).IsRequired();
        builder.Property(e => e.DataAtualizacao).IsRequired();

        builder.HasOne<Usuario>()
            .WithMany()
            .HasForeignKey(e => e.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Medias)
            .WithOne()
            .HasForeignKey(e => e.PostagemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Categorias)
            .WithOne()
            .HasForeignKey(e => e.PostagemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Usuario)
            .WithMany(u => u.Postages)
            .HasForeignKey(e => e.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
