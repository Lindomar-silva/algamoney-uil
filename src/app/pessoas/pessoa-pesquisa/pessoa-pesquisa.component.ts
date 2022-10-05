import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';

import { PessoasFiltro, PessoasService } from '../pessoas.service';

@Component({
    selector: 'app-pessoa-pesquisa',
    templateUrl: './pessoa-pesquisa.component.html',
    styleUrls: ['./pessoa-pesquisa.component.css']
})
export class PessoaPesquisaComponent implements OnInit {

    paginaClicada = -1;
    totalRegistro = 0;
    filtro = new PessoasFiltro();
    pessoaList = [];
    @ViewChild('tabela') grid: any;

    constructor(
        private pessoaService: PessoasService,
        private messageService: MessageService,
        private confirmation: ConfirmationService,
        private errorHandler: ErrorHandlerService,
        private title: Title
    ) { }

    ngOnInit() {
        this.title.setTitle('Pesquisa de pessoas');
    }

    pesquisar(nPagina = 0) {

        this.filtro.pagina = nPagina;
        const pagina = this.filtro.itensPorPagina * nPagina;

        this.pessoaService.pesquisar(this.filtro)
            .then(dados => {
                // console.log(dados);
                this.totalRegistro = dados.total;
                this.pessoaList = dados.pessoas;
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

    confirmaExclusao(pessoa: any) {
        this.confirmation.confirm({
            message: `Tem certeza que deseja excluir a pessoa<br>'${pessoa.nome}'?`,
            accept: () => {
                this.excluir(pessoa);
            }
        });
    }

    excluir(pessoa: any) {
        this.pessoaService.excluir(pessoa.codigo)
            .then(() => {
                this.pesquisar(this.filtro.pagina);
                this.messageService.add({ severity: 'success', detail: 'Pessoa excluída com suvesso!' });
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    mudarStatus(pessoa: any) {
        const ativo = !pessoa.ativo;

        this.pessoaService.mudarStatus(pessoa.codigo, ativo)
            .then(() => {
                pessoa.ativo = ativo;
                const novoStatus = ativo ? 'ativada' : 'desativada';
                this.messageService.add({ severity: 'success', detail: `Pessoa ${novoStatus} com suvesso!` });
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    getEstilosAtivo(ativo: boolean) {
        return {
            color: 'white',
            textDecoration: 'none',
            backgroundColor: ativo ? '#5cb85c' : '#d9534f',
            padding: '2px 5px',
            textAlign: 'center',
            borderRadius: '3px'
        };
        // Crédito: https://www.algaworks.com/forum/topicos/62890/estilizando-campo-status-html-ts
    }
}
