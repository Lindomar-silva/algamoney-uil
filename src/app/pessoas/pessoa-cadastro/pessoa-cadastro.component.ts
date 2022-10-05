import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { Pessoa } from 'src/app/core/model';
import { PessoasService } from '../pessoas.service';

@Component({
    selector: 'app-pessoa-cadastro',
    templateUrl: './pessoa-cadastro.component.html',
    styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

    pessoa = new Pessoa();
    estadosList: any[];
    cidadesList: any[];
    estadoSelecionado: number;

    constructor(
        private pessoasService: PessoasService,
        private messageService: MessageService,
        private errorHandlerService: ErrorHandlerService,
        private route: ActivatedRoute,
        private router: Router,
        private title: Title
    ) { }

    ngOnInit() {
        const pessoaCd = this.route.snapshot.params[`codigo`];

        if (!pessoaCd) {
            this.title.setTitle('Nova pessoa');
        } else {
            this.carregarPessoa(pessoaCd);
        }

        this.carregarEstados();
    }

    carregarEstados() {
        this.pessoasService.listarEstados()
            .then(estados => {
                this.estadosList = estados.map(uf => ({
                    label: uf.nome,
                    value: uf.codigo
                }));
            })
            .catch(erro => this.errorHandlerService.handle(erro));
    }

    carregarCidades() {
        this.pessoasService.pesquisarCidades(this.estadoSelecionado)
            .then(cidades => {
                this.cidadesList = cidades.map(c => ({
                    label: c.nome,
                    value: c.codigo
                }));
                if (this.estadoSelecionado !== this.pessoa.endereco.cidade.estado.codigo)
                    this.pessoa.endereco.cidade.codigo = null;
            })
            .catch(erro => this.errorHandlerService.handle(erro));
    }

    get editando() {
        return Boolean(this.pessoa.codigo);
    }

    salvar(form: FormControl) {
        if (!this.editando) {
            this.adicionarPessoa();
        } else {
            this.atualizarPessoa();
        }
    }

    adicionarPessoa() {
        this.pessoasService.adicionar(this.pessoa)
            .then(pessoaAdicionada => {
                this.messageService.add({ severity: 'success', detail: 'Pessoa salva com sucesso!' });
                this.router.navigate(['pessoas/', pessoaAdicionada.codigo]); // Adiciona e entra em modo de alteração
            })
            .catch(erro => this.errorHandlerService.handle(erro));
    }

    atualizarPessoa() {
        this.pessoasService.atualizar(this.pessoa)
            .then(pessoaAlterada => {
                this.pessoa = pessoaAlterada;
                this.messageService.add({ severity: 'success', detail: 'Pessoa alterada com sucesso!' });
                this.atualizaTitle();
            })
            .catch(erro => this.errorHandlerService.handle(erro));
    }

    carregarPessoa(codigo: number) {
        this.pessoasService.buscarPorCodigo(codigo)
            .then(dados => {
                this.pessoa = dados;

                this.estadoSelecionado = (this.pessoa.endereco.cidade) ?
                    this.pessoa.endereco.cidade.estado.codigo : null;

                if (this.estadoSelecionado)
                    this.carregarCidades();

                this.atualizaTitle();
            })
            .catch(erro => this.errorHandlerService.handle(erro));
    }

    novo(form: FormControl) {
        form.reset(new Pessoa());
        this.router.navigate(['/pessoas/novo']);
    }

    atualizaTitle() {
        this.title.setTitle(`Alterando pessoa: ${this.pessoa.nome}`);
    }
}
