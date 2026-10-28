import estilos from "./Home.module.css";

import { useNavigate } from "react-router-dom";

import Logo from "../assets/Logo.png";
import Teclado from "../assets/Teclado2.png";
import Lapis from "../assets/Lapis.png";
import Agenda from "../assets/Agenda.png";

import { FaCashRegister } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { MdTouchApp } from "react-icons/md";

const Home = () => {
    const navigate = useNavigate();

    const IrParaLogin = () => {
        navigate("/login");
    };

    return (
        <div className={estilos.container}>
            <nav className={estilos.navbar}>
                <div className={estilos.logo}>
                    <img src={Logo} alt="Logo Estoquei" />
                    <h2>Estoquei!</h2>
                </div>

                <button onClick={IrParaLogin}>Entrar</button>
            </nav>

            <main className={estilos.conteudo}>
                <div className={estilos.texto}>
                    <h1>
                        <span>Gerenciamento Online </span>
                        do Seu Empreendimento.
                    </h1>
                    <p>Um bom negócio começa pelo gerenciamento!</p>

                    <button onClick={IrParaLogin} className={estilos.comecar}>
                        Começar Agora!
                    </button>
                </div>
                <div className={estilos.imagem} aria-hidden="true">
                    <img src={Teclado} className={estilos.teclado} alt="" />
                    <img src={Lapis} className={estilos.lapis} alt="" />
                    <img src={Agenda} className={estilos.agenda} alt="" />
                </div>
            </main>

            <section className={estilos.secao1}>
                <div className={estilos.sobreNos}>
                    <div className={estilos.cardSobreNos}>
                        <img
                            src="https://static.vecteezy.com/ti/vetor-gratis/p1/19133604-mulher-de-entrega-de-desenho-estilo-plano-dos-desenhos-animados-em-pe-com-gesto-ok-e-simbolo-de-mapa-de-pinos-carregando-caixa-de-embalagem-que-o-cliente-encomendou-para-ser-entregue-com-seguranca-ilustracaoial-de-design-grafico-vetor.jpg"
                            onError={(evento) => {
                                evento.currentTarget.onerror = null;
                                evento.currentTarget.src = Agenda;
                            }}
                            alt="Organização e entrega de produtos"
                            loading="lazy"
                        />{" "}
                    </div>

                    <div className={estilos.textoSobreNos}>
                        <h1 className={estilos.titulo1}>
                            Olá, Somos a Estoquei!{" "}
                        </h1>
                        <h3>
                            Um projeto de TCC da Etec Hortolândia criado para
                            facilitar o gerenciamento de micro-empresas.
                        </h3>
                        <p>
                            Somos uma plataforma desenvolvida com o objetivo de
                            ajudar pequenas empresas e empreendedores no
                            gerenciamento de estoque de forma simples,
                            organizada e eficiente. O sistema foi criado
                            pensando nas dificuldades enfrentadas no controle de
                            produtos, entradas, saídas e acompanhamento de
                            informações importantes do negócio.{" "}
                        </p>
                        <p>
                            Nosso objetivo é oferecer uma solução prática que
                            facilite a administração da empresa, reduzindo erros
                            e melhorando a organização do estoque. A plataforma
                            busca tornar o controle mais rápido, acessível e
                            intuitivo, mesmo para usuários com pouca experiência
                            em sistemas de gestão.
                        </p>
                    </div>
                </div>
            </section>

            <section className={estilos.secao2} aria-labelledby="titulo-solucoes">
                <div className={estilos.solucoes}>
                    <div className={estilos.tituloSolucoes}>
                        <h2 id="titulo-solucoes">Nossas Soluções</h2>
                        <p>Mais organização para o seu negócio, mais tempo para você.</p>
                    </div>

                    <div className={estilos.containerCardsSolucoes}>
                        <div className={estilos.cardSolucao}>
                            <div className={estilos.nomeSolucao}>
                                <FaCashRegister className={estilos.icone} aria-hidden="true" />
                                <h3>Gerenciamento da Empresa</h3>
                            </div>

                            <p className={estilos.textoCard}>
                                Tenha total controle do seu estoque em um só
                                lugar. Cadastre produtos, registre entradas e
                                saídas e acompanhe o saldo em tempo real, sem
                                precisar de planilhas ou anotações em papel.
                            </p>
                        </div>

                        <div className={estilos.cardSolucao}>
                            <div className={estilos.nomeSolucao}>
                                <GiPayMoney className={estilos.icone} aria-hidden="true" />
                                <h3>Serviço Gratuito</h3>
                            </div>

                            <p className={estilos.textoCard}>
                                Acesse o sistema sem pagar nada. Nossa
                                plataforma foi criada para pequenos empresários
                                que precisam de uma solução simples e acessível
                                para organizar o negócio sem custo inicial.
                            </p>
                        </div>

                        <div className={estilos.cardSolucao}>
                            <div className={estilos.nomeSolucao}>
                                <MdTouchApp className={estilos.icone} aria-hidden="true" />
                                <h3>Interface Simples</h3>
                            </div>

                            <p className={estilos.textoCard}>
                                Desenvolvido para quem não tem tanta experiência
                                com tecnologia. De forma rápida e simples você
                                adiciona produtos, registra movimentações e
                                recebe alertas automáticos quando o estoque
                                estiver baixo.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className={estilos.rodape}>
                <h3>Estoquei!</h3>
                <p>Sistema de gerenciamento para controle de microempresas</p>

                <h4>
                    Kauã Padovani • Miguel Camilo • Nicolas Pereira • Paulo
                    Estevão
                </h4>
                <h4>© 2026 — Todos os direitos reservados.</h4>
            </footer>
        </div>
    );
};

export default Home;
