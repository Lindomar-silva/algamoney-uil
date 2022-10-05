import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { RelatoriosService } from '../relatorios.service';

@Component({
    selector: 'app-relatorio-lancamentos',
    templateUrl: './relatorio-lancamentos.component.html',
    styleUrls: ['./relatorio-lancamentos.component.css']
})
export class RelatorioLancamentosComponent {

    periodoInicio: Date;
    periodoFim: Date;

    constructor(
        private relatoriosService: RelatoriosService,
        private messageService: MessageService,
        private errorHandlerService: ErrorHandlerService
    ) { }

    // https://app.algaworks.com/forum/topicos/74744/e-possivel-alterar-nome-do-link-gerado
    // https://app.algaworks.com/forum/topicos/84806/duvida-mensagem-de-nenhum-lancamento-foi-encontrado
    gerar() {
        this.relatoriosService.relatorioLancamentosPorPessoa(this.periodoInicio, this.periodoFim)
            .then(relatorio => {
                if (relatorio !== null) {
                    this.openPdf(relatorio);
                    // this.downloadPdf(relatorio, 'LançamentoPorPessoa');
                } else {
                    this.messageService.add({ severity: 'info', detail: 'Nenhum lançamento foi encontrado!' });
                }
            })
            .catch(erro => this.errorHandlerService.handle(erro));
    }

    openPdf(relatorio: any) {
        const url = window.URL.createObjectURL(relatorio);
        window.open(url);
    }

    downloadPdf(relatorio: any, pdfName: string) {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(relatorio);
        link.download = pdfName + '.pdf';
        link.click();
    }

    // Dados + string/bytes pdf
    gerarBytes() {
        this.relatoriosService.relatorioLancamentosPorPessoaDto(this.periodoInicio, this.periodoFim)
            .then((response: any) => {
                if (response.qtde > 0) {
                    const link = document.createElement('a');
                    link.href = `data:application/pdf;base64, ${response.pdf}`;
                    link.download = 'LançamentoPorPessoa.pdf';
                    link.click();
                } else {
                    this.messageService.add({ severity: 'info', detail: 'Nenhum lançamento foi encontrado!' });
                }
            })
            .catch(erro => this.errorHandlerService.handle(erro));
    }
}
