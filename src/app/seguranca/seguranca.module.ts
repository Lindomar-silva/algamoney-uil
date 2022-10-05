import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

import { SegurancaRoutingModule } from './seguranca-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { MoneyHttpInterceptor } from './money-http-interceptor';
import { AuthGuard } from './auth.guard';
import { environment } from 'src/environments/environment';

export function tokenGetter(): string {
    return localStorage.getItem('token');
}

@NgModule({
    declarations: [
        LoginFormComponent
    ],
    imports: [
        CommonModule,
        FormsModule,

        // https://www.algaworks.com/aulas/1653/adicionando-o-access-token-nas-chamadas-http
        JwtModule.forRoot({
            config: {
                tokenGetter,
                allowedDomains: environment.tokenAllowedDomains,
                disallowedRoutes: environment.tokenDisallowedRoutes
            }
        }),

        InputTextModule,
        ButtonModule,

        SegurancaRoutingModule
    ],
    providers: [
        JwtHelperService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MoneyHttpInterceptor,
            multi: true
        },
        AuthGuard
    ]
})
export class SegurancaModule { }
