import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHistorico } from "../../hooks/useHistorico";
import { useProdutos } from "../../hooks/useProdutos";
import estilos from "./Historico.module.css";

// Usa a data local para não deslocar movimentos próximos da meia-noite.
function chaveData(data: Date): string {
    return [data.getFullYear(), String(data.getMonth() + 1).padStart(2, "0"), String(data.getDate()).padStart(2, "0")].join("-");
}

const Historico = () => {
    const navigate = useNavigate();
    const { movimentacoes, carregando, erro } = useHistorico();
    const { produtos, carregando: carregandoProdutos, erro: erroProdutos } = useProdutos();
    const [dataSelecionada, setDataSelecionada] = useState(() => chaveData(new Date()));
    const movimentosDoDia = movimentacoes
        .filter((movimento) => chaveData(movimento.data) === dataSelecionada)
        .sort((a, b) => b.data.getTime() - a.data.getTime());
    const aguardando = carregando || carregandoProdutos;
    const mensagemErro = erro || erroProdutos;
    const dataFormatada = dataSelecionada ? dataSelecionada.split("-").reverse().join("/") : "";

    return (
        <div className="pagina-app pagina-consulta">
            <h1 className="titulo-pagina">Histórico</h1>
            <div className={estilos.texto}>
                <button className="botao" onClick={() => navigate("/principal/registrarMovimento")}>
                    Registrar movimento
                </button>
            </div>

            <div className={estilos.filtros}>
                <div className={estilos.campoData}>
                    <label htmlFor="data-historico">Data das movimentações</label>
                    <input
                        id="data-historico"
                        type="date"
                        value={dataSelecionada}
                        onChange={(evento) => setDataSelecionada(evento.target.value)}
                    />
                </div>
                <button className={"botao-leve " + estilos.hoje} onClick={() => setDataSelecionada(chaveData(new Date()))}>
                    Hoje
                </button>
            </div>

            <div className={estilos.conteudo} aria-busy={aguardando}>
                {aguardando ? (
                    <p role="status">Carregando movimentações...</p>
                ) : mensagemErro ? (
                    <p role="alert">Não foi possível carregar o histórico: {mensagemErro}</p>
                ) : !dataSelecionada ? (
                    <p role="status">Selecione um dia, mês e ano para consultar o histórico.</p>
                ) : (
                    <>
                        <h2 className={estilos.mes}>Movimentações de {dataFormatada}</h2>
                        <p className={estilos.resumo} role="status">
                            {movimentosDoDia.length === 0
                                ? "Nenhuma movimentação encontrada para este dia."
                                : movimentosDoDia.length === 1 ? "1 movimentação encontrada." : movimentosDoDia.length + " movimentações encontradas."}
                        </p>
                        {movimentosDoDia.length > 0 && (
                            <div className={"superficie " + estilos.tabelaContainer}>
                                <table className={"tabela-dados " + estilos.tabela}>
                                    <caption className={estilos.legenda}>Movimentações de {dataFormatada}</caption>
                                    <thead>
                                        <tr>
                                            {["Horário", "Produto", "Marca", "Código", "Quantidade", "Movimento", "Valor total"].map((titulo) => (
                                                <th key={titulo} scope="col" className={estilos.tipo}>{titulo}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {movimentosDoDia.map((movimento) => {
                                            const produto = produtos.find((item) => movimento.produtoId ? item.id === movimento.produtoId : item.codigo === movimento.codigoProduto);
                                            return (
                                                <tr key={movimento.id}>
                                                    <td>{movimento.data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</td>
                                                    <td>{movimento.nomeProduto ?? produto?.nome ?? "Produto indisponível"}</td>
                                                    <td>{movimento.marcaProduto ?? produto?.marca ?? "—"}</td>
                                                    <td>{movimento.codigoProduto}</td>
                                                    <td>{movimento.quantidade}</td>
                                                    <td>{movimento.entrasai === "entrada" ? "Entrada" : "Saída"}</td>
                                                    <td>{movimento.precoTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Historico;
