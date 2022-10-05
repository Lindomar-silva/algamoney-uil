import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../seguranca/auth.guard';
import { LancamentoCadastroComponent } from './lancamento-cadastro/lancamento-cadastro.component';
import { LancamentoPesquisaComponent } from './lancamento-pesquisa/lancamento-pesquisa.component';

const route: Routes = [
    {
        path: '',
        component: LancamentoPesquisaComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_PESQUISAR_LANCAMENTO'] }
    },
    {
        path: 'novo',
        component: LancamentoCadastroComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_CADASTRAR_LANCAMENTO'] }
    },
    {
        path: ':codigo',
        component: LancamentoCadastroComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_CADASTRAR_LANCAMENTO'] }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(route) // forChild(route) quando não importar de um módulo raiz
    ],
    exports: [RouterModule]// Ter acesso a diretiva 'routerLink' em lancamento.component
})
export class LancamentosRoutingModule { }
