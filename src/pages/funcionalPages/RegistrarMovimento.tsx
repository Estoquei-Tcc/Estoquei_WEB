import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import estilos from "./RegistrarMovimento.module.css";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useProdutos } from "../../hooks/useProdutos";
import { useHistorico } from "../../hooks/useHistorico";

type movimentoFormValues = {
    codigoProduto: number;
    quantidade: number;
    entrasai: "entrada" | "saida";
    preco?: number;
    unitot?: string;
}

const registroSchema = z.object({
    codigoProduto: z.number().min(1, {
        message: "Informe o produto.",
    }),

    quantidade: z.number().min(1, {
        message: "Informe uma quantidade válida.",
    }),

    entrasai: z.enum(["entrada", "saida"]),

    unitot: z.string().optional(),

    preco: z.number().positive( {
        message: "Informe um preço válido.",
    }).optional()
}).refine((dados) => dados.preco === undefined || dados.unitot === "uni" || dados.unitot === "tot", {
    path: ["unitot"],
    message: "Informe se o preço é por unidade ou total."
});

const RegistrarMovimento = () => {

    const { produtos } = useProdutos();
    const { guardarMovimento } = useHistorico();

    const [parametros] = useSearchParams();
    const produtoSelecionado = parametros.get("produto");

    const registroForm = useForm<movimentoFormValues>({
        resolver: zodResolver(registroSchema),
    });

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = registroForm;

    useEffect(() => {
        const escolhido = produtos.find((produto) => produto.id === produtoSelecionado);
        if (escolhido) setValue("codigoProduto", escolhido.codigo);
    }, [produtos, produtoSelecionado, setValue]);

    const registrarMovimento = async (data: movimentoFormValues) => {

        //PROCURAR PRODUTO ESCOLHIDO
        const produto = produtos.find(
            (p) => p.codigo === data.codigoProduto
        );

        if (!produto) {
            alert("Produto não encontrado!");
            return;
        }

        try {
            await guardarMovimento({
                produtoId: produto.id,
                quantidade: data.quantidade,
                entrasai: data.entrasai,
                preco: data.preco,
                unitot: data.unitot,
            });
            alert("Movimento registrado com sucesso!");
        } catch (erro) {
            alert(erro instanceof Error ? erro.message : "Não foi possível registrar o movimento. Tente novamente.");
        }
    };

    return (
        <div className="pagina-app">
            <div className={estilos.conteudo}>
                <form
                    className="superficie"
                    onSubmit={handleSubmit(registrarMovimento)}
                >
                    <div className={estilos.registrar}>
                        <h1>Registrar movimento</h1>

                        <div className={estilos.campo}>
                            <label htmlFor="produto">Produto</label>

                            <select {...register("codigoProduto", {valueAsNumber: true})}>
                                <option disabled>
                                    Selecione um produto
                                </option>

                                {produtos.map((p) => (
                                    <option
                                        key={p.codigo}
                                        value={p.codigo}
                                    >
                                        {p.nome}
                                    </option>
                                ))}
                            </select>

                            {errors.codigoProduto && (
                                <p className={estilos.mensagem}>
                                    {errors.codigoProduto.message}
                                </p>
                            )}
                        </div>

                        <div className={estilos.campo}>
                            <label htmlFor="quantidade">
                                Quantidade
                            </label>

                            <input
                                id="quantidade"
                                placeholder="Quantidade"
                                type="number"
                                {...register("quantidade", {
                                    valueAsNumber: true,
                                })}
                            />

                            {errors.quantidade && (
                                <p className={estilos.mensagem}>
                                    {errors.quantidade.message}
                                </p>
                            )}
                        </div>

                        
                        <div className={estilos.campo}>
                            <label htmlFor="entrasai">
                                Entrada ou saída
                            </label>

                            <select {...register("entrasai")}>
                                <option value="" disabled>
                                    Selecionar
                                </option>

                                <option value="entrada">
                                    Entrada
                                </option>

                                <option value="saida">
                                    Saída
                                </option>
                            </select>

                            {errors.entrasai && (
                                <p className={estilos.mensagem}>
                                    {errors.entrasai.message}
                                </p>
                            )}
                        </div>

                        <div className={estilos.campo}>
                            <label
                                htmlFor="preco"
                                className={estilos.unitotLabel}
                            >
                                Preço
                            </label>

                            <p className={estilos.alerta}>
                                *Esse campo é opcional e só deve ser
                                preenchido caso o preço do produto seja
                                diferente do cadastrado*
                            </p>

                            <input
                                id="preco"
                                step="0.01"
                                min="0.01"
                                placeholder="Preço"
                                type="number"
                                {...register("preco", {
                                    setValueAs: (valor) => valor === "" ? undefined : Number(valor),
                                })}
                            />

                            {errors.preco && <p className={estilos.mensagem}>{errors.preco.message}</p>}

                            <select
                                className={estilos.unitot}
                                defaultValue=""
                                aria-label="Preço por unidade ou total"
                                {...register("unitot")}
                            >
                                <option value="" disabled>
                                    Selecionar
                                </option>

                                <option value="uni">
                                    Unidade
                                </option>

                                <option value="tot">
                                    Total
                                </option>
                            </select>
                            {errors.unitot && <p className={estilos.mensagem}>{errors.unitot.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className={"botao " + estilos.buttonEnviar}
                            disabled={isSubmitting}
                        >
                            Criar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrarMovimento;