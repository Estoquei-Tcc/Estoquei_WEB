import { useState } from "react";
import { useHistorico } from "../../hooks/useHistorico";
import { useProdutos } from "../../hooks/useProdutos";
import { chaveMes, resumirMovimentos } from "../../utils/relatorios";
import estilos from "./Relatorios.module.css";

const moeda = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const nomeMes = (mes: string) => {
    const [ano, numero] = mes.split("-").map(Number);

    return new Date(ano, numero - 1, 1).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
    });
};

const Relatorios = () => {
    const { movimentacoes, carregando: carregandoHistorico, erro: erroHistorico } = useHistorico();

    const { produtos, carregando: carregandoProdutos, erro: erroProdutos } = useProdutos();

    const [mes, setMes] = useState(() => chaveMes(new Date()));

    const filtrados = movimentacoes.filter((item) => chaveMes(item.data) === mes);

    const resumo = resumirMovimentos(filtrados);

    const meses = [...new Set(movimentacoes.map((item) => chaveMes(item.data)))].sort().reverse();

    // Prepara os totais antes de montar a tabela.
    const resumoPorMes = meses.map((periodo) => {
        const movimentosDoMes = movimentacoes.filter(
            (movimento) => chaveMes(movimento.data) === periodo,
        );

        return {
            periodo,
            nome: nomeMes(periodo),
            ...resumirMovimentos(movimentosDoMes),
        };
    });

    const zerados = produtos.filter((produto) => produto.estoque === 0).length;

    const baixos = produtos.filter(
        (produto) => produto.estoque > 0 && produto.estoque <= produto.qtdMin,
    ).length;

    const erro = erroHistorico || erroProdutos;

    const carregando = carregandoHistorico || carregandoProdutos;

    if (carregando) return <p role="status">Carregando relatório...</p>;
    if (erro) return <p role="alert">Não foi possível carregar os dados: {erro}</p>;

    return (
        <div className="pagina-app pagina-consulta">
            <h1 className="titulo-pagina">Relatórios</h1>
            <div className={estilos.filtros}>
                <label htmlFor="mes-relatorio">
                    Período
                    <input
                        id="mes-relatorio"
                        type="month"
                        value={mes}
                        onChange={(evento) => setMes(evento.target.value)}
                    />
                </label>
                <button className={estilos.botaoNovo} onClick={() => setMes(chaveMes(new Date()))}>
                    Mês atual
                </button>
            </div>

            <div className={estilos.cards}>
                <div className={"superficie " + estilos.card}>
                    <div className={estilos.cardContent}>
                        <h2 className={estilos.cardTitulo}>Gastos</h2>
                        <p className={estilos.cardValor + " " + estilos.valorGastos}>
                            {moeda(resumo.gastos)}
                        </p>
                        <div className={estilos.lista}>
                            <div className={estilos.itemLista}>
                                <span>Movimentações</span>
                                <strong>{resumo.numeroEntradas}</strong>
                            </div>
                            <div className={estilos.itemLista}>
                                <span>Unidades recebidas</span>
                                <strong>{resumo.unidadesEntrada}</strong>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"superficie " + estilos.card}>
                    <div className={estilos.cardContent}>
                        <h2 className={estilos.cardTitulo}>Vendas</h2>
                        <p className={estilos.cardValor + " " + estilos.valorVendas}>
                            {moeda(resumo.receita)}
                        </p>
                        <div className={estilos.lista}>
                            <div className={estilos.itemLista}>
                                <span>Unidades de saída</span>
                                <strong>{resumo.unidadesSaida}</strong>
                            </div>
                            <div className={estilos.itemLista}>
                                <span>Movimentações</span>
                                <strong>{resumo.numeroSaidas}</strong>
                            </div>
                            <div className={estilos.itemLista}>
                                <span>Média por saída</span>
                                <strong>{moeda(resumo.mediaSaida)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"superficie " + estilos.card + " " + estilos.cardSaldo}>
                    <div className={estilos.cardContent}>
                        <h2 className={estilos.cardTitulo}>Lucro</h2>
                        <p className={estilos.cardValor + " " + estilos.valorSaldo}>
                            {moeda(resumo.saldo)}
                        </p>
                        <p className={estilos.cardSub}>Saldo final entre gastos e receita.</p>
                    </div>
                </div>
                <div className={"superficie " + estilos.card}>
                    <div className={estilos.cardContent}>
                        <h2 className={estilos.cardTitulo}>Pendências atuais</h2>

                        <div className={estilos.lista}>
                            <div className={estilos.itemPendencia}>
                                <span>Produtos zerados</span>
                                <span className={estilos.badgeZerado}>{zerados}</span>
                            </div>
                            <div className={estilos.itemPendencia}>
                                <span>Estoque baixo</span>
                                <span className={estilos.badgeBaixo}>{baixos}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"superficie " + estilos.card2}>
                    <div className={estilos.cardContentTabela}>
                        <div className={estilos.cabecalhoTabela}>
                            <h2 className={estilos.tituloTabela}>Resumo por mês</h2>
                        </div>
                        <div className={estilos.rolagem}>
                            <table className={"tabela-dados " + estilos.tabela}>
                                <thead>
                                    <tr>
                                        <th scope="col">Período</th>
                                        <th scope="col">Entradas</th>
                                        <th scope="col">Saídas</th>
                                        <th scope="col">Saldo</th>
                                        <th scope="col">Consultar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resumoPorMes.map((total) => (
                                        <tr key={total.periodo}>
                                            <td>{total.nome}</td>
                                            <td>{moeda(total.gastos)}</td>
                                            <td>{moeda(total.receita)}</td>
                                            <td>{moeda(total.saldo)}</td>
                                            <td>
                                                <button
                                                    className="botao-leve"
                                                    aria-label={"Consultar " + total.nome}
                                                    onClick={() => setMes(total.periodo)}
                                                >
                                                    Ver mês
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Relatorios;
