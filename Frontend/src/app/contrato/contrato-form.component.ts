import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contrato } from '../services/contrato';
import { ContratoService } from '../services/contrato.service';
import { Operadora } from '../services/operadora';
import { OperadoraService } from '../services/operadora.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contrato-form',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './contrato-form.html',
})
export class ContratoFormComponent implements OnChanges {
  @Input() contrato: Contrato | null = null;
  @Output() salvar = new EventEmitter<Contrato>();
  @Output() fechar = new EventEmitter<boolean>();

  model: Contrato = this.novoContrato();
  operadoras: Operadora[] = [];
  carregando = false;
  erro = '';

  statusList = ['Ativo', 'Inativo'];

  constructor(
    private contratoService: ContratoService,
    private operadoraService: OperadoraService
  ) {
    this.operadoraService.getOperadoras().subscribe(ops => this.operadoras = ops);
  }

  ngOnChanges(): void {
    if (this.contrato) {
      this.model = { ...this.contrato };
      if (this.model.dataInicio) {
        this.model.dataInicio = this.model.dataInicio.substring(0, 10);
      }
      if (this.model.dataVencimento) {
        this.model.dataVencimento = this.model.dataVencimento.substring(0, 10);
      }
    } else {
      this.model = this.novoContrato();
    }
  }

  novoContrato(): Contrato {
    return {
      id: 0,
      nomeFilial: '',
      operadoraId: 0,
      planoContratado: '',
      dataInicio: '',
      dataVencimento: '',
      valorMensal: 0,
      status: 'Ativo',
    };
  }

  onSubmit(): void {
    this.carregando = true;
    const payload = {
      ...this.model,
      dataInicio: this.model.dataInicio ? this.model.dataInicio.substring(0, 10) : '',
      dataVencimento: this.model.dataVencimento ? this.model.dataVencimento.substring(0, 10) : '',
    };
    let salvar$;
    if (this.model.id) {
      salvar$ = this.contratoService.atualizarContrato(payload).pipe(
        map(() => this.model)
      );
    } else {
      salvar$ = this.contratoService.criarContrato(payload);
    }
    (salvar$ as Observable<Contrato>).subscribe({
      next: (result: Contrato) => {
        this.salvar.emit(result);
        this.fechar.emit(true);
      },
      error: (err: any) => {
        console.error(err);
        this.erro = 'Erro ao salvar contrato.';
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  cancelar(): void {
    this.fechar.emit(true);
  }
} 