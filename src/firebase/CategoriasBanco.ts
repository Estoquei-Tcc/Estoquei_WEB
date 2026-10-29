import { collection, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { autenticacao } from "./FirebaseConexao";
import { bancoDados } from "./FirestoreConexao";

const categorias = collection(bancoDados, "categorias");

export function observarCategorias(usuarioId: string, aoAtualizar: (categorias: string[]) => void, aoFalhar: (erro: Error) => void) {
    return onSnapshot(query(categorias, where("usuarioId", "==", usuarioId)), (resultado) => {
        aoAtualizar(resultado.docs.map((documento) => documento.data().nome as string));
    }, aoFalhar);
}

export async function cadastrarCategoria(categoria: string): Promise<string> {
    const nome = categoria.trim();
    if (!nome) throw new Error("Informe o nome da categoria.");
    await autenticacao.authStateReady();
    const usuarioId = autenticacao.currentUser?.uid;
    if (!usuarioId) throw new Error("É necessário estar autenticado para cadastrar categorias.");
    // O mesmo nome não cria documentos duplicados para o usuário.
    const id = encodeURIComponent(usuarioId + ":" + nome.toLocaleLowerCase("pt-BR"));
    await setDoc(doc(categorias, id), { nome, usuarioId });
    return nome;
}
