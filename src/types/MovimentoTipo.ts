export type MovimentoTipo = {
    produtoId?: string;
    nomeProduto?: string;
    marcaProduto?: string;
    codigoProduto: number;
    quantidade: number;
    data: Date;
    entrasai: string;
    precoUnidade: number;
    precoTotal: number;
};
