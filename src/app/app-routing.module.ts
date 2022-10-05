// Módulo de roteamento do app.module

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NaoAutorizadoComponent } from './core/nao-autorizado.component';

import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada.component';

const route: Routes = [
    // Carregamento tardio de módulos (Lazy loading) -> REMOVER DO 'APP.MODULES' OS COMPONENTES (LancamentosModule, PessoasModule,)
    { path: 'lancamentos', loadChildren: () => import('src/app/lancamentos/lancamentos.module').then(m => m.LancamentosModule) },
    { path: 'pessoas', loadChildren: () => import('src/app/pessoas/pessoas.module').then(p => p.PessoasModule) },
    { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(d => d.DashboardModule) },
    { path: 'relatorios', loadChildren: () => import('./relatorios/relatorios.module').then(r => r.RelatoriosModule) },

    // redirectTo: http://localhost:4200/ para http://localhost:4200/login
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'nao-autorizado', component: NaoAutorizadoComponent },
    { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent },
    { path: '**', redirectTo: 'pagina-nao-encontrada' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(route) // .forRoot() recebe as configurações de rota (Inserir '<router-outlet>' no app.component)
    ],
    exports: [
        // Exportando (RouterModule) para ter acesso a diretiva do modulo de reteamento do app.component.html
        // Onde app.module.ts importa AppRoutingModule
        RouterModule
    ]
})
export class AppRoutingModule { }
