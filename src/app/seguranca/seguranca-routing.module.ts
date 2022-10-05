import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';

const route: Routes = [
    { path: 'login', component: LoginFormComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(route)
    ],
    exports: [
        // Exportando (RouterModule) para ter acesso a diretiva do modulo de reteamento do app.component.html
        // Onde app.module.ts importa AppRoutingModule
        RouterModule
    ]
})
export class SegurancaRoutingModule { }
