import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { AuthService } from 'src/app/seguranca/auth.service';
import { LancamentoFiltro, LancamentosService } from '../lancamentos.service';

@Component({
    selector: 'app-lancamento-pesquisa',
    templateUrl: './lancamento-pesquisa.component.html',
    styleUrls: ['./lancamento-pesquisa.component.css']
})
export class LancamentoPesquisaComponent implements OnInit {

    paginaClicada = -1; // Evita repetir a consulta ao clicar na mesma página
    totalRegistro = 0;
    filtro = new LancamentoFiltro();
    lancamentoList = [];
    @ViewChild('tabela') grid: any;

    constructor(
        private lancamentosService: LancamentosService,
        private messageService: MessageService,
        private confirmation: ConfirmationService,
        private errorHandler: ErrorHandlerService,
        private authService: AuthService,
        private title: Title
    ) { }

    ngOnInit() {
        this.title.setTitle('Pesquisa de lançamentos');
    }

    pesquisar(nPagina = 0) {

        this.filtro.pagina = nPagina;
        const pagina = this.filtro.itensPorPagina * nPagina;

        this.lancamentosService.pesquisar(this.filtro)
            .then(result => {
                this.totalRegistro = result.total;
                this.lancamentoList = result.lancamentos;
                this.paginaClicada = nPagina;
                this.grid.first = pagina; // Muda o focus para o botão da página
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    aoMudarPagina(event: LazyLoadEvent) {
        const nPagina = event.first / event.rows;

        if (this.paginaClicada !== nPagina) {
            this.pesquisar(nPagina);
        }
    }

    confirmarExclusao(lancamento: any) {
        this.confirmation.confirm({
            message: `Tem certeza que deseja excluir o lançamento<br>'${lancamento.descricao}'?`,
            accept: () => {
                this.excluir(lancamento);
            }
        });
    }

    excluir(lancamento: any) {
        this.lancamentosService.excluir(lancamento.codigo)
            .then(() => {
                // this.grid.reset();
                this.pesquisar(this.filtro.pagina); // Continua a pesquisa na página atual
                this.messageService.add({ severity: 'success', detail: 'Lançamento excluído com suvesso!' });
            })
            .catch(erro => this.errorHandler.handle(erro));
    }
}
