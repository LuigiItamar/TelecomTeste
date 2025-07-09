export interface Contrato {
  id: number;
  nomeFilial: string;
  operadoraId: number;
  planoContratado: string;
  dataInicio: string;
  dataVencimento: string;
  valorMensal: number;
  status: 'Ativo' | 'Inativo';
} 