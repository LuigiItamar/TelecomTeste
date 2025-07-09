import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaturaService } from '../services/fatura.service';
import { Fatura } from '../services/fatura';
import { FaturaFormComponent } from './fatura-form.component';
import { Contrato } from '../services/contrato';
import { ContratoService } from '../services/contrato.service';

@Component({
  selector: 'app-fatura',
  standalone: true,
  imports: [CommonModule, FaturaFormComponent],
  templateUrl: './fatura.html',
})
export class FaturaComponent implements OnInit {
  faturas: Fatura[] = [];
  contratos: Contrato[] = [];
  carregando = false;
  erro = '';
  mostrarFormulario = false;
  faturaSelecionada: Fatura | null = null;
  totalMes: number = 0;

  constructor(
    private faturaService: FaturaService,
    private contratoService: ContratoService
  ) {}

  ngOnInit(): void {
    this.carregarFaturas();
    this.contratoService.getContratos().subscribe(cts => this.contratos = cts);
  }

  carregarFaturas(): void {
    this.carregando = true;
    this.erro = '';
    this.faturaService.getFaturas().subscribe({
      next: (fts: Fatura[]) => {
        this.faturas = fts;
        this.totalMes = this.calcularTotalMesAtual();
        this.carregando = false;
      },
      error: (err: any) => {
        console.error(err);
        this.erro = 'Erro ao carregar faturas.';
        this.carregando = false;
      },
    });
  }

  abrirFormularioEditar(fatura: Fatura): void {
    this.faturaSelecionada = { ...fatura };
    this.mostrarFormulario = true;
  }

  abrirFormularioNovo(): void {
    this.faturaSelecionada = null;
    this.mostrarFormulario = true;
  }

  excluirFatura(id: number): void {
    if (!confirm('Tem certeza que deseja excluir esta fatura?')) return;
    this.faturaService.excluirFatura(id).subscribe({
      next: () => this.carregarFaturas(),
      error: () => (this.erro = 'Erro ao excluir fatura.'),
    });
  }

  fecharFormulario(refresh: boolean): void {
    this.mostrarFormulario = false;
    if (refresh) {
      this.carregarFaturas();
    }
  }

  getContratoNome(id: number): string {
    const c = this.contratos.find(c => c.id === id);
    return c ? c.nomeFilial + ' - ' + c.planoContratado : '';
  }

  calcularTotalMesAtual(): number {
    const now = new Date();
    const mes = now.getMonth();
    const ano = now.getFullYear();
    return this.faturas
      .filter(f => {
        const data = new Date(f.dataEmissao);
        return data.getMonth() === mes && data.getFullYear() === ano;
      })
      .reduce((acc, f) => acc + f.valorCobrado, 0);
  }
} 