import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, runTransaction, where} from 'firebase/firestore';
import type { ProdutoTipo } from '../types/ProdutoTipo';
import { autenticacao } from './FirebaseConexao';
import { bancoDados } from './FirestoreConexao';

type ProdutoDocumento = ProdutoTipo & {
    usuarioId: string;
};

export type NovoProduto = Omit<ProdutoTipo, "codigo">;

export type ProdutoBanco = ProdutoDocumento & {
    id: string;
};

const produtos = collection(bancoDados, 'produtos');

async function obterUsuarioId(): Promise<string> {
    await autenticacao.authStateReady();
    const usuarioId = autenticacao.currentUser?.uid;

    if (!usuarioId) {
        throw new Error('É necessário estar autenticado para acessar os produtos.');
    }

    return usuarioId;
}

function referenciaProduto(id: string) {
    if (!id || id.includes('/')) {
        throw new Error('Informe um ID de documento de produto válido.');
    }

    return doc(produtos, id);
}

function prepararProduto(produto: ProdutoTipo, usuarioId: string): ProdutoDocumento {
    const status = produto.estoque === 0 ? 'Esgotado'
        : produto.estoque <= produto.qtdMin ? 'Baixo'
        : produto.estoque >= produto.qtdMax ? 'Cheio'
        : 'Normal';

    // Persiste somente os campos aceitos pelas regras, sem o ID do documento.
    return {
        nome: produto.nome,
        codigo: produto.codigo,
        descricao: produto.descricao,
        categoria: produto.categoria,
        marca: produto.marca,
        precoCusto: produto.precoCusto,
        precoVenda: produto.precoVenda,
        fornecedor: produto.fornecedor,
        estoque: produto.estoque,
        qtdMin: produto.qtdMin,
        qtdMax: produto.qtdMax,
        status,
        usuarioId,
    };
}

export async function listarProdutos(): Promise<ProdutoBanco[]> {
    const usuarioId = await obterUsuarioId();
    const consulta = query(produtos, where('usuarioId', '==', usuarioId));
    const resultado = await getDocs(consulta);

    return resultado.docs.map((documento) => ({
        ...documento.data() as ProdutoDocumento,
        id: documento.id,
    }));
}

export async function cadastrarProduto(produto: NovoProduto): Promise<string> {
    const usuarioId = await obterUsuarioId();
    const contadorRef = doc(bancoDados, "contadoresProdutos", usuarioId);
    const contadorAtual = await getDoc(contadorRef);
    // Inicializa a sequência sem alterar os códigos dos produtos já existentes.
    let maiorCodigoExistente = 0;
    if (!contadorAtual.exists()) {
        const existentes = await listarProdutos();
        maiorCodigoExistente = existentes.reduce((maior, item) => Math.max(maior, item.codigo), 0);
    }
    const referencia = doc(produtos);
    await runTransaction(bancoDados, async (transacao) => {
        const contador = await transacao.get(contadorRef);
        const ultimoCodigo = contador.exists() ? contador.data().ultimoCodigo : maiorCodigoExistente;
        if (!Number.isSafeInteger(ultimoCodigo) || ultimoCodigo < 0 || ultimoCodigo >= Number.MAX_SAFE_INTEGER) {
            throw new Error("Não foi possível gerar o código do produto.");
        }
        const codigo = ultimoCodigo + 1;
        transacao.set(contadorRef, { ultimoCodigo: codigo });
        transacao.set(referencia, prepararProduto({ ...produto, codigo }, usuarioId));
    });
    return referencia.id;
}

export async function editarProduto(id: string, produto: ProdutoTipo): Promise<void> {
    const usuarioId = await obterUsuarioId();
    const referencia = referenciaProduto(id);
    await runTransaction(bancoDados, async (transacao) => {
        const documento = await transacao.get(referencia);
        if (!documento.exists()) throw new Error("Produto não encontrado.");
        const atual = documento.data() as ProdutoDocumento;
        if (atual.usuarioId !== usuarioId) throw new Error("Produto não pertence ao usuário.");
        // Preserva o estoque mais recente e o código usado pelos registros antigos.
        const dados = prepararProduto({ ...produto, codigo: atual.codigo, estoque: atual.estoque }, usuarioId);
        transacao.update(referencia, dados);
    });
}

export async function excluirProduto(id: string): Promise<void> {
    await obterUsuarioId();
    await deleteDoc(referenciaProduto(id));
}

// Mantém os dados do contexto sincronizados com o banco.
export function observarProdutos(
    usuarioId: string,
    aoAtualizar: (produtos: ProdutoBanco[]) => void,
    aoFalhar: (erro: Error) => void,
): () => void {
    const consulta = query(produtos, where('usuarioId', '==', usuarioId));
    return onSnapshot(consulta, (resultado) => {
        aoAtualizar(resultado.docs.map((documento) => ({
            ...documento.data() as ProdutoDocumento,
            id: documento.id,
        })));
    }, aoFalhar);
}
