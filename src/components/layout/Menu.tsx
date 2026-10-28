import {
    FiX,
    FiChevronsLeft,
    FiChevronsRight,
    FiGrid,
    FiPlusCircle,
    FiPackage,
    FiRepeat,
    FiClock,
    FiBarChart2,
} from "react-icons/fi";
import estilos from "./Menu.module.css";
import Logo from "../../assets/LogoBranca.png";

import { NavLink, Link, useNavigate } from "react-router-dom";

import { RxExit } from "react-icons/rx";

import { useAutenticacao } from "../../hooks/useAutenticacao";

type MenuProps = {
    celular: boolean;
    compacto: boolean;
    alternarMenu: () => void;
    aoNavegar: () => void;
};

export default function Menu({
    celular,
    compacto,
    alternarMenu,
    aoNavegar,
}: MenuProps) {
    const { deslogar } = useAutenticacao();

    const navegacao = useNavigate();
    const sair = async () => {
        await deslogar();
        aoNavegar();
        navegacao("/");
    };

    return (
        <aside
            id="menu-lateral"
            className={`${estilos.container} ${compacto ? estilos.compacto : ""}`}
            role={celular ? "dialog" : undefined}
            aria-modal={celular ? true : undefined}
            aria-label="Menu principal"
        >
            <div className={estilos.topo}>
                <Link
                    to="/principal/dashboard"
                    className={estilos.logo}
                    aria-label="Estoquei, início"
                    onClick={aoNavegar}
                >
                    <img src={Logo} alt="" />
                    <h2>Estoquei!</h2>
                </Link>
                <button
                    type="button"
                    className={estilos.fechar}
                    onClick={alternarMenu}
                    aria-label={
                        celular
                            ? "Fechar menu"
                            : compacto
                              ? "Expandir menu"
                              : "Recolher menu"
                    }
                    autoFocus={celular}
                >
                    {celular ? (
                        <FiX aria-hidden="true" />
                    ) : compacto ? (
                        <FiChevronsRight aria-hidden="true" />
                    ) : (
                        <FiChevronsLeft aria-hidden="true" />
                    )}
                </button>
            </div>

            <nav aria-label="Navegação principal">

                <NavLink
                    onClick={aoNavegar}
                    className={estilos.link}
                    aria-label="Dashboard"
                    title="Dashboard"
                    to="/principal/dashboard"
                >
                    <FiGrid aria-hidden="true" /> <span>Dashboard</span>
                </NavLink>

                <NavLink
                    onClick={aoNavegar}
                    className={estilos.link}
                    aria-label="Cadastro de Produtos"
                    title="Cadastro de Produtos"
                    to="/principal/cadastroProd"
                >
                    <FiPlusCircle aria-hidden="true" />{" "}
                    <span>Cadastro de Produtos</span>
                </NavLink>

                <NavLink
                    onClick={aoNavegar}
                    className={estilos.link}
                    aria-label="Lista de Produtos"
                    title="Lista de Produtos"
                    to="/principal/listaProdutos"
                >
                    <FiPackage aria-hidden="true" />{" "}
                    <span>Lista de Produtos</span>
                </NavLink>

                <NavLink
                    onClick={aoNavegar}
                    className={estilos.link}
                    aria-label="Registrar Movimento"
                    title="Registrar Movimento"
                    to="/principal/registrarMovimento"
                >
                    <FiRepeat aria-hidden="true" />{" "}
                    <span>Registrar Movimento</span>
                </NavLink>

                <NavLink
                    onClick={aoNavegar}
                    className={estilos.link}
                    aria-label="Histórico"
                    title="Histórico"
                    to="/principal/historico"
                >
                    <FiClock aria-hidden="true" /> <span>Histórico</span>
                </NavLink>

                <NavLink
                    onClick={aoNavegar}
                    className={estilos.link}
                    aria-label="Relatórios"
                    title="Relatórios"
                    to="/principal/relatorios"
                >
                    <FiBarChart2 aria-hidden="true" /> <span>Relatórios</span>
                </NavLink>

                <button
                    onClick={sair}
                    aria-label="Sair"
                    title="Sair"
                    className={`${estilos.link} ${estilos.sair}`}
                >
                    <RxExit className={estilos.icone} />
                    <span>Sair</span>
                </button>
            </nav>
        </aside>
    );
}
