import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratoService } from '../services/contrato.service';
import { Contrato } from '../services/contrato';
import { ContratoFormComponent } from './contrato-form.component';
import { Operadora } from '../services/operadora';
import { OperadoraService } from '../services/operadora.service';
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contrato',
  standalone: true,
  imports: [CommonModule, ContratoFormComponent, FormsModule],
  templateUrl: './contrato.html',
})
export class ContratoComponent implements OnInit {
  contratos: Contrato[] = [];
  operadoras: Operadora[] = [];
  carregando = false;
  erro = '';
  mostrarFormulario = false;
  contratoSelecionado: Contrato | null = null;
  contratosVencendo: Contrato[] = [];
  mostrarModalVencendo = false;
  contratoParaNotificar: Contrato | null = null;
  emailNotificacao = '';
  emailCorpo = '';
  notificando = false;
  mensagemNotificacao = '';

  constructor(
    private contratoService: ContratoService,
    private operadoraService: OperadoraService
  ) {}

  ngOnInit(): void {
    this.carregarContratos();
    this.operadoraService.getOperadoras().subscribe(ops => this.operadoras = ops);
  }

  carregarContratos(): void {
    this.carregando = true;
    this.erro = '';
    this.contratoService.getContratos().subscribe({
      next: (cts: Contrato[]) => {
        this.contratos = cts;
        this.carregando = false;
      },
      error: (err: any) => {
        console.error(err);
        this.erro = 'Erro ao carregar contratos.';
        this.carregando = false;
      },
    });
  }

  abrirFormularioEditar(contrato: Contrato): void {
    this.contratoSelecionado = { ...contrato };
    this.mostrarFormulario = true;
  }

  abrirFormularioNovo(): void {
    this.contratoSelecionado = null;
    this.mostrarFormulario = true;
  }

  excluirContrato(id: number): void {
    if (!confirm('Tem certeza que deseja excluir este contrato?')) return;
    this.contratoService.excluirContrato(id).subscribe({
      next: () => this.carregarContratos(),
      error: () => (this.erro = 'Erro ao excluir contrato.'),
    });
  }

  fecharFormulario(refresh: boolean): void {
    this.mostrarFormulario = false;
    if (refresh) {
      this.carregarContratos();
    }
  }

  abrirModalVencendo(): void {
    this.contratoService.getContratosVencendo().subscribe({
      next: (cts) => {
        this.contratosVencendo = cts;
        this.mostrarModalVencendo = true;
      },
      error: () => {
        this.contratosVencendo = [];
        this.mostrarModalVencendo = true;
      }
    });
  }

  fecharModalVencendo(): void {
    this.mostrarModalVencendo = false;
    this.contratoParaNotificar = null;
    this.emailNotificacao = '';
    this.emailCorpo = '';
    this.mensagemNotificacao = '';
  }

  selecionarParaNotificar(contrato: Contrato): void {
    this.contratoParaNotificar = contrato;
    this.emailNotificacao = '';
    this.emailCorpo = '';
    this.mensagemNotificacao = '';
  }

  enviarNotificacao(): void {
    if (!this.contratoParaNotificar || !this.emailNotificacao || !this.emailCorpo) return;
    this.notificando = true;
    this.contratoService.notificarVencimento(this.contratoParaNotificar.id, this.emailNotificacao, this.emailCorpo).subscribe({
      next: () => {
        this.mensagemNotificacao = 'Notificação enviada com sucesso!';
        this.notificando = false;
      },
      error: () => {
        this.mensagemNotificacao = 'Erro ao enviar notificação.';
        this.notificando = false;
      }
    });
  }

  getOperadoraNome(id: number): string {
    const op = this.operadoras.find(o => o.id === id);
    return op ? op.nome : '';
  }
} 