import { useState } from "react";
import { useHistorico } from "../../hooks/useHistorico";
import { useProdutos } from "../../hooks/useProdutos";
import { chaveMes, resumirMovimentos } from "../../utils/relatorios";
import estilos from "./Relatorios.module.css";

const moeda = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const nomeMes = (mes: string) => {
    const [ano, numero] = mes.split("-").map(Number);
    return new Date(ano, numero - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
};

const Relatorios = () => {
    const { movimentacoes, carregando: carregandoHistorico, erro: erroHistorico } = useHistorico();
    const { produtos, carregando: carregandoProdutos, erro: erroProdutos } = useProdutos();
    const [mes, setMes] = useState(() => chaveMes(new Date()));
    const filtrados = movimentacoes.filter((item) => chaveMes(item.data) === mes);
    const resumo = resumirMovimentos(filtrados);
    const meses = [...new Set(movimentacoes.map((item) => chaveMes(item.data)))].sort().reverse();
    const zerados = produtos.filter((produto) => produto.estoque === 0).length;
    const baixos = produtos.filter((produto) => produto.estoque > 0 && produto.estoque <= produto.qtdMin).length;
    const erro = erroHistorico || erroProdutos;
    const carregando = carregandoHistorico || carregandoProdutos;

    return (
        <div className="pagina-app pagina-consulta">
            <h1 className="titulo-pagina">Relatórios</h1>
            <div className={estilos.filtros}>
                <label htmlFor="mes-relatorio">Período
                    <input id="mes-relatorio" type="month" value={mes} onChange={(evento) => setMes(evento.target.value)} />
                </label>
                <button className={estilos.botaoNovo} onClick={() => setMes(chaveMes(new Date()))}>Mês atual</button>
            </div>
            {carregando ? <p role="status">Carregando relatório...</p>
                : erro ? <p role="alert">Não foi possível carregar o relatório: {erro}</p>
                : !mes ? <p role="status">Selecione um mês e ano para consultar.</p>
                : <>
                    <p className={estilos.observacao}>Período: {nomeMes(mes)}. Valores calculados com as movimentações registradas; o saldo é o valor das saídas menos o valor das entradas.</p>
                    {filtrados.length === 0 && <p role="status">Nenhuma movimentação registrada neste mês.</p>}
                    <div className={estilos.cards}>
                        <div className={"superficie " + estilos.card}><div className={estilos.cardContent}>
                            <h2 className={estilos.cardTitulo}>Entradas</h2>
                            <p className={estilos.cardValor}>{moeda(resumo.gastos)}</p>
                            <p className={estilos.cardSub}>Valor de reposição de estoque no período</p>
                            <div className={estilos.lista}>
                                <div className={estilos.itemLista}><span>Movimentações</span><strong>{resumo.numeroEntradas}</strong></div>
                                <div className={estilos.itemLista}><span>Unidades recebidas</span><strong>{resumo.unidadesEntrada}</strong></div>
                            </div>
                        </div></div>
                        <div className={"superficie " + estilos.card}><div className={estilos.cardContent}>
                            <h2 className={estilos.cardTitulo}>Saídas</h2>
                            <p className={estilos.cardValor}>{moeda(resumo.receita)}</p>
                            <div className={estilos.lista}>
                                <div className={estilos.itemLista}><span>Unidades de saída</span><strong>{resumo.unidadesSaida}</strong></div>
                                <div className={estilos.itemLista}><span>Movimentações</span><strong>{resumo.numeroSaidas}</strong></div>
                                <div className={estilos.itemLista}><span>Média por saída</span><strong>{moeda(resumo.mediaSaida)}</strong></div>
                            </div>
                        </div></div>
                        <div className={"superficie " + estilos.card}><div className={estilos.cardContent}>
                            <h2 className={estilos.cardTitulo}>Saldo das movimentações</h2>
                            <p className={estilos.cardValor}>{moeda(resumo.saldo)}</p>
                            <p className={estilos.cardSub}>Saídas menos entradas no período</p>
                        </div></div>
                        <div className={"superficie " + estilos.card}><div className={estilos.cardContent}>
                            <h2 className={estilos.cardTitulo}>Pendências atuais</h2>
                            <p className={estilos.cardSub}>Estoque atual, independente do mês selecionado</p>
                            <div className={estilos.lista}>
                                <div className={estilos.itemPendencia}><span>Produtos zerados</span><span className={estilos.badgeZerado}>{zerados}</span></div>
                                <div className={estilos.itemPendencia}><span>Estoque baixo</span><span className={estilos.badgeBaixo}>{baixos}</span></div>
                            </div>
                        </div></div>
                        <div className={"superficie " + estilos.card2}><div className={estilos.cardContentTabela}>
                            <div className={estilos.cabecalhoTabela}><h2 className={estilos.tituloTabela}>Resumo por mês</h2></div>
                            {meses.length === 0 ? <p className={estilos.observacao}>Os meses aparecerão aqui após o registro de movimentações.</p> :
                                <div className={estilos.rolagem}><table className={"tabela-dados " + estilos.tabela}>
                                    <thead><tr><th scope="col">Período</th><th scope="col">Entradas</th><th scope="col">Saídas</th><th scope="col">Saldo</th><th scope="col">Consultar</th></tr></thead>
                                    <tbody>{meses.map((periodo) => {
                                        const total = resumirMovimentos(movimentacoes.filter((item) => chaveMes(item.data) === periodo));
                                        return <tr key={periodo}>
                                            <td>{nomeMes(periodo)}</td><td>{moeda(total.gastos)}</td><td>{moeda(total.receita)}</td><td>{moeda(total.saldo)}</td>
                                            <td><button className="botao-leve" aria-label={"Consultar " + nomeMes(periodo)} onClick={() => setMes(periodo)}>Ver mês</button></td>
                                        </tr>;
                                    })}</tbody>
                                </table></div>}
                        </div></div>
                    </div>
                </>}
        </div>
    );
};

export default Relatorios;
