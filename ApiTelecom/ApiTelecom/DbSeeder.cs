using Microsoft.EntityFrameworkCore;
using System;

public static class DbSeeder
{
    public static void Seed(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<TelecomContext>();

        // Apply migrations (optional but common)

        context.Operadoras.AddRange(
            new Operadora
            {
                Id = 1,
                Nome = "Telecom Brasil",
                TipoServico = "Telefonia e Internet",
                ContatoSuporte = "suporte@telecombrasil.com.br"
            },
            new Operadora
            {
                Id = 2,
                Nome = "Claro Brasil",
                TipoServico = "Internet Fibra",
                ContatoSuporte = "suporte@Clarobrasil.com.br"
            }
        );

        context.Contratos.AddRange(
            new Contrato
            {
                Id = 1,
                NomeFilial = "Filial São Paulo",
                OperadoraId = 1,
                PlanoContratado = "Plano Empresarial 100GB",
                DataInicio = DateTime.Parse("2024-01-01"),
                DataVencimento = DateTime.Parse("2025-01-01"),
                ValorMensal = 1500.00m,
                Status = "Ativo"
            },
            new Contrato
            {
                Id = 2,
                NomeFilial = "Filial Santa Catarina",
                OperadoraId = 2,
                PlanoContratado = "Plano Empresarial 1000GB",
                DataInicio = DateTime.Parse("2024-01-01"),
                DataVencimento = DateTime.Parse("2025-01-01"),
                ValorMensal = 1500.00m,
                Status = "Ativo"
            }
        );

        context.Faturas.AddRange(
            new Fatura
            {
                Id = 1,
                ContratoId = 1,
                DataEmissao = DateTime.Parse("2024-03-10"),  // Março
                DataVencimento = DateTime.Parse("2024-03-25"),
                ValorCobrado = 1500.00m,
                Status = "Pendente"
            },
            new Fatura
            {
                Id = 2,
                ContratoId = 1,
                DataEmissao = DateTime.Parse("2024-04-05"),  // Abril
                DataVencimento = DateTime.Parse("2024-04-20"),
                ValorCobrado = 1800.00m,
                Status = "Paga"
            },
            new Fatura
            {
                Id = 3,
                ContratoId = 1,
                DataEmissao = DateTime.Parse("2024-05-12"),  // Maio
                DataVencimento = DateTime.Parse("2024-05-27"),
                ValorCobrado = 1200.00m,
                Status = "Atrasada"
            },
            new Fatura
            {
    Id = 4,
    ContratoId = 1,
    DataEmissao = DateTime.Parse("2024-06-01"),  // Junho
    DataVencimento = DateTime.Parse("2024-06-16"),
    ValorCobrado = 1600.00m,
    Status = "Paga"
},
new Fatura
{
    Id = 5,
    ContratoId = 1,
    DataEmissao = DateTime.Parse("2024-07-10"),  // Julho
    DataVencimento = DateTime.Parse("2024-07-25"),
    ValorCobrado = 1700.00m,
    Status = "Paga"
},
new Fatura
{
    Id = 6,
    ContratoId = 1,
    DataEmissao = DateTime.Parse("2024-07-15"),  // Julho (mesmo mês com faturas distintas)
    DataVencimento = DateTime.Parse("2024-07-30"),
    ValorCobrado = 1100.00m,
    Status = "Pendente"
},
new Fatura
{
    Id = 7,
    ContratoId = 1,
    DataEmissao = DateTime.Parse("2024-08-01"),  // Agosto
    DataVencimento = DateTime.Parse("2024-08-16"),
    ValorCobrado = 1400.00m,
    Status = "Paga"
}

        );

        context.SaveChanges();

    }
}