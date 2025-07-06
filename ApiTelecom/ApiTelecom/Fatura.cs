public class Fatura
{
    public int Id { get; set; }

    public int ContratoId { get; set; }
    public Contrato Contrato { get; set; }

    public DateTime DataEmissao { get; set; }
    public DateTime DataVencimento { get; set; }
    public decimal ValorCobrado { get; set; }

    // "Paga", "Pendente", "Atrasada"
    public string Status { get; set; }
}
