import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Contato } from 'src/app/core/model';

@Component({
    selector: 'app-pessoa-cadastro-contato',
    templateUrl: './pessoa-cadastro-contato.component.html',
    styleUrls: ['./pessoa-cadastro-contato.component.css']
})
export class PessoaCadastroContatoComponent implements OnInit {

    contato: Contato;
    contatoIndex: number;
    exibindoFormContato = false;
    @Input() contatosList: Array<Contato>;

    constructor() { }

    ngOnInit(): void {
    }

    novoContato() {
        this.exibindoFormContato = true;
        this.contato = new Contato();
        this.contatoIndex = this.contatosList.length;
    }

    editarContato(c: Contato, index: number) {
        this.contato = this.clonarContato(c);
        this.exibindoFormContato = true;
        this.contatoIndex = index;
    }

    removerContato(index: number) {
        this.contatosList.splice(index, 1);
    }

    confirmarContato(frm: FormControl) {
        this.contatosList[this.contatoIndex] = this.clonarContato(this.contato);
        this.exibindoFormContato = false;

        frm.reset();
    }

    clonarContato(c: Contato): Contato {
        return new Contato(c.codigo, c.nome, c.email, c.telefone);
    }

    get editando() {
        return this.contato && this.contato.codigo;
    }
}
