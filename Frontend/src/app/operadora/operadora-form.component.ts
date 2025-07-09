import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Operadora } from '../services/operadora';
import { OperadoraService } from '../services/operadora.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-operadora-form',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './operadora-form.html',
})
export class OperadoraFormComponent implements OnChanges {
  @Input() operadora: Operadora | null = null;
  @Output() salvar = new EventEmitter<Operadora>();
  @Output() fechar = new EventEmitter<boolean>();

  model: Operadora = this.novaOperadora();
  tiposServico = ['Móvel', 'Fixo', 'Internet'];
  carregando = false;
  erro = '';

  constructor(private operadoraService: OperadoraService) {}

  ngOnChanges(): void {
    if (this.operadora) {
      this.model = { ...this.operadora };
    } else {
      this.model = this.novaOperadora();
    }
  }

  novaOperadora(): Operadora {
    return {
      id: 0,
      nome: '',
      tipoServico: '',
      contatoSuporte: '',
    };
  }

  onSubmit(): void {
    this.carregando = true;

    let salvar$;
    if (this.model.id) {
      salvar$ = this.operadoraService.atualizarOperadora(this.model).pipe(
        // Como atualizarOperadora retorna void, map para o model atual
        map(() => this.model)
      );
    } else {
      salvar$ = this.operadoraService.criarOperadora(this.model);
    }

    (salvar$ as Observable<Operadora>).subscribe({
      next: (result: Operadora) => {
        this.salvar.emit(result);
        this.fechar.emit(true);
      },
      error: (err: any) => {
        console.error(err);
        this.erro = 'Erro ao salvar operadora.';
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
