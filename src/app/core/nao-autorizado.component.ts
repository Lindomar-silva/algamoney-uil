import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-nao-autorizado',
    template: `
        <div class="container">
            <h1 class="text-center">{{ acessoNegado }}</h1>
            <div>
                <button pButton type="button" (click)="voltarPagina()">Voltar</button>
            </div>
        </div>
  `,
    styles: [`
        .button {
            color: white;
        }
    `]
})
export class NaoAutorizadoComponent implements OnInit {

    acessoNegado = 'Acesso Negado!';

    constructor(
        private location: Location,
        private title: Title
    ) { }

    ngOnInit() {
        this.title.setTitle(this.acessoNegado);
    }

    voltarPagina() {
        this.location.back();
    }

}
