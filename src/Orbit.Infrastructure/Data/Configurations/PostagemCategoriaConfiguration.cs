using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Orbit.Core.Domain;

namespace Orbit.Infrastructure.Data.Configurations;

public class PostagemCategoriaConfiguration : IEntityTypeConfiguration<PostagemCategoria>
{
    public void Configure(EntityTypeBuilder<PostagemCategoria> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Descricao).IsRequired().HasMaxLength(200);
        builder.Property(e => e.DataCriacao).IsRequired();
    }
}
