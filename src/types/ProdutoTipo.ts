import { type StatusTipo } from "./StatusTipo";

export type ProdutoTipo = {
    nome: string;
    codigo: number;
    descricao: string;
    categoria: string;
    marca: string;
    precoCusto: number;
    precoVenda: number;
    fornecedor: string;
    estoque: number;
    qtdMin: number;
    qtdMax: number;
    status: StatusTipo
}