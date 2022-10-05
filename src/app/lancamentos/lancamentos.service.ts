import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { format, parse } from 'date-fns';
import { environment } from 'src/environments/environment';
import { Lancamento } from '../core/model';

// Criando um contrato para argumanto de paramentro
export class LancamentoFiltro {
    descricao: string;
    dataVencimentoInicio: Date;
    dataVencimentoFim: Date;
    pagina = 0;
    itensPorPagina = 5;
}

@Injectable()
export class LancamentosService {

    lancamentosUrl: string;

    constructor(private http: HttpClient) {
        this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
    }

    urlUploadAnexo(): string {
        return `${this.lancamentosUrl}/anexo`;
    }

    adicionar(lanc: Lancamento): Promise<Lancamento> {
        return this.http.post<Lancamento>(this.lancamentosUrl, Lancamento.toJson(lanc))
            .toPromise();
    }

    atualizar(lanc: Lancamento): Promise<Lancamento> {
        return this.http.put<Lancamento>(`${this.lancamentosUrl}/${lanc.codigo}`, Lancamento.toJson(lanc))
            .toPromise()
            .then(response => {
                const dadosAlterado = response;
                this.converterStringParaDatas([dadosAlterado]);
                return dadosAlterado;
            });
    }

    pesquisar(filtro: LancamentoFiltro): Promise<any> {

        // Toda vez que chama o método desta classe, altera o seu estado, então, precisa fazer uma nova atribuição
        let httpParams = new HttpParams();

        httpParams = httpParams.set('page', filtro.pagina.toString());
        httpParams = httpParams.set('size', filtro.itensPorPagina.toString());

        if (filtro.descricao) {
            httpParams = httpParams.set('descricao', filtro.descricao);
        }
        if (filtro.dataVencimentoInicio) {
            httpParams = httpParams.set('dataVencimentoDe',
                format(filtro.dataVencimentoInicio, 'yyyy-MM-dd'));
        }
        if (filtro.dataVencimentoFim) {
            httpParams = httpParams.set('dataVencimentoAte',
                format(filtro.dataVencimentoFim, 'yyyy-MM-dd'));
        }

        return this.http.get(`${this.lancamentosUrl}?resumo`, { params: httpParams })
            .toPromise()
            .then(response => {
                const dados = response[`content`];

                const result = {
                    lancamentos: dados,
                    total: response[`totalElements`]
                };

                return result;
            });
    }

    excluir(codigo: number): Promise<void> {
        return this.http.delete(`${this.lancamentosUrl}/${codigo}`)
            .toPromise().then(() => null);
    }

    buscarPorCodigo(codigo: number): Promise<Lancamento> {
        return this.http.get<Lancamento>(`${this.lancamentosUrl}/${codigo}`)
            .toPromise()
            .then(response => {
                const dados = response;
                this.converterStringParaDatas([dados]);
                return dados;
            });
    }

    converterStringParaDatas(lancamentoList: Lancamento[]) {
        lancamentoList.forEach(l => {
            l.dataVencimento = parse(l.dataVencimento.toString(), 'yyyy-MM-dd', new Date());
            l.dataPagamento = l.dataPagamento ? parse(l.dataPagamento.toString(), 'yyyy-MM-dd', new Date()) : null;
        });
    }


    // sem Array
    // converterStringParaDatas(lanc: Lancamento) {
    //     lanc.dataVencimento = parse(lanc.dataVencimento.toString(), 'yyyy-MM-dd', new Date());
    //     lanc.dataPagamento = lanc.dataPagamento ? parse(lanc.dataPagamento.toString(), 'yyyy-MM-dd', new Date()) : null;
    // }
}
