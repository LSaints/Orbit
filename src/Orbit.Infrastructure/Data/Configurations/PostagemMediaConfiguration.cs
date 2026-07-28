using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Orbit.Core.Domain;

namespace Orbit.Infrastructure.Data.Configurations;

public class PostagemMediaConfiguration : IEntityTypeConfiguration<PostagemMedia>
{
    public void Configure(EntityTypeBuilder<PostagemMedia> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Url).IsRequired().HasMaxLength(2048);
        builder.Property(e => e.Tipo).IsRequired().HasMaxLength(50);
    }
}
