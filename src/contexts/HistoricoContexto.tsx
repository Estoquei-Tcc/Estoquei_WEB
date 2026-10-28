import { createContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { autenticacao } from "../firebase/FirebaseConexao";
import { observarHistorico, type MovimentoBanco } from "../firebase/HistoricoBanco";

type HistoricoContextoTipo = {
    movimentacoes: MovimentoBanco[];
    carregando: boolean;
    erro: string | null;
};

export const HistoricoContexto = createContext<HistoricoContextoTipo | undefined>(undefined);

export const HistoricoProvider = ({ children }: { children: ReactNode }) => {
    const [movimentacoes, setMovimentacoes] = useState<MovimentoBanco[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        let pararHistorico: (() => void) | undefined;
        let versao = 0;
        const pararAutenticacao = onAuthStateChanged(autenticacao, (usuario) => {
            pararHistorico?.();
            const versaoAtual = ++versao;
            setMovimentacoes([]);
            setErro(null);
            setCarregando(Boolean(usuario));
            if (!usuario) return;

            pararHistorico = observarHistorico(usuario.uid, (dados) => {
                if (versaoAtual !== versao) return;
                setMovimentacoes(dados);
                setCarregando(false);
            }, (error) => {
                if (versaoAtual !== versao) return;
                setMovimentacoes([]);
                setErro(error.message);
                setCarregando(false);
            });
        });
        return () => {
            ++versao;
            pararAutenticacao();
            pararHistorico?.();
        };
    }, []);

    return (
        <HistoricoContexto.Provider value={{ movimentacoes, carregando, erro }}>
            {children}
        </HistoricoContexto.Provider>
    );
};
