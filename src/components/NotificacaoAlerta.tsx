import estilos from "./NotificacaoAlerta.module.css";
import { useProdutos } from "../hooks/useProdutos";

export default function NotificacaoAlerta() {
    const { produtos } = useProdutos();
    const zerados = produtos.filter((produto) => produto.estoque === 0).length;
    const baixos = produtos.filter(
        (produto) => produto.estoque > 0 && produto.estoque <= produto.qtdMin,
    ).length;
    if (zerados + baixos === 0) return null;
    return (
        <div className={estilos.alerta} role="status">
            <span>Reposição de estoque</span>
            <p className={estilos.alertaTexto}>
                <strong>{zerados} produtos esgotados</strong> e{" "}
                <strong>{baixos} com estoque baixo.</strong> Confira antes de
                registrar novas saídas.
            </p>
        </div>
    );
}
