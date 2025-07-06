using Microsoft.EntityFrameworkCore;

public class TelecomContext : DbContext
{
    public TelecomContext(DbContextOptions<TelecomContext> options) : base(options) { }

    public DbSet<Operadora> Operadoras { get; set; }

    public DbSet<Contrato> Contratos { get; set; }

    public DbSet<Fatura> Faturas { get; set; }


}