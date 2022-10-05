import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Cidade, Estado, Pessoa } from '../core/model';

// Criando um contrato para argumanto de paramentro
export class PessoasFiltro {
    nome: string;
    pagina = 0;
    itensPorPagina = 5;
}

@Injectable()
export class PessoasService {

    pessoasUrl: string;
    cidadesUrl: string;
    estadosUrl: string;

    constructor(private http: HttpClient) {
        this.pessoasUrl = `${environment.apiUrl}/pessoas`;
        this.cidadesUrl = `${environment.apiUrl}/cidades`;
        this.estadosUrl = `${environment.apiUrl}/estados`;
    }

    pesquisar(filtro: PessoasFiltro): Promise<any> {

        // Toda vez que chama o método desta classe, altera o seu estado, então, precisa fazer uma nova atribuição
        let httpParams = new HttpParams()
            .set('page', filtro.pagina.toString())
            .set('size', filtro.itensPorPagina.toString());

        if (filtro.nome) {
            httpParams = httpParams.set('nome', filtro.nome);
        }

        return this.http.get(this.pessoasUrl, { params: httpParams })
            .toPromise().then(response => {
                const dados = response[`content`];

                const result = {
                    pessoas: dados,
                    total: response[`totalElements`]
                };

                return result;
            });
    }

    listarTodas(): Promise<any> {
        return this.http.get(this.pessoasUrl)
            .toPromise().then(response => response[`content`]);
    }

    excluir(codigo: number): Promise<void> {
        return this.http.delete(`${this.pessoasUrl}/${codigo}`)
            .toPromise().then(() => null);
    }

    mudarStatus(codigo: number, ativo: boolean): Promise<void> {
        return this.http.put(`${this.pessoasUrl}/${codigo}/ativo`, ativo)
            .toPromise().then(() => null);
    }

    adicionar(pessoa: Pessoa): Promise<Pessoa> {
        return this.http.post<Pessoa>(this.pessoasUrl, pessoa)
            .toPromise();
    }

    atualizar(pessoa: Pessoa): Promise<Pessoa> {
        return this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.codigo}`, pessoa)
            .toPromise()
            .then(response => {
                return response;
            });
    }

    buscarPorCodigo(codigo: number): Promise<Pessoa> {
        return this.http.get<Pessoa>(`${this.pessoasUrl}/${codigo}`)
            .toPromise()
            .then(response => {
                return response;
            });
    }

    listarEstados(): Promise<Estado[]> {
        return this.http.get<Estado[]>(this.estadosUrl).toPromise();
    }

    pesquisarCidades(estadoCd): Promise<Cidade[]> {
        const httpParams = new HttpParams().set('estadoCd', estadoCd);
        return this.http.get<Cidade[]>(this.cidadesUrl, { params: httpParams }).toPromise();
    }
}
