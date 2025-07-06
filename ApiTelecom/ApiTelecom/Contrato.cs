public class Contrato
{
    public int Id { get; set; }

    public string NomeFilial { get; set; }

    // Chave estrangeira para Operadora
    public int OperadoraId { get; set; }
    public Operadora Operadora { get; set; }  // Navegação

    public string PlanoContratado { get; set; }

    public DateTime DataInicio { get; set; }

    public DateTime DataVencimento { get; set; }

    public decimal ValorMensal { get; set; }

    public string Status { get; set; } // "Ativo" ou "Inativo"
}
