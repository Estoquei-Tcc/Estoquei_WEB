import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import estilos from "./Layout.module.css";
import Cabecalho from "./Cabecalho";
import Menu from "./Menu";
import Rodape from "./Rodape";

export default function Layout() {
    const [celular, setCelular] = useState(() => window.innerWidth <= 1000);
    // No computador começa expandido; no celular começa fechado.
    const [menuAberto, setMenuAberto] = useState(
        () => window.innerWidth > 1000,
    );
    const alternarMenu = () => setMenuAberto((aberto) => !aberto);
    const fecharMenu = () => setMenuAberto(false);

    useEffect(() => {
        const tamanho = window.matchMedia("(max-width: 1000px)");
        const aoMudarTamanho = () => {
            setCelular(tamanho.matches);
            setMenuAberto(!tamanho.matches);
        };
        tamanho.addEventListener("change", aoMudarTamanho);
        return () => tamanho.removeEventListener("change", aoMudarTamanho);
    }, []);

    useEffect(() => {
        if (!celular || !menuAberto) return;
        // Só o menu do celular bloqueia a página de fundo.
        const rolagemAnterior = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const aoApertarTecla = (evento: KeyboardEvent) => {
            if (evento.key === "Escape") setMenuAberto(false);
        };
        document.addEventListener("keydown", aoApertarTecla);
        return () => {
            document.body.style.overflow = rolagemAnterior;
            document.removeEventListener("keydown", aoApertarTecla);
            document.getElementById("botao-menu")?.focus();
        };
    }, [celular, menuAberto]);

    return (
        <>
            <div
                className={
                    estilos.gridContainer +
                    " " +
                    (menuAberto ? estilos.menuExpandido : estilos.menuRecolhido)
                }
                inert={celular && menuAberto}
            >
                <Cabecalho
                    menuAberto={menuAberto}
                    alternarMenu={alternarMenu}
                />
                <main>
                    <Outlet />
                </main>
                <Rodape />
            </div>

            {celular && menuAberto && (
                <button
                    className={estilos.fundoMenu}
                    onClick={fecharMenu}
                    tabIndex={-1}
                    aria-label="Fechar menu"
                />
            )}
            {(!celular || menuAberto) && (
                <Menu
                    celular={celular}
                    compacto={!celular && !menuAberto}
                    alternarMenu={alternarMenu}
                    aoNavegar={() => {
                        if (celular) fecharMenu();
                    }}
                />
            )}
        </>
    );
}
