import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { NotAuthenticatedError } from '../seguranca/money-http-interceptor';

@Injectable()
export class ErrorHandlerService {

    constructor(
        private messageService: MessageService,
        private router: Router
    ) { }

    handle(errorResponse: any) {
        let msg: string;
        const errorStatus = errorResponse.status;

        if (typeof errorResponse === 'string') {
            msg = errorResponse;

        } else if (errorResponse instanceof NotAuthenticatedError) {
            msg = 'Sua sessão expirou!';
            this.router.navigate(['/login']);

        } else if (errorResponse instanceof HttpErrorResponse && errorStatus >= 400 && errorStatus <= 499) {
            msg = 'Ocorreu um erro ao processar a sua solicitação';

            if (errorStatus === 403) {
                msg = 'Você não tem permissão para executar essa ação!';
            }

            try {
                msg = errorResponse.error[0].msgUser;
            } catch (e) { }

            console.log('Ocorreu um erro', errorResponse);

        } else {
            msg = 'Erro ao processar serviço remoto. Tente novamente!';
            console.log('Ocorreu um erro', errorResponse);
        }

        this.messageService.add({ severity: 'error', detail: msg, life: 3000 });
    }
}
