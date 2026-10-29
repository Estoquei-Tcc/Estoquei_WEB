import { useHistorico } from "../../hooks/useHistorico";
import { useProdutos } from "../../hooks/useProdutos";
import estilos from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    const { produtos, carregando: carregandoProdutos, erro: erroProdutos } = useProdutos();

    const { movimentacoes, carregando: carregandoHistorico, erro: erroHistorico } = useHistorico();

    const hoje = new Date();

    // Sete dias de calendário, incluindo hoje, no horário local.
    const inicioSemana = new Date(hoje);

    inicioSemana.setDate(inicioSemana.getDate() - 6);
    inicioSemana.setHours(0, 0, 0, 0);

    const movimentacoesSemana = movimentacoes.filter(
        (movimento) =>
            movimento.data.getTime() >= inicioSemana.getTime() &&
            movimento.data.getTime() <= hoje.getTime(),
    );

    const ultimasMovimentacoesSemana = [...movimentacoesSemana]
        .sort((a, b) => b.data.getTime() - a.data.getTime())
        .slice(0, 5);

    const saidasSemana = movimentacoesSemana.filter((movimento) => movimento.entrasai === "saida");

    const valorSaidas = saidasSemana.reduce((total, movimento) => total + movimento.precoTotal, 0);

    const unidadesSaida = saidasSemana.reduce(
        (total, movimento) => total + movimento.quantidade,
        0,
    );

    const categoriasEmUso = new Set(produtos.map((produto) => produto.categoria)).size;

    // Junta as saídas do mesmo produto para encontrar o mais movimentado.
    const saidasPorProduto: {
        produtoId?: string;
        codigo: number;
        nome: string;
        quantidade: number;
    }[] = [];

    for (const movimento of saidasSemana) {
        const acumulado = saidasPorProduto.find((item) => {
            if (movimento.produtoId) return item.produtoId === movimento.produtoId;

            return !item.produtoId && item.codigo === movimento.codigoProduto;
        });

        const nome = movimento.nomeProduto || "Produto " + movimento.codigoProduto;

        if (acumulado) {
            acumulado.quantidade += movimento.quantidade;
            acumulado.nome = nome;
        } else {
            saidasPorProduto.push({
                produtoId: movimento.produtoId,
                codigo: movimento.codigoProduto,
                nome,
                quantidade: movimento.quantidade,
            });
        }
    }

    const produtoDaSemana = saidasPorProduto.sort(
        (a, b) => b.quantidade - a.quantidade || a.nome.localeCompare(b.nome, "pt-BR"),
    )[0];

    const produtoDestaque =
        produtoDaSemana &&
        produtos.find((produto) =>
            produtoDaSemana.produtoId
                ? produto.id === produtoDaSemana.produtoId
                : produto.codigo === produtoDaSemana.codigo,
        );

    const zerados = produtos.filter((produto) => produto.estoque === 0).length;

    const baixos = produtos.filter(
        (produto) => produto.estoque > 0 && produto.estoque <= produto.qtdMin,
    ).length;

    const carregando = carregandoProdutos || carregandoHistorico;

    const erro = erroProdutos || erroHistorico;

    const nomeDestaque = produtoDestaque?.nome || produtoDaSemana?.nome || "Sem saídas na semana";

    const destinoDestaque = produtoDestaque
        ? "/principal/detalheProduto/" + produtoDestaque.codigo
        : "/principal/historico";

    if (carregando) return <p role="status">Carregando estoque...</p>;
    if (erro) return <p role="alert">Não foi possível carregar os dados: {erro}</p>;

    return (
        <div className="pagina-app pagina-consulta">
            <div className={estilos.topo}>
                <div>
                    <h1 className={estilos.titulo}>Visão geral</h1>
                    <p className={estilos.subtitulo}>
                        Seu estoque e as movimentações dos últimos 7 dias.
                    </p>
                </div>
                <p className={estilos.data}>
                    {inicioSemana.toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                    {" a "}
                    {hoje.toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
            </div>

           
            <div className={estilos.cardsTrio}>
                <button
                    className={estilos.resumoCard}
                    onClick={() => navigate("/principal/listaProdutos")}
                >
                    <p className={estilos.resumoLabel}>Produtos cadastrados</p>
                    <p className={estilos.resumoValor + " " + estilos.valorProdutos}>
                        {produtos.length}
                    </p>
                    <p className={estilos.resumoSub}>{categoriasEmUso} categorias em uso</p>
                </button>
                <button
                    className={estilos.resumoCard + " " + estilos.cardProduto}
                    onClick={() => navigate(destinoDestaque)}
                >
                    <p className={estilos.resumoLabel}>Produto da semana</p>
                    <p className={estilos.produtoDaSemana}>{nomeDestaque}</p>
                    <p className={estilos.resumoSub}>
                        {produtoDaSemana?.quantidade || 0} unidades na semana
                    </p>
                </button>
                <button
                    className={estilos.resumoCard + " " + estilos.cardSaidas}
                    onClick={() => navigate("/principal/relatorios")}
                >
                    <p className={estilos.resumoLabel}>Saídas da semana</p>
                    <p className={estilos.resumoValor + " " + estilos.valorSaidas}>
                        {valorSaidas.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </p>
                    <p className={estilos.resumoSub}>{unidadesSaida} unidades movimentadas</p>
                </button>
            </div>
            <div className={estilos.layout}>
                <div className={"superficie " + estilos.tabelaWrap}>
                    <div className={estilos.tabelaCabecalho}>
                        <h2 className={estilos.tabelaTitulo}>Últimas movimentações da semana</h2>
                        <button
                            className="botao-leve"
                            onClick={() => navigate("/principal/historico")}
                        >
                            Ver histórico
                        </button>
                    </div>
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
                            {ultimasMovimentacoesSemana.map((movimento) => (
                                <tr key={movimento.id}>
                                    <td>
                                        <span
                                            className={
                                                movimento.entrasai === "saida"
                                                    ? estilos.Saida
                                                    : estilos.Entrada
                                            }
                                        >
                                            <span
                                                className={estilos.setaMovimento}
                                                aria-hidden="true"
                                            >
                                                {movimento.entrasai === "saida" ? "↓" : "↑"}
                                            </span>
                                            {movimento.entrasai === "saida" ? "Saída" : "Entrada"}
                                        </span>
                                    </td>
                                    <td>{movimento.nomeProduto || movimento.codigoProduto}</td>
                                    <td className={estilos.tdBold}>{movimento.quantidade} un.</td>
                                    <td className={estilos.tdMutado}>
                                        {movimento.data.toLocaleDateString("pt-BR")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={estilos.colunaLateral}>
                    <button
                        className={estilos.cardAlerta}
                        onClick={() => navigate("/principal/listaProdutos")}
                    >
                        <p className={estilos.labelAlerta}>Atenção ao estoque</p>
                        <p className={estilos.valorAlerta}>{zerados + baixos}</p>
                        <p className={estilos.subAlerta}>
                            {zerados} esgotados · {baixos} com estoque baixo
                        </p>
                    </button>
                    <div className={estilos.painel}>
                        <h2 className={estilos.tabelaTitulo}>Ações rápidas</h2>
                        <div className={estilos.colunaAcoes}>
                            <button
                                className={estilos.btnAcaoRapida}
                                onClick={() => navigate("/principal/cadastroProd")}
                            >
                                Cadastrar produto
                                <span className={estilos.setaAcao} aria-hidden="true">
                                    ↗
                                </span>
                            </button>
                            <button
                                className={estilos.btnAcaoRapida}
                                onClick={() => navigate("/principal/registrarMovimento")}
                            >
                                Registrar movimentação
                                <span className={estilos.setaAcao} aria-hidden="true">
                                    ↗
                                </span>
                            </button>
                            <button
                                className={estilos.btnAcaoRapida}
                                onClick={() => navigate("/principal/relatorios")}
                            >
                                Consultar relatórios
                                <span className={estilos.setaAcao} aria-hidden="true">
                                    ↗
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
