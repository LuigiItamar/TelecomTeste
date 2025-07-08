export interface Fatura {
  id: number;
  contratoId: number;
  dataEmissao: string;
  dataVencimento: string;
  valorCobrado: number;
  status: 'Paga' | 'Pendente' | 'Atrasada';
}
