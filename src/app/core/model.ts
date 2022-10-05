import { templateJitUrl } from '@angular/compiler';
import { format } from 'date-fns';
import { getWeekYearWithOptions } from 'date-fns/fp';

export class Estado {
    codigo: number;
    nome: string;
}

export class Cidade {
    codigo: number;
    nome: string;
    estado = new Estado();
}

export class Endereco {
    logradouro: string;
    numero: number;
    complemento: string;
    bairro: string;
    cep: string;
    cidade = new Cidade();
}

export class Contato {
    codigo: number;
    nome: string;
    email: string;
    telefone: string;

    constructor(codigo?: number, nome?: string, email?: string, telefone?: string) {
        this.codigo = codigo;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
    }
}

export class Pessoa {
    codigo: number;
    nome: string;
    ativo = true;
    endereco = new Endereco();
    contatos = new Array<Contato>();
}

export class Categoria {
    codigo: number;
}

export class Lancamento {
    codigo: number;
    tipo = 'RECEITA';
    descricao: string;
    dataVencimento: Date;
    dataPagamento: Date;
    valor: number;
    observacao: string;
    pessoa = new Pessoa();
    categoria = new Categoria();
    anexo: string;
    urlAnexo: string;

    // Resolvendo erro: "Can not deserialize value of type java.time.LocalDate"
    // https://www.algaworks.com/forum/topicos/82129/tipo-date
    // https://www.algaworks.com/forum/topicos/72674/can-not-deserialize-value-of-type-java-time-localdate-from-string
    static toJson(lancamento: Lancamento): any {
        return {
            ...lancamento,
            dataVencimento: format(lancamento.dataVencimento, 'yyyy-MM-dd'),
            dataPagamento: lancamento.dataPagamento ? format(lancamento.dataPagamento, 'yyyy-MM-dd') : null
        };
    }
}
