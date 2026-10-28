import { cadastrarCategoria } from "../firebase/CategoriasBanco";
import { useContext } from "react";
import { ProdutoContexto } from "../contexts/ProdutosContexto";
import {
    cadastrarProduto,
    editarProduto as editarNoBanco,
    excluirProduto as excluirNoBanco,
    type ProdutoBanco,
    type NovoProduto,
} from "../firebase/ProdutosBanco";

export function useProdutos() {
    const contexto = useContext(ProdutoContexto);

    if (!contexto) {
        throw new Error("useProdutos deve ser utilizado dentro de ProdutoProvider");
    }

    const { produtos, carregando, erro, categorias } = contexto;

    const adicionarProduto = async (produto: NovoProduto): Promise<void> => {
        await cadastrarProduto(produto);
    };

    const editarProduto = async (produto: ProdutoBanco): Promise<void> => {
        await editarNoBanco(produto.id, produto);
    };

    const excluirProduto = async (id: string): Promise<void> => {
        await excluirNoBanco(id);
    };

    const adicionarCategoria = async (categoria: string): Promise<string> => {
        const existente = categorias.find((nome) => nome.toLocaleLowerCase("pt-BR") === categoria.trim().toLocaleLowerCase("pt-BR"));
        return cadastrarCategoria(existente ?? categoria);
    };

    return { produtos, carregando, erro, categorias, adicionarProduto, editarProduto, excluirProduto, adicionarCategoria };
}
