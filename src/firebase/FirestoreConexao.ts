import { getFirestore } from 'firebase/firestore';
import { autenticacao } from './FirebaseConexao';

// Usa o banco (default) do mesmo projeto Firebase configurado para o login.
export const bancoDados = getFirestore(autenticacao.app);
