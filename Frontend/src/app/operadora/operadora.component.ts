import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperadoraService } from '../services/operadora.service';
import { Operadora } from '../services/operadora';

@Component({
  selector: 'app-operadora',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './operadora.html',
  styleUrls: ['./operadora.css'],
})
export class OperadoraComponent implements OnInit {
  operadoras: Operadora[] = [];
  carregando = false;
  erro = '';
  mostrarFormulario = false;

  // Para editar uma operadora selecionada
  operadoraSelecionada?: Operadora;

  constructor(private operadoraService: OperadoraService) {}

  ngOnInit(): void {
    this.carregarOperadoras();
  }

  carregarOperadoras(): void {
    this.carregando = true;
    this.erro = '';
    this.operadoraService.listarOperadoras().subscribe({
      next: (ops: Operadora[]) => {
        this.operadoras = ops;
        this.carregando = false;
      },
      error: (err: any) => {
        this.erro = 'Erro ao carregar operadoras.';
        this.carregando = false;
      },
    });
  }

  abrirFormularioEditar(operadora: Operadora): void {
    this.operadoraSelecionada = { ...operadora }; // clone para edição
    this.mostrarFormulario = true;
  }

  abrirFormularioNovo(): void {
    this.operadoraSelecionada = undefined;
    this.mostrarFormulario = true;
  }

  fecharFormulario(refresh: boolean): void {
    this.mostrarFormulario = false;
    if (refresh) {
      this.carregarOperadoras();
    }
  }
}
