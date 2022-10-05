import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

// Tratando erro de refreshToken expirado
export class NotAuthenticatedError { }

// https://www.algaworks.com/aulas/1657/interceptando-chamadas-http-para-tratar-a-expiracao-do-access-token?pagina=0
// https://medium.com/@monkov/angular-using-httpinterceptor-for-token-refreshing-3f04ea2ccb81
@Injectable()
export class MoneyHttpInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.url.includes('/oauth/token') && this.authService.isAccessTokenInvalido()) {
            return from(this.authService.obterNovoAccessToken())
                .pipe(
                    mergeMap(() => {
                        if (this.authService.isAccessTokenInvalido()) {
                            throw new NotAuthenticatedError(); // Tratando erro de refreshToken expirado
                        }

                        req = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        });
                        return next.handle(req);
                    })
                );
        }
        return next.handle(req);
    }
}
