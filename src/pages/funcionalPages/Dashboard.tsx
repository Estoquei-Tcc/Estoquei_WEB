import NotificacaoAlerta from "../../components/NotificacaoAlerta";
import { useHistorico } from "../../hooks/useHistorico";
import { useProdutos } from "../../hooks/useProdutos";
import estilos from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const {
        produtos,
        carregando: carregandoProdutos,
        erro: erroProdutos,
    } = useProdutos();
    const {
        movimentacoes,
        carregando: carregandoHistorico,
        erro: erroHistorico,
    } = useHistorico();
    const hoje = new Date();
    const saidasHoje = movimentacoes.filter(
        (movimento) =>
            movimento.entrasai === "saida" &&
            movimento.data.toDateString() === hoje.toDateString(),
    );
    const valorSaidas = saidasHoje.reduce(
        (total, movimento) => total + movimento.precoTotal,
        0,
    );
    const saidasPorProduto = new Map<string, {
        produtoId?: string;
        codigo: number;
        nome: string;
        quantidade: number;
    }>();
    for (const movimento of saidasHoje) {
        const chave = movimento.produtoId || String(movimento.codigoProduto);
        const acumulado = saidasPorProduto.get(chave);
        saidasPorProduto.set(chave, {
            produtoId: movimento.produtoId,
            codigo: movimento.codigoProduto,
            nome: movimento.nomeProduto || "Produto " + movimento.codigoProduto,
            quantidade: (acumulado?.quantidade ?? 0) + movimento.quantidade,
        });
    }
    const produtoDoDia = [...saidasPorProduto.values()].sort(
        (a, b) => b.quantidade - a.quantidade || a.nome.localeCompare(b.nome, "pt-BR"),
    )[0];
    const produtoDestaque = produtoDoDia && produtos.find((produto) =>
        produtoDoDia.produtoId
            ? produto.id === produtoDoDia.produtoId
            : produto.codigo === produtoDoDia.codigo,
    );
    const zerados = produtos.filter((produto) => produto.estoque === 0).length;
    const baixos = produtos.filter(
        (produto) => produto.estoque > 0 && produto.estoque <= produto.qtdMin,
    ).length;
    const carregando = carregandoProdutos || carregandoHistorico;
    const erro = erroProdutos || erroHistorico;

    return (
        <div className="pagina-app pagina-consulta">
            <div className={estilos.topo}>
                <div>
                    <h1 className={estilos.titulo}>Visão geral</h1>
                    <p className={estilos.subtitulo}>
                        Seu estoque e as movimentações do dia.
                    </p>
                </div>
                <p className={estilos.data}>
                    {hoje.toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
            </div>
            {carregando ? (
                <p role="status">Carregando seu estoque...</p>
            ) : erro ? (
                <p role="alert">Não foi possível carregar os dados: {erro}</p>
            ) : (
                <>
                    <NotificacaoAlerta />
                    <div className={estilos.cardsTrio}>
                        <button
                            className={estilos.resumoCard}
                            onClick={() => navigate("/principal/listaProdutos")}
                        >
                            <p className={estilos.resumoLabel}>
                                Produtos cadastrados
                            </p>
                            <p className={estilos.resumoValor}>
                                {produtos.length}
                            </p>
                            <p className={estilos.resumoSub}>
                                {
                                    new Set(
                                        produtos.map(
                                            (produto) => produto.categoria,
                                        ),
                                    ).size
                                }{" "}
                                categorias em uso
                            </p>
                        </button>
                        <button
                            className={estilos.resumoCard}
                            onClick={() => navigate(produtoDestaque
                                ? "/principal/detalheProduto/" + produtoDestaque.codigo
                                : "/principal/historico")}
                        >
                            <p className={estilos.resumoLabel}>Produto do dia</p>
                            <p className={estilos.produtoDoDia}>
                                {produtoDestaque?.nome ?? produtoDoDia?.nome ?? "Sem saídas hoje"}
                            </p>
                            <p className={estilos.resumoSub}>
                                {produtoDoDia
                                    ? "Mais saídas hoje: " + produtoDoDia.quantidade + (produtoDoDia.quantidade === 1 ? " unidade" : " unidades")
                                    : "O destaque aparece após a primeira saída."}
                            </p>
                        </button>
                        <button
                            className={estilos.resumoCard}
                            onClick={() => navigate("/principal/relatorios")}
                        >
                            <p className={estilos.resumoLabel}>
                                Saídas de hoje
                            </p>
                            <p className={estilos.resumoValor}>
                                {valorSaidas.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </p>
                            <p className={estilos.resumoSub}>
                                {saidasHoje.reduce(
                                    (total, movimento) =>
                                        total + movimento.quantidade,
                                    0,
                                )}{" "}
                                unidades movimentadas
                            </p>
                        </button>
                    </div>
                    <div className={estilos.layout}>
                        <div className={"superficie " + estilos.tabelaWrap}>
                            <div className={estilos.tabelaCabecalho}>
                                <h2 className={estilos.tabelaTitulo}>
                                    Últimas movimentações
                                </h2>
                                <button
                                    className="botao-leve"
                                    onClick={() =>
                                        navigate("/principal/historico")
                                    }
                                >
                                    Ver histórico
                                </button>
                            </div>
                            {movimentacoes.length === 0 ? (
                                <p className="estado-vazio">
                                    As próximas movimentações aparecerão aqui.
                                </p>
                            ) : (
                                <table className="tabela-dados">
                                    <thead>
                                        <tr>
                                            <th scope="col">Tipo</th>
                                            <th scope="col">Produto</th>
                                            <th scope="col">Quantidade</th>
                                            <th scope="col">Data</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...movimentacoes]
                                            .sort(
                                                (a, b) =>
                                                    b.data.getTime() -
                                                    a.data.getTime(),
                                            )
                                            .slice(0, 5)
                                            .map((movimento) => {
                                                const produto = produtos.find(
                                                    (item) =>
                                                        movimento.produtoId
                                                            ? item.id ===
                                                              movimento.produtoId
                                                            : item.codigo ===
                                                              movimento.codigoProduto,
                                                );
                                                return (
                                                    <tr key={movimento.id}>
                                                        <td>
                                                            <span
                                                                className={
                                                                    movimento.entrasai ===
                                                                    "saida"
                                                                        ? estilos.Saida
                                                                        : estilos.Entrada
                                                                }
                                                            >
                                                                {movimento.entrasai ===
                                                                "saida"
                                                                    ? "Saída"
                                                                    : "Entrada"}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {movimento.nomeProduto ??
                                                                produto?.nome ??
                                                                "Produto indisponível"}
                                                        </td>
                                                        <td
                                                            className={
                                                                estilos.tdBold
                                                            }
                                                        >
                                                            {
                                                                movimento.quantidade
                                                            }{" "}
                                                            un.
                                                        </td>
                                                        <td
                                                            className={
                                                                estilos.tdMutado
                                                            }
                                                        >
                                                            {movimento.data.toLocaleDateString(
                                                                "pt-BR",
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <div className={estilos.colunaLateral}>
                            <button
                                className={estilos.cardAlerta}
                                onClick={() =>
                                    navigate("/principal/listaProdutos")
                                }
                            >
                                <p className={estilos.labelAlerta}>
                                    Atenção ao estoque
                                </p>
                                <p className={estilos.valorAlerta}>
                                    {zerados + baixos}
                                </p>
                                <p className={estilos.subAlerta}>
                                    {zerados} esgotados · {baixos} com estoque
                                    baixo
                                </p>
                            </button>
                            <div className={estilos.painel}>
                                <h2 className={estilos.tabelaTitulo}>
                                    Ações rápidas
                                </h2>
                                <div className={estilos.colunaAcoes}>
                                    <button
                                        className={estilos.btnAcaoRapida}
                                        onClick={() =>
                                            navigate("/principal/cadastroProd")
                                        }
                                    >
                                        Cadastrar produto
                                    </button>
                                    <button
                                        className={estilos.btnAcaoRapida}
                                        onClick={() =>
                                            navigate(
                                                "/principal/registrarMovimento",
                                            )
                                        }
                                    >
                                        Registrar movimentação
                                    </button>
                                    <button
                                        className={estilos.btnAcaoRapida}
                                        onClick={() =>
                                            navigate("/principal/relatorios")
                                        }
                                    >
                                        Consultar relatórios
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
export default Dashboard;
