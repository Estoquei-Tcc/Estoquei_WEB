import estilos from "./Rodape.module.css";

export default function Rodape() {
    return (
         <footer className={estilos.container}>
            <h3>Estoquei!</h3>
            <p>Sistema de gerenciamento para controle de microempresas</p>

            <h4>Kauã Padovani • Miguel Camilo • Nicolas Pereira • Paulo Estevão</h4>
            <h4>© 2026 — Todos os direitos reservados.</h4>
        </footer>
    )
}