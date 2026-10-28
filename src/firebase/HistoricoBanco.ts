import { collection, doc, onSnapshot, query, runTransaction, Timestamp, where } from "firebase/firestore";
import { autenticacao } from "./FirebaseConexao";
import { bancoDados } from "./FirestoreConexao";
import type { MovimentoTipo } from "../types/MovimentoTipo";
import type { ProdutoBanco } from "./ProdutosBanco";

export type MovimentoBanco = MovimentoTipo & { id: string };
export type RegistroMovimento = {
    produtoId: string;
    quantidade: number;
    entrasai: "entrada" | "saida";
    preco?: number;
    unitot?: string;
};

const historico = collection(bancoDados, "historico");

export function observarHistorico(usuarioId: string, aoAtualizar: (dados: MovimentoBanco[]) => void, aoFalhar: (erro: Error) => void) {
    return onSnapshot(query(historico, where("usuarioId", "==", usuarioId)), (resultado) => {
        const dados = resultado.docs.map((documento) => {
            const dados = documento.data();
            return {
                id: documento.id,
                produtoId: dados.produtoId,
                nomeProduto: dados.nomeProduto,
                marcaProduto: dados.marcaProduto,
                codigoProduto: dados.codigoProduto,
                quantidade: dados.quantidade,
                data: (dados.data as Timestamp).toDate(),
                entrasai: dados.entrasai,
                precoUnidade: dados.precoUnidade,
                precoTotal: dados.precoTotal,
            };
        });
        aoAtualizar(dados.sort((a, b) => b.data.getTime() - a.data.getTime()));
    }, aoFalhar);
}

// A transação garante que o estoque e o histórico sejam salvos juntos.
export async function guardarMovimento(registro: RegistroMovimento): Promise<void> {
    await autenticacao.authStateReady();
    const usuarioId = autenticacao.currentUser?.uid;
    if (!usuarioId) throw new Error("É necessário estar autenticado para registrar movimentos.");
    if (!registro.produtoId || registro.produtoId.includes("/")) throw new Error("Produto inválido.");
    if (!Number.isFinite(registro.quantidade) || registro.quantidade <= 0) throw new Error("Informe uma quantidade válida.");
    if (registro.entrasai !== "entrada" && registro.entrasai !== "saida") throw new Error("Informe entrada ou saída.");
    if (registro.preco !== undefined && (!Number.isFinite(registro.preco) || registro.preco <= 0)) throw new Error("Informe um preço válido.");
    if (registro.preco !== undefined && registro.unitot !== "uni" && registro.unitot !== "tot") throw new Error("Informe se o preço é unitário ou total.");

    const produtoRef = doc(bancoDados, "produtos", registro.produtoId);
    const movimentoRef = doc(historico);
    await runTransaction(bancoDados, async (transacao) => {
        const documento = await transacao.get(produtoRef);
        if (!documento.exists()) throw new Error("Produto não encontrado.");
        const produto = documento.data() as ProdutoBanco;
        if (produto.usuarioId !== usuarioId) throw new Error("Produto não pertence ao usuário.");
        const estoque = produto.estoque + (registro.entrasai === "entrada" ? registro.quantidade : -registro.quantidade);
        if (estoque < 0) throw new Error("Não é possível retirar uma quantidade maior que o estoque.");
        const status = estoque === 0 ? "Esgotado" : estoque <= produto.qtdMin ? "Baixo" : estoque >= produto.qtdMax ? "Cheio" : "Normal";
        const precoUnidade = registro.preco === undefined
            ? (registro.entrasai === "saida" ? produto.precoVenda : produto.precoCusto)
            : registro.unitot === "tot" ? registro.preco / registro.quantidade : registro.preco;
        transacao.update(produtoRef, { estoque, status });
        transacao.set(movimentoRef, {
            usuarioId,
            produtoId: registro.produtoId,
            nomeProduto: produto.nome,
            marcaProduto: produto.marca,
            codigoProduto: produto.codigo,
            quantidade: registro.quantidade,
            entrasai: registro.entrasai,
            data: Timestamp.now(),
            precoUnidade,
            precoTotal: precoUnidade * registro.quantidade,
        });
    });
}
