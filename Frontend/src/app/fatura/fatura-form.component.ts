import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Fatura } from '../services/fatura';
import { FaturaService } from '../services/fatura.service';
import { Contrato } from '../services/contrato';
import { ContratoService } from '../services/contrato.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fatura-form',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './fatura-form.html',
})
export class FaturaFormComponent implements OnChanges {
  @Input() fatura: Fatura | null = null;
  @Output() salvar = new EventEmitter<Fatura>();
  @Output() fechar = new EventEmitter<boolean>();

  model: Fatura = this.novaFatura();
  contratos: Contrato[] = [];
  carregando = false;
  erro = '';
  statusList = ['Paga', 'Pendente', 'Atrasada'];

  constructor(
    private faturaService: FaturaService,
    private contratoService: ContratoService
  ) {
    this.contratoService.getContratos().subscribe(cts => this.contratos = cts);
  }

  ngOnChanges(): void {
    if (this.fatura) {
      this.model = { ...this.fatura };
      if (this.model.dataEmissao) {
        this.model.dataEmissao = this.model.dataEmissao.substring(0, 10);
      }
      if (this.model.dataVencimento) {
        this.model.dataVencimento = this.model.dataVencimento.substring(0, 10);
      }
    } else {
      this.model = this.novaFatura();
    }
  }

  novaFatura(): Fatura {
    return {
      id: 0,
      contratoId: 0,
      dataEmissao: '',
      dataVencimento: '',
      valorCobrado: 0,
      status: 'Pendente',
    };
  }

  onSubmit(): void {
    this.carregando = true;
    const payload = {
      ...this.model,
      dataEmissao: this.model.dataEmissao ? this.model.dataEmissao.substring(0, 10) : '',
      dataVencimento: this.model.dataVencimento ? this.model.dataVencimento.substring(0, 10) : '',
    };
    let salvar$;
    if (this.model.id) {
      salvar$ = this.faturaService.atualizarFatura(payload).pipe(
        map(() => this.model)
      );
    } else {
      salvar$ = this.faturaService.criarFatura(payload);
    }
    (salvar$ as Observable<Fatura>).subscribe({
      next: (result: Fatura) => {
        this.salvar.emit(result);
        this.fechar.emit(true);
      },
      error: (err: any) => {
        console.error(err);
        this.erro = 'Erro ao salvar fatura.';
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