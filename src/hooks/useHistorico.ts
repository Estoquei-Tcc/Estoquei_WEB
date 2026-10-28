import { useContext } from "react";
import { HistoricoContexto } from "../contexts/HistoricoContexto";
import { guardarMovimento as guardarNoBanco, type RegistroMovimento } from "../firebase/HistoricoBanco";

export function useHistorico() {
    const contexto = useContext(HistoricoContexto);
    if (!contexto) {
        throw new Error("useHistorico deve ser utilizado dentro de HistoricoProvider");
    }
    const guardarMovimento = async (registro: RegistroMovimento): Promise<void> => {
        await guardarNoBanco(registro);
    };
    return { ...contexto, guardarMovimento };
}
