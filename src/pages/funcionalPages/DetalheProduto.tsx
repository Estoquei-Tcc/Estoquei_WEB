import { useState } from "react";
import estilos from "./DetalheProduto.module.css";

import { useParams, useNavigate } from "react-router-dom";
import { useProdutos } from "../../hooks/useProdutos";
import { useHistorico } from "../../hooks/useHistorico";

export default function DetalheProduto() {
    const navigate = useNavigate();

    const { codigo } = useParams<{ codigo: string }>();

    const { produtos, carregando, erro, excluirProduto } = useProdutos();

    const [excluindo, setExcluindo] = useState(false);

    const { movimentacoes } = useHistorico();

    const produto = produtos.find((produto) => produto.codigo === Number(codigo));

    if (carregando) return <p role="status">Carregando produto...</p>;
    if (erro) return <p role="alert">Não foi possível carregar o produto: {erro}</p>;

    if (!produto) {
        return <h2>Produto não encontrado.</h2>;
    }

    const confirmarExclusao = async () => {
        if (
            !window.confirm(
                'Excluir "' + produto.nome + '"? As movimentações serão mantidas no histórico.',
            )
        )
            return;

        setExcluindo(true);

        try {
            await excluirProduto(produto.id);
            navigate("/principal/listaProdutos");
        } catch {
            alert("Não foi possível excluir o produto. Tente novamente.");
            setExcluindo(false);
        }
    };

    const margem = (((produto.precoVenda - produto.precoCusto) / produto.precoVenda) * 100).toFixed(
        0,
    );

    const ultimasMovimentacoes = movimentacoes
        .filter((movimento) => {
            if (movimento.produtoId) return movimento.produtoId === produto.id;

            return movimento.codigoProduto === produto.codigo;
        })
        .sort((a, b) => b.data.getTime() - a.data.getTime())
        .slice(0, 5);

    const coresStatus: Record<string, string> = {
        Esgotado: estilos.statusZerado,
        Baixo: estilos.statusBaixo,
        Normal: estilos.statusNormal,
        Cheio: estilos.statusNormal,
    };

    return (
        <div className="pagina-app pagina-consulta">
            {/* ── Topo ── */}
            <div className={estilos.topo}>
                <div className={estilos.topoEsquerda}>
                    <button
                        className={"botao-leve " + estilos.btnVoltar}
                        aria-label="Voltar"
                        onClick={() => navigate("/principal/listaProdutos")}
                    >
                        ‹
                    </button>

                    <div className={estilos.topoInfo}>
                        <h1>{produto.nome}</h1>

                        <p>
                            Cód: {produto.codigo} · {produto.categoria}
                        </p>
                    </div>
                </div>

                <div className={estilos.topoAcoes}>
                    <button
                        className={estilos.btnPerigo}
                        disabled={excluindo}
                        onClick={confirmarExclusao}
                    >
                        <svg
                            width="15"
                            height="15"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                        </svg>
                        Excluir
                    </button>

                    <button
                        className={estilos.btnSecundario}
                        disabled={excluindo}
                        onClick={() => navigate("/principal/editarProduto/" + produto.id)}
                    >
                        <svg
                            width="15"
                            height="15"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Editar
                    </button>

                    <button
                        className="botao"
                        disabled={excluindo}
                        onClick={() =>
                            navigate("/principal/registrarMovimento?produto=" + produto.id)
                        }
                    >
                        <svg
                            width="15"
                            height="15"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                        </svg>
                        Registrar movimentação
                    </button>
                </div>
            </div>

            {/* ── Grid ── */}
            <div className={estilos.grid}>
                {/* ── Coluna esquerda ── */}
                <div className={estilos.colunaEsquerda}>
                    {/* Identidade */}
                    <div className={estilos.card}>
                        <div className={estilos.produtoIdentidade}>
                            <p className={estilos.produtoNome}>{produto.nome}</p>

                            <p className={estilos.produtoCodigo}>{produto.marca}</p>

                            <p className={estilos.produtoCodigo}>Cód: {produto.codigo}</p>
                        </div>

                        <div className={estilos.cardCorpo} style={{ paddingTop: 0 }}>
                            <div className={estilos.campoLinha}>
                                <span className={estilos.campoLabel}>Categoria</span>

                                <span className={estilos.campoValor}>{produto.categoria}</span>
                            </div>

                            <div className={estilos.campoLinha + " " + estilos.linhaFornecedor}>
                                <span className={estilos.campoLabel}>Fornecedor</span>

                                <span className={estilos.campoValorMutado}>
                                    {produto.fornecedor}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Preços */}
                    <div className={estilos.card}>
                        <p className={estilos.cardTitulo}>Preços</p>

                        <div className={estilos.cardCorpo}>
                            <div className={estilos.precosGrid}>
                                <div>
                                    <p className={estilos.precoLabel}>Custo</p>

                                    <p className={estilos.precoValor}>
                                        R$ {produto.precoCusto.toFixed(2)}
                                    </p>

                                    <p className={estilos.precoSub}>preço de compra</p>
                                </div>

                                <div>
                                    <p className={estilos.precoLabel}>Venda</p>

                                    <p className={estilos.precoValor + " " + estilos.precoVenda}>
                                        R$ {produto.precoVenda.toFixed(2)}
                                    </p>

                                    <p className={estilos.precoSub}>preço ao cliente</p>
                                </div>
                            </div>

                            <div className={estilos.margemDestaque}>
                                <span className={estilos.margemLabel}>Margem de lucro</span>

                                <span className={estilos.margemValor}>{margem}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Coluna direita ── */}
                <div className={estilos.colunaDireita}>
                    {/* Estoque */}
                    <div className={estilos.card}>
                        <p className={estilos.cardTitulo}>Estoque atual</p>

                        <div className={estilos.cardCorpo}>
                            <div className={estilos.estoqueGrid}>
                                <div className={estilos.estoqueItem + " " + estilos.estoqueAtual}>
                                    <p className={estilos.estoqueLabel}>Atual</p>

                                    <p
                                        className={
                                            estilos.estoqueValor + " " + estilos.valorEstoqueAtual
                                        }
                                    >
                                        {produto.estoque}
                                    </p>

                                    <p className={estilos.estoqueSub}>unidades</p>
                                </div>

                                <div className={estilos.estoqueItem}>
                                    <p className={estilos.estoqueLabel}>Mínimo</p>

                                    <p className={estilos.estoqueValor}>{produto.qtdMin}</p>

                                    <p className={estilos.estoqueSub}>unidades</p>
                                </div>

                                <div className={estilos.estoqueItem}>
                                    <p className={estilos.estoqueLabel}>Máximo</p>

                                    <p className={estilos.estoqueValor}>{produto.qtdMax}</p>

                                    <p className={estilos.estoqueSub}>unidades</p>
                                </div>
                            </div>

                            {/* Status do estoque */}
                            <div className={estilos.statusWrap}>
                                <div className={estilos.statusEstoque}>
                                    <span
                                        className={`${estilos.statusBadge} ${coresStatus[produto.status]}`}
                                    >
                                        Estoque {produto.status.toLowerCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Histórico */}
                    <div className={"superficie " + estilos.tabelaWrap}>
                        <div className={estilos.tabelaCabecalho}>
                            <span className={estilos.tabelaTitulo}>Histórico de movimentações</span>

                            <button
                                className="botao-leve"
                                onClick={() => navigate("/principal/historico")}
                            >
                                Ver todos
                            </button>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Quantidade</th>
                                    <th>Data</th>
                                </tr>
                            </thead>

                            <tbody>
                                {ultimasMovimentacoes.map((h) => (
                                    <tr key={h.id}>
                                        <td>
                                            {h.entrasai === "entrada" ? (
                                                <span className={estilos.tipoEntrada}>
                                                    ↑ Entrada
                                                </span>
                                            ) : (
                                                <span className={estilos.tipoSaida}>↓ Saída</span>
                                            )}
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    h.entrasai === "entrada"
                                                        ? estilos.qtdEntrada
                                                        : estilos.qtdSaida
                                                }
                                            >
                                                {h.quantidade} un.
                                            </span>
                                        </td>

                                        <td className={estilos.tdMutado}>
                                            {h.data.toLocaleDateString("pt-br")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
