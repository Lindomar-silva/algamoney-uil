import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { CategoriasService } from 'src/app/categorias/categorias.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { PessoasService } from 'src/app/pessoas/pessoas.service';
import { LancamentosService } from '../lancamentos.service';

@Component({
    selector: 'app-lancamento-cadastro',
    templateUrl: './lancamento-cadastro.component.html',
    styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {
    tiposList = [
        { label: 'Receita', value: 'RECEITA' },
        { label: 'Despesa', value: 'DESPESA' }
    ];

    categoriasList = [];
    pessoasList = [];
    // lancamento = new Lancamento(); // Deixando de usar o 'Model Lancamento' para usuar forms reativos
    formulario: FormGroup;
    uploadProgress = false;

    constructor(
        private categoriasService: CategoriasService,
        private pessoasService: PessoasService,
        private lancamentosService: LancamentosService,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private route: ActivatedRoute, // Pegar a rota que foi carregada
        private router: Router,
        private title: Title,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.configurarFormulario();
        const codigoLancamento = this.route.snapshot.params[`codigo`];

        if (!codigoLancamento) {
            this.title.setTitle('Novo lançamento');
        } else {
            this.carregarLancamento(codigoLancamento);
        }

        this.carregarCategorias();
        this.carregarPessoas();
    }

    inicioUpload() {
        this.uploadProgress = true;
    }

    fimUploadAnexo(event) {
        const anexo = event.originalEvent.body;
        this.formulario.patchValue({
            anexo: anexo.nome,
            urlAnexo: anexo.url
        });

        this.uploadProgress = false;
    }

    erroUpload(event) {
        this.messageService.add({ severity: 'error', detail: 'Erro ao tentar enviar anexo!' });
        this.uploadProgress = false;
    }

    removerAnexo() {
        this.formulario.patchValue({
            anexo: null,
            urlAnexo: null
        });
    }

    get nomeAnexo() {
        const nome = this.formulario.get('anexo').value;

        if (nome) {
            return nome.substring(nome.indexOf('_') + 1, nome.length);
        }

        return '';
    }

    get urlUploadAnexo() {
        return this.lancamentosService.urlUploadAnexo();
    }


    configurarFormulario() {
        this.formulario = this.formBuilder.group({
            codigo: [],
            tipo: ['RECEITA', Validators.required],
            dataVencimento: [null, Validators.required],
            dataPagamento: [],
            descricao: [null, [this.validarObrigatoriedade, this.validarTamanhoMinimo(5)]],
            valor: [null, Validators.required],
            pessoa: this.formBuilder.group({
                codigo: [null, Validators.required],
                nome: []
            }),
            categoria: this.formBuilder.group({
                codigo: [null, Validators.required],
                nome: []
            }),
            observacao: [],
            anexo: [],
            urlAnexo: []
        });
    }

    validarObrigatoriedade(input: FormControl) {
        return (input.value ? null : { obrigatoriedade: true });
    }

    validarTamanhoMinimo(valor: number) {
        return (input: FormControl) => {
            return (!input.value || input.value.length >= valor) ? null : { tamanhoMinimo: { tamanho: valor } };
        };
    }

    get editando() {
        return Boolean(this.formulario.get('codigo').value);
    }

    carregarLancamento(codigo: number) {
        this.lancamentosService.buscarPorCodigo(codigo)
            .then(dados => {
                // this.lancamento = dados;
                // tslint:disable-next-line: max-line-length
                // this.formulario.setValue(dados); // Apresenta erro porque o formulario não possui todas propriedades de retorno (use patchValue(dados))
                this.formulario.patchValue(dados);
                this.atualizarTitulo();
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    // salvar(form: FormControl) {
    salvar() {
        // console.log(this.lancamento);
        if (!this.editando) {
            this.adicionarLancamento();
        } else {
            this.atualizarLancamento();
        }
    }

    adicionarLancamento() {
        this.lancamentosService.adicionar(this.formulario.value)
            .then(dadosAdicionado => {
                this.messageService.add({ severity: 'success', detail: 'Lançamento adicionado com sucesso!' });
                // form.reset();
                // this.lancamento = new Lancamento();
                this.router.navigate(['/lancamentos', dadosAdicionado.codigo]);
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    atualizarLancamento() {
        this.lancamentosService.atualizar(this.formulario.value)
            .then(dados => {
                // this.lancamento = dados;
                // tslint:disable-next-line: max-line-length
                // this.formulario.setValue(dados); // Apresenta erro porque o formulario não possui todas propriedades de retorno (use patchValue(dados))
                this.formulario.patchValue(dados);
                this.messageService.add({ severity: 'success', detail: 'Lançamento alterado com sucesso!' });
                this.atualizarTitulo();
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    carregarCategorias() {
        return this.categoriasService.listarTodas()
            .then(dados => {
                this.categoriasList = dados.map(c => {
                    return { label: c.nome, value: c.codigo };
                });
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    // Filtrar pessoas ativas:
    // https://www.algaworks.com/forum/topicos/81194/erro-de-dados-no-dropdrow
    // https://www.algaworks.com/forum/topicos/66364/erro-ao-cadastrar-lancamento-com-pessoa-inactiva
    carregarPessoas() {
        return this.pessoasService.listarTodas()
            .then(dados => {
                // Filtrando somente pessoa ativa
                // this.pessoasList = dados.filter(p => p.ativo).map(p => ({ label: p.nome, value: p.codigo }));

                // Sem filtro
                this.pessoasList = dados.map(p => ({ label: p.nome, value: p.codigo }));
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    novo() {
        // Opção 01
        // form.reset();

        // setTimeout(() => { // Solução para não resetar 'RECEITA'
        //     this.lancamento = new Lancamento();
        // }, 1);

        // Opção 02
        // form.reset(new Lancamento());
        this.formulario.reset();
        this.router.navigate(['/lancamentos/novo']);
    }

    atualizarTitulo() {
        this.title.setTitle(`Alterando lançamento: ${this.formulario.get('descricao').value}`);
    }
}
