import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHistorico } from "../../hooks/useHistorico";
import estilos from "./Historico.module.css";

function chaveData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return ano + "-" + mes + "-" + dia;
}

export default function Historico() {
    const navigate = useNavigate();
    const { movimentacoes, carregando, erro } = useHistorico();
    const [dataSelecionada, setDataSelecionada] = useState(() => chaveData(new Date()));

    const movimentosDoDia = movimentacoes
        .filter((movimento) => chaveData(movimento.data) === dataSelecionada)
        .sort((a, b) => b.data.getTime() - a.data.getTime());

    const dataFormatada = dataSelecionada.split("-").reverse().join("/");

    if (carregando) return <p role="status">Carregando movimentações...</p>;
    if (erro) return <p role="alert">Não foi possível carregar o histórico: {erro}</p>;

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
                <button
                    className={"botao-leve " + estilos.hoje}
                    onClick={() => setDataSelecionada(chaveData(new Date()))}
                >
                    Hoje
                </button>
            </div>

            <div className={estilos.conteudo}>
                <h2 className={estilos.mes}>Movimentações de {dataFormatada}</h2>
                <p className={estilos.resumo}>{movimentosDoDia.length} movimentações</p>
                <div className={"superficie " + estilos.tabelaContainer}>
                    <table
                        className={"tabela-dados " + estilos.tabela}
                        aria-label={"Movimentações de " + dataFormatada}
                    >
                        <thead>
                            <tr>
                                {[
                                    "Horário",
                                    "Produto",
                                    "Marca",
                                    "Código",
                                    "Quantidade",
                                    "Movimento",
                                    "Valor total",
                                ].map((titulo) => (
                                    <th key={titulo} scope="col" className={estilos.tipo}>
                                        {titulo}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {movimentosDoDia.map((movimento) => (
                                <tr key={movimento.id}>
                                    <td>
                                        {movimento.data.toLocaleTimeString("pt-BR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                    <td>{movimento.nomeProduto || movimento.codigoProduto}</td>
                                    <td>{movimento.marcaProduto}</td>
                                    <td>{movimento.codigoProduto}</td>
                                    <td>{movimento.quantidade}</td>
                                    <td>
                                        {movimento.entrasai === "entrada" ? "Entrada" : "Saída"}
                                    </td>
                                    <td>
                                        {movimento.precoTotal.toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
