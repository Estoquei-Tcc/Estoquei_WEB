import { createContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { autenticacao } from "../firebase/FirebaseConexao";
import { observarProdutos, type ProdutoBanco } from "../firebase/ProdutosBanco";
import { observarCategorias } from "../firebase/CategoriasBanco";

type ProdutoContextoTipo = {
    produtos: ProdutoBanco[];
    carregando: boolean;
    erro: string | null;
    categorias: string[];
};

export const ProdutoContexto = createContext<ProdutoContextoTipo | undefined>(undefined);

export const ProdutoProvider = ({ children }: { children: ReactNode }) => {
    const [produtos, setProdutos] = useState<ProdutoBanco[]>([]);
    const [carregandoProdutos, setCarregandoProdutos] = useState(true);
    const [carregandoCategorias, setCarregandoCategorias] = useState(true);
    const [erroProdutos, setErroProdutos] = useState<string | null>(null);
    const [erroCategorias, setErroCategorias] = useState<string | null>(null);
    const [categoriasSalvas, setCategoriasSalvas] = useState<string[]>([]);

    useEffect(() => {
        let pararProdutos: (() => void) | undefined;
        let pararCategorias: (() => void) | undefined;
        let versao = 0;
        const pararAutenticacao = onAuthStateChanged(autenticacao, (usuario) => {
            pararProdutos?.();
            pararCategorias?.();
            const atual = ++versao;
            setProdutos([]);
            setCategoriasSalvas([]);
            setErroProdutos(null);
            setErroCategorias(null);
            setCarregandoProdutos(Boolean(usuario));
            setCarregandoCategorias(Boolean(usuario));
            if (!usuario) return;

            pararProdutos = observarProdutos(usuario.uid, (dados) => {
                if (atual !== versao) return;
                setProdutos(dados);
                setCarregandoProdutos(false);
            }, (error) => {
                if (atual !== versao) return;
                setProdutos([]);
                setErroProdutos(error.message);
                setCarregandoProdutos(false);
            });
            pararCategorias = observarCategorias(usuario.uid, (dados) => {
                if (atual !== versao) return;
                setCategoriasSalvas(dados);
                setCarregandoCategorias(false);
            }, (error) => {
                if (atual !== versao) return;
                setCategoriasSalvas([]);
                setErroCategorias(error.message);
                setCarregandoCategorias(false);
            });
        });
        return () => {
            ++versao;
            pararAutenticacao();
            pararProdutos?.();
            pararCategorias?.();
        };
    }, []);

    const categorias = [...new Map([
        ...categoriasSalvas, ...produtos.map((produto) => produto.categoria), "Eletrônicos", "Roupas", "Alimentos",
    ].map((nome) => [nome.toLocaleLowerCase("pt-BR"), nome])).values()].sort((a, b) => a.localeCompare(b, "pt-BR"));

    return (
        <ProdutoContexto.Provider value={{ produtos, carregando: carregandoProdutos || carregandoCategorias, erro: erroProdutos || erroCategorias, categorias }}>
            {children}
        </ProdutoContexto.Provider>
    );
};
