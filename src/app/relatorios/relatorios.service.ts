import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { environment } from 'src/environments/environment';

@Injectable()
export class RelatoriosService {

    lancamentoUrl: string;

    constructor(private httpClient: HttpClient) {
        this.lancamentoUrl = `${environment.apiUrl}/lancamentos`;
    }

    // Retornando 'blob' para geraçãode PDF
    relatorioLancamentosPorPessoa(inicio: Date, fim: Date) {
        const httpParams = new HttpParams()
            .set('inicio', format(inicio, 'yyyy-MM-dd'))
            .set('fim', format(fim, 'yyyy-MM-dd'));

        return this.httpClient.get(`${this.lancamentoUrl}/relatorios/por-pessoa`,
            { params: httpParams, responseType: 'blob' })
            .toPromise();
    }

    // Retornando JSON com dados + string/bytes pdf
    relatorioLancamentosPorPessoaDto(inicio: Date, fim: Date) {
        const httpParams = new HttpParams()
            .set('inicio', format(inicio, 'yyyy-MM-dd'))
            .set('fim', format(fim, 'yyyy-MM-dd'));

        return this.httpClient.get(`${this.lancamentoUrl}/relatorios/por-pessoa-dto`,
            { params: httpParams })
            .toPromise();
    }
}
