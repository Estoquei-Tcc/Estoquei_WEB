import estilos from "./Relatorios.module.css";

const Relatorios = () => {
    return (
        <div className={estilos.container}>
            <h1 className={estilos.titulo}>Relatório</h1>

            <div className={estilos.cards}>
                {/*---------------- Card gastos ----------------*/}
                <div className={estilos.card}>
                    <div className={estilos.cardContent}>
                        <p className={estilos.cardTitulo}>Gastos</p>
                        <p className={estilos.cardValor}>R$ 740,00</p>
                        <div className={estilos.lista}>
                            <div className={estilos.itemLista}>
                                <span className={estilos.itemLabel}>Fornecedores</span>
                                <span className={estilos.itemValor}>R$ 640,00</span>
                            </div>
                            <div className={estilos.itemLista}>
                                <span className={estilos.itemLabel}>Outros</span>
                                <span className={estilos.itemValor}>R$ 100,00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/*---------------- Card lucro ----------------*/}
                <div className={estilos.card}>
                    <div className={estilos.cardContent}>
                        <p className={estilos.cardTitulo}>Lucro</p>
                        <p className={estilos.cardValor}>R$ 1.240,00</p>
                        <div className={estilos.lista}>
                            <div className={estilos.itemLista}>
                                <span className={estilos.itemLabel}>Receita Total</span>
                                <span className={estilos.itemValor}>R$ 2.130,00</span>
                            </div>
                            <div className={estilos.itemLista}>
                                <span className={estilos.itemLabel}>Gastos Totais</span>
                                <span className={estilos.itemValor}>R$ 640,00</span>
                            </div>
                            <div className={estilos.itemLista}>
                                <span className={estilos.itemLabel}>Lucro líquido</span>
                                <span className={estilos.itemValor}>R$ 1.240,00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/*---------------- Card detalhes ----------------*/}
                <div className={estilos.card}>
                    <div className={estilos.cardContent}>
                        <p className={estilos.cardTitulo}>Detalhes</p>
                        <div className={estilos.lista}>
                            <div className={estilos.itemLista}>
                                <span className={estilos.itemLabel}>Produtos vendidos</span>
                                <span className={estilos.itemValor}>142 un.</span>
                            </div>
                            <div className={estilos.itemLista}>
                                <span className={estilos.itemLabel}>Ticket médio</span>
                                <span className={estilos.itemValor}>R$ 24,30</span>
                            </div>
                            <div className={estilos.itemLista}>
                                <span className={estilos.itemLabel}>Categoria líder</span>
                                <span className={estilos.itemValor}>Alimentos</span>
                            </div>
                            <div className={estilos.itemLista}>
                                <span className={estilos.itemLabel}>Melhor dia</span>
                                <span className={estilos.itemValor}>Sexta-feira</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/*---------------- Card pendencias ----------------*/}
                <div className={estilos.card}>
                    <div className={estilos.cardContent}>
                        <p className={estilos.cardTitulo}>Pendências</p>
                        <div className={estilos.lista}>
                            <div className={estilos.itemPendencia}>
                                <span className={estilos.itemLabel}>Produtos zerados</span>
                                <span className={estilos.badgeZerado}>2</span>
                            </div>
                            <div className={estilos.itemPendencia}>
                                <span className={estilos.itemLabel}>Estoque baixo</span>
                                <span className={estilos.badgeBaixo}>3</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/*---------------- Card relatorio anteriores ----------------*/}
                <div className={estilos.card2}>
                    <div className={estilos.cardContentTabela}>
                        <div className={estilos.cabecalhoTabela}>
                            <span className={estilos.tituloTabela}>Relatórios anteriores</span>
                            <button className={estilos.botaoNovo}>Gerar novo relatório</button>
                        </div>

                        <table className={estilos.tabela}>
                            <thead>
                                <tr>
                                    <th>Período</th>
                                    <th>Tipo</th>
                                    <th>Gerado em</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Junho 2025</td>
                                    <td>Vendas</td>
                                    <td className={estilos.tdMutado}>01/07/2025</td>
                                    <td>
                                        <button className={estilos.botaoBaixar}>Ver detalhes</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Maio 2025</td>
                                    <td>Estoque</td>
                                    <td className={estilos.tdMutado}>01/06/2025</td>
                                    <td>
                                        <button className={estilos.botaoBaixar}>Ver detalhes</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Abril 2025</td>
                                    <td>Gastos</td>
                                    <td className={estilos.tdMutado}>01/05/2025</td>
                                    <td>
                                        <button className={estilos.botaoBaixar}>Ver detalhes</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Relatorios;