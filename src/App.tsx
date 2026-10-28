import Rotas from "./routes/Rotas.tsx";
import { AutenticacaoProvider } from "./contexts/AutenticacaoContexto.tsx";
import { ProdutoProvider } from "./contexts/ProdutosContexto.tsx";
import { HistoricoProvider } from "./contexts/HistoricoContexto.tsx";

const App = () => {
    return (
        <AutenticacaoProvider>
            <ProdutoProvider>
                <HistoricoProvider>
                    <Rotas />
                </HistoricoProvider>
            </ProdutoProvider>
        </AutenticacaoProvider>
    );
};

export default App;
