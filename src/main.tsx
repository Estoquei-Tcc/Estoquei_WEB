import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import estilos from "./firebase/FirebaseConexao.module.css";
import Home from "./pages/Home.tsx";
import "./global.css";

function ErroInicializacao() {
    return (
        <main className={estilos.conteiner}>
            <h1 className={estilos.titulo}>Estoquei!</h1>
            <p className={estilos.mensagem} role="alert">
                O login está indisponível no momento. Tente novamente mais tarde.
            </p>
            <Link to="/">Voltar para a página inicial</Link>
        </main>
    );
}

const App = lazy(() => import("./App.tsx").catch(() => ({ default: ErroInicializacao })));

const root = document.getElementById("root");

if (root) {
    createRoot(root).render(
        <StrictMode>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
                <Suspense fallback={<p role="status">Carregando Estoquei…</p>}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<App />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </StrictMode>,
    );
} else {
    console.error("Elemento 'root' não encontrado na DOM.");
}
