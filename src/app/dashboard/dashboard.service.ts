import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { parse } from 'date-fns';

@Injectable()
export class DashboardService {

    lancamentosUrl: string;
    constructor(private http: HttpClient) {
        this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
    }

    lancamentosPorCategoria(): Promise<Array<any>> {
        return this.http.get<any>(`${this.lancamentosUrl}/estatisticas/por-categoria`)
            .toPromise();
    }

    lancamentosPorDia(): Promise<Array<any>> {
        return this.http.get<any>(`${this.lancamentosUrl}/estatisticas/por-dia`)
            .toPromise()
            .then(response => {
                this.converterStringParaDatas(response);
                return response;
            });
    }

    converterStringParaDatas(dados: Array<any>) {
        // for (const dado of dados) {

        // }
        dados.forEach(d => {
            d.dia = parse(d.dia.toString(), 'yyyy-MM-dd', new Date());
        });
    }
}
