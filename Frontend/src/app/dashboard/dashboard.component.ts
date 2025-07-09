import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartType,
  ChartDataset,
} from 'chart.js';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as bootstrap from 'bootstrap';

import { BaseChartDirective } from 'ng2-charts';

import { FaturaService } from '../services/fatura.service';
import { Fatura } from '../services/fatura';
import { ContratoService } from '../services/contrato.service';
import { Contrato } from '../services/contrato';

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  faturas: Fatura[] = [];
  contratos: Contrato[] = [];

  totalFaturas = 0;
  totalValor = 0;
  totalPagas = 0;
  totalPendentes = 0;
  totalAtrasadas = 0;

  dataLabelPlugin = ChartDataLabels;

  pieChartLabels: string[] = ['Paga', 'Pendente', 'Atrasada'];
  pieChartData: number[] = [];
  pieChartType: ChartType = 'pie';

  pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      datalabels: {
        color: '#000',
        font: { weight: 'bold' },
        formatter: this.formatarPorcentagem.bind(this),
      },
    },
  };

  barChartLabels: string[] = [];
  barChartData: ChartDataset<'bar'>[] = [
    { data: [], label: 'Emitidas', backgroundColor: '#19875480' },
    { data: [], label: 'Pagas', backgroundColor: '#0d6efd80' },
  ];

  barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  modalTitulo = '';
  faturasFiltradas: Fatura[] = [];

  constructor(private faturaService: FaturaService, private contratoService: ContratoService) {}

  ngOnInit(): void {
    this.faturaService.getFaturas().subscribe((faturas) => {
      this.faturas = faturas;

      this.totalFaturas = faturas.length;
      this.totalValor = faturas.reduce((acc, f) => acc + f.valorCobrado, 0);

      this.totalPagas = faturas.filter((f) => f.status === 'Paga').length;
      this.totalPendentes = faturas.filter((f) => f.status === 'Pendente').length;
      this.totalAtrasadas = faturas.filter((f) => f.status === 'Atrasada').length;

      this.montarPizza(faturas);
      this.montarBarra(faturas);
    });
    this.contratoService.getContratos().subscribe(contratos => this.contratos = contratos);
  }

  montarPizza(faturas: Fatura[]) {
    const contagem = { Paga: 0, Pendente: 0, Atrasada: 0 };

    faturas.forEach((f) => {
      if (contagem.hasOwnProperty(f.status)) contagem[f.status]++;
    });

    this.pieChartData = [contagem.Paga, contagem.Pendente, contagem.Atrasada];
  }

  montarBarra(faturas: Fatura[]) {
    const meses = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (11 - i));
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });

    this.barChartLabels = meses;

    const emitidas = Array(12).fill(0);
    const pagas = Array(12).fill(0);

    faturas.forEach((f) => {
      const data = new Date(f.dataEmissao);
      const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      const index = meses.indexOf(chave);
      if (index >= 0) {
        emitidas[index]++;
        if (f.status === 'Paga') pagas[index]++;
      }
    });

    this.barChartData = [
      {
        data: emitidas,
        label: 'Emitidas',
        backgroundColor: '#19875480',
      },
      {
        data: pagas,
        label: 'Pagas',
        backgroundColor: '#0d6efd80',
      },
    ];
  }

  abrirModal(status: string) {
    this.modalTitulo = `Faturas ${status}`;
    this.faturasFiltradas = this.faturas.filter((f) => f.status === status);

    const modalEl = document.getElementById('faturaModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  formatarPorcentagem(value: number): string {
    const total = this.pieChartData.reduce((a, b) => a + b, 0);
    return total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
  }

  getFilialNome(contratoId: number): string {
    const contrato = this.contratos.find(c => c.id === contratoId);
    return contrato ? contrato.nomeFilial : '';
  }
}
