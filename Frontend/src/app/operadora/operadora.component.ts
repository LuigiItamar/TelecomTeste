import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperadoraService } from '../services/operadora.service';
import { Operadora } from '../services/operadora';
import { OperadoraFormComponent } from './operadora-form.component';

@Component({
  selector: 'app-operadora',
  standalone: true,
  imports: [CommonModule, OperadoraFormComponent],
  templateUrl: './operadora.html',
  // styleUrls: ['./operadora.css'], // Removido pois o arquivo não existe mais
})
export class OperadoraComponent implements OnInit {
  operadoras: Operadora[] = [];
  carregando = false;
  erro = '';
  mostrarFormulario = false;

  operadoraSelecionada: Operadora | null = null;

  constructor(private operadoraService: OperadoraService) {}

  ngOnInit(): void {
    this.carregarOperadoras();
  }

  carregarOperadoras(): void {
    this.carregando = true;
    this.erro = '';
    this.operadoraService.getOperadoras().subscribe({
      next: (ops: Operadora[]) => {
        this.operadoras = ops;
        this.carregando = false;
      },
      error: (err: any) => {
        console.error(err);
        this.erro = 'Erro ao carregar operadoras.';
        this.carregando = false;
      },
    });
  }

  abrirFormularioEditar(operadora: Operadora): void {
    this.operadoraSelecionada = { ...operadora };
    this.mostrarFormulario = true;
  }

  abrirFormularioNovo(): void {
    this.operadoraSelecionada = null;
    this.mostrarFormulario = true;
  }

  excluirOperadora(id: number): void {
    if (!confirm('Tem certeza que deseja excluir esta operadora?')) return;
    this.operadoraService.excluirOperadora(id).subscribe({
      next: () => this.carregarOperadoras(),
      error: () => (this.erro = 'Erro ao excluir operadora.'),
    });
  }

  fecharFormulario(refresh: boolean): void {
    this.mostrarFormulario = false;
    if (refresh) {
      this.carregarOperadoras();
    }
  }
}
