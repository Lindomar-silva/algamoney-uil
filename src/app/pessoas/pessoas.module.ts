import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';

import { SharedModule } from '../shared/shared.module';
import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';
import { PessoaPesquisaComponent } from './pessoa-pesquisa/pessoa-pesquisa.component';
import { PessoasRountingModule } from './pessoas-routing.module';
import { PessoaCadastroContatoComponent } from './pessoa-cadastro-contato/pessoa-cadastro-contato.component';

@NgModule({
    declarations: [
        PessoaCadastroComponent,
        PessoaPesquisaComponent,
        PessoaCadastroContatoComponent
    ],
    imports: [
        CommonModule,
        FormsModule,

        InputTextModule,
        ButtonModule,
        TableModule,
        TooltipModule,
        InputMaskModule,
        PanelModule,
        DialogModule,
        DropdownModule,

        SharedModule,
        PessoasRountingModule
    ],
    exports: []
})
export class PessoasModule { }
