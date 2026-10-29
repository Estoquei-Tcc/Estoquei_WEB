import estilos from "./Principal.module.css";

export default function Principal() {
    return (
        <main className={estilos.container}>
            <h1>Principal</h1>
            <div className={estilos.linhaTitulo} aria-hidden="true" />
        </main>
    );
}
