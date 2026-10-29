import estilos from "./ModalCategoria.module.css";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type Categoria = {
    nome: string;
};

const categoriaSchema = z.object({
    nome: z.string().trim().min(1, {
        message: "Informe a categoria.",
    }),
});

type Props = {
    exibir: boolean;
    ocultar: () => void;
    criarCategoria: (categoria: string) => Promise<void>;
};

export function ModalCategoria({ exibir, ocultar, criarCategoria }: Props) {
    const categoriaForm = useForm<Categoria>({
        resolver: zodResolver(categoriaSchema),
    });

    const {
        register: registerCategoria,
        handleSubmit: handleSubmitCategoria,
        setError,
        reset,
        formState: { errors: errorsCategoria, isSubmitting },
    } = categoriaForm;

    const cadastrarCategoria = async (data: Categoria) => {
        try {
            await criarCategoria(data.nome);
            reset();
        } catch (erro) {
            setError("nome", {
                message:
                    erro instanceof Error
                        ? erro.message
                        : "Não foi possível salvar a categoria.",
            });
        }
    };

    if (!exibir) {
        return null;
    }

    return (
        <div
            className={estilos.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-categoria"
        >
            <div className={estilos.sobrepor}></div>

            <form
                className={"superficie " + estilos.container}
                onSubmit={handleSubmitCategoria(cadastrarCategoria)}
            >
                <h1 id="titulo-categoria">Cadastro de Categoria</h1>

                <div className={estilos.secaoCadastro}>
                    <div className={estilos.campo}>
                        <label htmlFor="nome-categoria">
                            Nome da categoria
                        </label>

                        <input
                            id="nome-categoria"
                            placeholder="Nome"
                            type="text"
                            {...registerCategoria("nome")}
                        />

                        {errorsCategoria.nome && (
                            <p className={estilos.mensagem}>
                                {errorsCategoria.nome.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={"botao " + estilos.buttonEnviar}
                    >
                        Criar
                    </button>

                    <button
                        type="button"
                        className={"botao " + estilos.buttonEnviar}
                        onClick={ocultar}
                        disabled={isSubmitting}
                    >
                        Fechar
                    </button>
                </div>
            </form>
        </div>
    );
}
