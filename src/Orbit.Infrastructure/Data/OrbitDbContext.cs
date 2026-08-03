using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Orbit.Core.Domain;

namespace Orbit.Infrastructure.Data;

public class OrbitDbContext : DbContext
{
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Perfil> Perfils => Set<Perfil>();
    public DbSet<Postagem> Postagens => Set<Postagem>();
    public DbSet<PostagemMedia> PostagemMedias => Set<PostagemMedia>();
    public DbSet<PostagemCategoria> PostagemCategorias => Set<PostagemCategoria>();
    public DbSet<PostagensEventos> PostagensEventos => Set<PostagensEventos>();
    public DbSet<PostagemComentario> PostagemComentarios => Set<PostagemComentario>();

    public OrbitDbContext(DbContextOptions<OrbitDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
