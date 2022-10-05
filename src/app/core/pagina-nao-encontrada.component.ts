import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-pagina-nao-encontrada',
    template: `
    <div class="container">
        <h1 class="txt-center">{{ paginaNaoEncontrada }}</h1>
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
export class PaginaNaoEncontradaComponent implements OnInit {

    paginaNaoEncontrada = 'Página não encontrada!';

    constructor(
        private location: Location,
        private title: Title
    ) { }

    ngOnInit() {
        this.title.setTitle(this.paginaNaoEncontrada);
    }

    voltarPagina() {
        this.location.back();
    }
}
