import { FiMenu } from "react-icons/fi";
import estilos from "./Cabecalho.module.css";
import { FaRegUserCircle } from "react-icons/fa";
import { useAutenticacao } from "../../hooks/useAutenticacao";

type CabecalhoProps = {
    menuAberto: boolean;
    alternarMenu: () => void;
};

export default function Cabecalho({
    menuAberto,
    alternarMenu,
}: CabecalhoProps) {
    const { usuario, carregando } = useAutenticacao();

    return (
        <header className={estilos.container}>
            <div className={estilos.inicio}>
                <button
                    id="botao-menu"
                    type="button"
                    className={estilos.botaoMenu}
                    onClick={alternarMenu}
                    aria-label={menuAberto ? "Recolher menu" : "Expandir menu"}
                    aria-expanded={menuAberto}
                    aria-controls="menu-lateral"
                >
                    <FiMenu aria-hidden="true" />
                </button>
                <div>
                    <p className={estilos.eyebrow}>Painel de gestão</p>
                    <strong>Controle seu estoque</strong>
                </div>
            </div>
            <span className={estilos.perfil}>
                {carregando
                    ? "Carregando..."
                    : usuario?.nome || usuario?.email || "Usuário"}
                <FaRegUserCircle className={estilos.icone} />
            </span>
        </header>
    );
}
