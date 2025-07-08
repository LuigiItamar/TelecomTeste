import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NgIf, NgFor, NgModel, FormsModule } from '@angular/common';
import { Operadora } from '../services/operadora';
import { OperadoraService } from '../services/operadora.service';

@Component({
  selector: 'app-operadora-form',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './operadora-form.html',
})
export class OperadoraFormComponent implements OnChanges {
  @Input() operadora?: Operadora; // Recebe operadora para editar
  @Output() fechar = new EventEmitter<boolean>();
  @Output() atualizou = new EventEmitter<void>();

  model: Operadora = this.novoModelo();
  carregando = false;
  erro = '';
  tiposServico = ['Móvel', 'Fixo', 'Internet'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['operadora'] && this.operadora) {
      this.model = { ...this.operadora }; // copia para model
    } else {
      this.model = this.novoModelo();
    }
    this.erro = '';
    this.carregando = false;
  }

  novoModelo(): Operadora {
    return {
      id: 0,
      nome: '',
      tipoServico: '',
      contatoSuporte: '',
    };
  }

  salvar(form: any) {
    if (form.invalid) return;

    this.carregando = true;
    this.erro = '';

    let salvarObservable;

    if (this.model.id) {
      salvarObservable = this.operadoraService.atualizarOperadora(this.model);
    } else {
      salvarObservable = this.operadoraService.criarOperadora(this.model);
    }

    salvarObservable.subscribe({
      next: () => {
        this.carregando = false;
        this.atualizou.emit();
        this.fechar.emit(true);
      },
      error: (err) => {
        this.erro = 'Erro ao salvar operadora.';
        this.carregando = false;
      },
    });
  }

  cancelar() {
    this.fechar.emit(false);
  }

  constructor(private operadoraService: OperadoraService) {}
}
