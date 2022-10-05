import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { NavbarComponent } from './navbar/navbar.component';
import { ErrorHandlerService } from './error-handler.service';
import { LancamentosService } from '../lancamentos/lancamentos.service';
import { PessoasService } from '../pessoas/pessoas.service';
import { CategoriasService } from '../categorias/categorias.service';
import { RouterModule } from '@angular/router';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../seguranca/auth.service';
import { NaoAutorizadoComponent } from './nao-autorizado.component';
import { DashboardService } from '../dashboard/dashboard.service';
import { RelatoriosService } from '../relatorios/relatorios.service';

@NgModule({
    declarations: [
        NavbarComponent,
        NaoAutorizadoComponent,
        PaginaNaoEncontradaComponent
    ],
    imports: [
        CommonModule,
        RouterModule, // Ter acesso a diretiva 'routerLink' em navbar.component

        ToastModule,
        ConfirmDialogModule
    ],
    exports: [
        NavbarComponent,
        ToastModule,
        ConfirmDialogModule
    ],
    providers: [
        LancamentosService,
        PessoasService,
        CategoriasService,
        DashboardService,
        RelatoriosService,
        ErrorHandlerService,
        AuthService,

        MessageService,
        ConfirmationService,
        Title,
        { provide: LOCALE_ID, useValue: 'pt-BR' } // locale pt-BR
    ]
})
export class CoreModule { }
