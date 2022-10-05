import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    pieChartData: any;
    lineChartData: any;

    options = {
        tooltips: {
            callbacks: {
                label: (tooltipItem: any, data: any) => {
                    const dataset = data.datasets[tooltipItem.datasetIndex];
                    const valor = dataset.data[tooltipItem.index];
                    const label = dataset.label ? `${dataset.label}: ` : `${data.labels[tooltipItem.index]}: `;

                    return label + this.decimalPipe.transform(valor, '1.2-2');
                }
            }
        }
    };

    constructor(
        private dashboardService: DashboardService,
        private decimalPipe: DecimalPipe
    ) { }

    ngOnInit(): void {
        this.configurarGraficoPizza();
        this.configurarGraficoLinhas();
    }

    configurarGraficoPizza() {
        this.dashboardService.lancamentosPorCategoria()
            .then(dados => {
                this.pieChartData = {
                    labels: dados.map(d => d.categoria.nome),
                    datasets: [
                        {
                            data: dados.map(d => d.total),
                            backgroundColor: ['#FF9900', '#109618', '#990099', '#3B3EAC', '#DD4477', '#3366CC', '#DC3912']
                        }
                    ]
                };
            });
    }

    configurarGraficoLinhas() {
        this.dashboardService.lancamentosPorDia()
            .then(dados => {
                const diasMes = this.configurarDiaMes();
                const totaisReceita = this.totaisDiasMes(dados.filter(d => d.tipo === 'RECEITA'), diasMes);
                const totaisDespesa = this.totaisDiasMes(dados.filter(d => d.tipo === 'DESPESA'), diasMes);

                this.lineChartData = {
                    labels: diasMes,
                    datasets: [
                        {
                            label: 'Receitas',
                            data: totaisReceita,
                            borderColor: '#3366CC'
                        },
                        {
                            label: 'Despesas',
                            data: totaisDespesa,
                            borderColor: '#D62B00'
                        }
                    ]
                };
            });
    }

    private totaisDiasMes(dados: any[], diasMes: number[]) {
        const totais: number[] = [];

        for (const dia of diasMes) {
            let total = 0;

            for (const dado of dados) {
                if (dado.dia.getDate() === dia) {
                    total = dado.total;
                    break;
                }
            }
            totais.push(total);
        }

        return totais;
    }

    private configurarDiaMes() {
        const mesReferencia = new Date();
        mesReferencia.setMonth(mesReferencia.getMonth() + 1);
        mesReferencia.setDate(0);

        const qtdeDias = mesReferencia.getDate();
        const dias: number[] = [];

        for (let i = 1; i <= qtdeDias; i++) {
            dias.push(i);
        }

        return dias;
    }
}
