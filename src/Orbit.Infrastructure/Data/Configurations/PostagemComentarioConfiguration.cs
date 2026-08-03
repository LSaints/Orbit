using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Orbit.Core.Domain;

namespace Orbit.Infrastructure.Data.Configurations;

public class PostagemComentarioConfiguration : IEntityTypeConfiguration<PostagemComentario>
{
    public void Configure(EntityTypeBuilder<PostagemComentario> builder)
    {
        builder.HasKey(p => p.Id);
        builder.ToTable("PostagemComentario");
        builder
            .HasOne(p => p.Postagem)
            .WithMany(p => p.Comentarios)
            .HasForeignKey(p => p.PostagemId);

        builder
            .HasOne(p => p.Usuario)
            .WithMany(u => u.PostagemComentarios)
            .HasForeignKey(p => p.UsuarioId);
    }
}