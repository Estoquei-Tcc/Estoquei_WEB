import styles from "./ListaProdutos.module.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { useProdutos } from "../../hooks/useProdutos";
import { useState } from "react";

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ListaProdutos() {
    const [filtro, setFiltro] = useState("Todos");

    const [filtroCategoria, setFiltroCategoria] = useState("Todas");

    const [filtroNome, setFiltroNome] = useState("");

    const { produtos, categorias, carregando, erro } = useProdutos();

    const navigate = useNavigate();

    const irParaProduto = (codigo: number) => {
        navigate("/principal/detalheProduto/" + codigo);
    };

    const filtrar = (e: React.MouseEvent<HTMLButtonElement>) => {
        setFiltro(e.currentTarget.value);
    };

    const filtrarCategoria = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFiltroCategoria(e.currentTarget.value);
    };

    const filtrarNome = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiltroNome(e.currentTarget.value);
    };

    const produtosFiltrados = produtos.filter((p) => {
        if (filtro === "Todos" && filtroCategoria === "Todas") return true;
        else if (filtro == "Todos" && filtroCategoria == p.categoria)
            return true;
        else if (filtro == p.status && filtroCategoria == "Todas") return true;
        else if (filtro == p.status && filtroCategoria == p.categoria)
            return true;
    });

    const segundoFiltro = produtosFiltrados.filter((p) => {
        if (filtroNome == "") return true;

        const palavra = filtroNome.toLowerCase();

        const produtoNome = p.nome.toLowerCase();

        return produtoNome.includes(palavra);
    });

    if (carregando)
        return (
            <div className="pagina-app pagina-consulta">
                <p role="status">Carregando produtos...</p>
            </div>
        );
    if (erro)
        return (
            <div className="pagina-app pagina-consulta">
                <p role="alert">
                    Não foi possível carregar os produtos: {erro}
                </p>
            </div>
        );

    return (
        <div className="pagina-app pagina-consulta">
            {/* ── Topo ── */}
            <div className={styles.topo}>
                <div className={styles.topoEsquerda}>
                    <h1>Produtos</h1>
                    <p>Gerencie e acompanhe seu estoque em tempo real</p>
                </div>
                <Link
                    to="/principal/cadastroProd"
                    className={"botao " + styles.btnAdicionar}
                >
                    <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                    Adicionar produto
                </Link>
            </div>

            {/* ── Cards de resumo ── */}
            <div className={styles.resumo}>
                <div className={styles.resumoCard}>
                    <p className={styles.resumoLabel}>Total de produtos</p>
                    <p className={styles.resumoValor}>{produtos.length}</p>
                    <p className={styles.resumoSub}>
                        {categorias.length} categorias
                    </p>
                </div>
                <div className={styles.resumoCard}>
                    <p className={styles.resumoLabel}>Valor em estoque</p>
                    <p className={styles.resumoValor}>
                        {produtos
                            .reduce(
                                (total, produto) =>
                                    total +
                                    produto.precoCusto * produto.estoque,
                                0,
                            )
                            .toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                    </p>
                    <p className={styles.resumoSub}>preço de custo</p>
                </div>
                <div
                    className={`${styles.resumoCard} ${styles.resumoCardAlerta}`}
                >
                    <p
                        className={`${styles.resumoLabel} ${styles.resumoLabelAlerta}`}
                    >
                        Sem estoque
                    </p>
                    <p
                        className={`${styles.resumoValor} ${styles.resumoValorAlerta}`}
                    >
                        {produtos.filter((p) => p.status == "Esgotado").length}
                    </p>
                    <p
                        className={`${styles.resumoSub} ${styles.resumoSubAlerta}`}
                    >
                        requer atenção
                    </p>
                </div>
                <div className={styles.resumoCard}>
                    <p className={styles.resumoLabel}>Estoque baixo</p>
                    <p
                        className={styles.resumoValor}
                        style={{ color: "var(--cor-primaria-base)" }}
                    >
                        {produtos.filter((p) => p.status == "Baixo").length}
                    </p>
                    <p className={styles.resumoSub}>abaixo do mínimo</p>
                </div>
            </div>

            {/* ── Filtros ── */}
            <div className={styles.painel}>
                <div className={styles.painelLinha}>
                    {/* Busca */}
                    <div className={styles.campoBusca}>
                        <svg
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="search"
                            placeholder="Buscar produto pelo nome..."
                            aria-label="Buscar produto pelo nome"
                            onChange={filtrarNome}
                        />
                    </div>

                    {/* Categoria */}
                    <select
                        aria-label="Filtrar por categoria"
                        className={"campo-controle " + styles.select}
                        defaultValue="Todas"
                        onChange={filtrarCategoria}
                    >
                        <option value="Todas">Todas</option>
                        {categorias.map((p) => {
                            return (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            );
                        })}
                    </select>

                    {/* Status */}
                    <div className={styles.botoesStatus}>
                        <button
                            onClick={filtrar}
                            value="Todos"
                            className={`${styles.botaoFiltro} ${filtro == "Todos" ? styles.botaoAtivo : ""}`}
                        >
                            Todos
                        </button>
                        <button
                            className={`${styles.botaoFiltro} ${filtro == "Normal" ? styles.botaoAtivo : ""}`}
                            onClick={filtrar}
                            value="Normal"
                        >
                            Normal
                        </button>
                        <button
                            className={`${styles.botaoFiltro} ${filtro == "Baixo" ? styles.botaoAtivo : ""}`}
                            onClick={filtrar}
                            value="Baixo"
                        >
                            Baixo
                        </button>
                        <button
                            className={`${styles.botaoFiltro} ${filtro == "Esgotado" ? styles.botaoAtivo : ""}`}
                            onClick={filtrar}
                            value="Esgotado"
                        >
                            Esgotado
                        </button>

                        <button
                            className={`${styles.botaoFiltro} ${filtro == "Cheio" ? styles.botaoAtivo : ""}`}
                            onClick={filtrar}
                            value="Cheio"
                        >
                            Cheio
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Tabela ── */}
            <div className={"superficie " + styles.tabelaWrap}>
                <div className={styles.tabelaCabecalho}>
                    <span className={styles.tabelaTitulo}>
                        Lista de produtos
                    </span>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <span className={styles.tabelaContagem}>
                            {segundoFiltro.length} produtos
                        </span>
                    </div>
                </div>

                <table className="tabela-dados">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Categoria</th>
                            <th>Preço custo</th>
                            <th>Preço venda</th>
                            <th>Mínimo</th>
                            <th>Quantidade</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {segundoFiltro.length === 0 && (
                            <tr>
                                <td colSpan={8}>
                                    <p className="estado-vazio">
                                        Nenhum produto encontrado. Ajuste os
                                        filtros ou cadastre um produto.
                                    </p>
                                </td>
                            </tr>
                        )}

                        {segundoFiltro.map((p) => {
                            return (
                                <tr
                                    key={p.codigo}
                                    onClick={() => {
                                        irParaProduto(p.codigo);
                                    }}
                                >
                                    <td>
                                        <div className={styles.celulaProduto}>
                                            <div>
                                                <p
                                                    className={
                                                        styles.nomeProduto
                                                    }
                                                >
                                                    {p.nome}
                                                </p>
                                                <p
                                                    className={
                                                        styles.codigoProduto
                                                    }
                                                >
                                                    Cód: {p.codigo}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.tdMutado}>
                                        {p.categoria}
                                    </td>
                                    <td className={styles.tdMutado}>
                                        R$ {p.precoCusto.toFixed(2)}
                                    </td>
                                    <td className={styles.tdBold}>
                                        R$ {p.precoVenda.toFixed(2)}
                                    </td>
                                    <td className={styles.tdMutado}>
                                        {p.qtdMin} un.
                                    </td>
                                    <td>
                                        <span className={styles.classeQtd}>
                                            {p.estoque} un.
                                        </span>
                                    </td>
                                    <td className={styles.tdBold}>
                                        <span
                                            className={`${styles.pill} ${p.status === "Esgotado" ? styles.pillZerado : p.status === "Baixo" ? styles.pillBaixo : p.status === "Normal" ? styles.pillNormal : ""}`}
                                        >
                                            {p.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className={"botao-leve " + styles.btnAcoes}
                                            onClick={(evento) => {
                                                evento.stopPropagation();
                                                navigate(
                                                    "/principal/editarProduto/" +
                                                        p.id,
                                                );
                                            }}
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
