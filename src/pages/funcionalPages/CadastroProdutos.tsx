import estilos from "./CadastroProdutos.module.css";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { ModalCategoria } from "../../components/ModalCategoria";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useProdutos } from "../../hooks/useProdutos";
import { type StatusTipo } from "../../types/StatusTipo";

type cadastroFormValues = {
    nome: string;
    descricao: string;
    categoria: string;
    marca: string;
    precoCusto: number;
    precoVenda: number;
    fornecedor: string;
    estoque: number;
    qtdMin: number;
    qtdMax: number;
}

const cadastroSchema = z.object({
    nome: z.string().min(1),
    descricao: z.string().min(1),
    categoria: z.string().min(1).refine((valor) => valor !== "adicionar", "Selecione uma categoria."),
    marca: z.string().min(1),
    precoCusto: z.number().min(1),
    precoVenda: z.number().min(1),
    fornecedor: z.string().min(1),
    estoque: z.number().min(0),
    qtdMin: z.number().min(1),
    qtdMax: z.number().min(1)
});

const CadastroProdutos = () => {

    const { id } = useParams<{ id: string }>();
    const editando = Boolean(id);
    const preenchido = useRef<string | null>(null);
    const cadastroForm = useForm<cadastroFormValues>({
        resolver: zodResolver(cadastroSchema)
    });

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = cadastroForm;

    const { adicionarProduto, editarProduto, adicionarCategoria, categorias, produtos, carregando, erro } = useProdutos();

    const produtoEdicao = produtos.find((produto) => produto.id === id);
    useEffect(() => {
        if (!id) {
            if (preenchido.current) reset({ categoria: "" });
            preenchido.current = null;
        } else if (produtoEdicao && preenchido.current !== id) {
            reset(produtoEdicao);
            preenchido.current = id;
        }
    }, [id, produtoEdicao, reset]);

    const navigation = useNavigate();

    const [modalVisivel, setModalVisivel] = useState(false);
    const [categoriaRecente, setCategoriaRecente] = useState("");


    const cadastrarProduto = async (data: cadastroFormValues) => {

        let status: StatusTipo;

        if (data.estoque === 0) {
            status = "Esgotado";
        } else if (data.estoque <= data.qtdMin) {
            status = "Baixo";
        } else if (data.estoque >= data.qtdMax) {
            status = "Cheio";
        } else {
            status = "Normal";
        }

        const produto = {
            nome: data.nome,
            descricao: data.descricao,
            categoria: data.categoria,
            marca: data.marca,
            precoCusto: data.precoCusto,
            precoVenda: data.precoVenda,
            fornecedor: data.fornecedor,
            estoque: data.estoque,
            qtdMin: data.qtdMin,
            qtdMax: data.qtdMax,
            status: status
        };
 

        try {
            if (editando) {
                if (!produtoEdicao) throw new Error("Produto não encontrado.");
                await editarProduto({ ...produtoEdicao, ...produto });
            } else {
                await adicionarProduto(produto);
            }
            navigation("/principal/listaProdutos");
        } catch {
            alert("Não foi possível salvar o produto. Tente novamente.");
        }
    };

    const ocultarModal = () => {
        setModalVisivel(false);
    };

    const cadastrarCategoria = async (categoria: string) => {
        const nome = await adicionarCategoria(categoria);
        setCategoriaRecente(nome);
        setValue("categoria", nome, { shouldValidate: true, shouldDirty: true });
        setModalVisivel(false);
    };

    if (carregando) return <p role="status">Carregando produtos e categorias...</p>;
    if (erro) return <p role="alert">Não foi possível carregar os dados: {erro}</p>;
    if (editando && !produtoEdicao) return <p role="status">Produto não encontrado.</p>;

    return (
        <div className="pagina-app">

            <h2 className="titulo-pagina">
                {editando ? "Editar produto" : "Cadastro de Produto"}
            </h2>

            <p className={"subtitulo-pagina " + estilos.descricao}>
                {editando ? "Atualize as informações do produto. Para alterar o estoque, registre uma movimentação." : "Preencha as informações abaixo para cadastrar um novo produto."}
            </p>

            {Object.keys(errors).length > 0 && <p role="alert">Confira os campos obrigatórios e os valores informados.</p>}
            <form
                className={"superficie " + estilos.formProduto}
                onSubmit={handleSubmit(cadastrarProduto)}
            >

                {/* ------------- SEÇÃO DE INFORMAÇÕES BÁSICAS ------------- */}

                <section className={estilos.secaoCadastro}>

                    <div className={estilos.campo}>

                        <label htmlFor="nome">
                            Nome do produto
                        </label>

                        <input
                            id="nome"
                            type="text"
                            placeholder="Digite o nome do produto"
                            {...register("nome")}
                        />

                    </div>

                    <div className={estilos.campo}>

                        <label htmlFor="descricao">
                            Descrição
                        </label>

                        <textarea
                            id="descricao"
                            placeholder="Digite a descrição do produto..."
                            {...register("descricao")}
                        />

                    </div>

                </section>


                {/* ------------- SEÇÃO DE CATEGORIAS E MARCAS ------------- */}

                <section className={estilos.secaoCadastro}>

                    <div className={estilos.campo}>

                        <label htmlFor="categoria">
                            Categoria
                        </label>

                        <select
                            id="categoria"
                            defaultValue=""
                            {...register("categoria", {
                                onChange: (evento) => {
                                    if (evento.target.value === "adicionar") {
                                        setValue("categoria", produtoEdicao?.categoria ?? "");
                                        setModalVisivel(true);
                                    }
                                },
                            })}
                        >

                            <option value="" disabled>
                                Selecione uma categoria
                            </option>

                            {(categoriaRecente && !categorias.includes(categoriaRecente) ? [...categorias, categoriaRecente] : categorias).map((categoria) => (
                                <option
                                    key={categoria}
                                    value={categoria}
                                >
                                    {categoria}
                                </option>
                            ))}

                            <option value="adicionar">
                                Adicionar
                            </option>
                        </select>

                    </div>


                    <div className={estilos.campo}>

                        <label htmlFor="marca">
                            Marca
                        </label>

                        <input
                            id="marca"
                            type="text"
                            placeholder="Digite a marca"
                            {...register("marca")}
                        />

                    </div>

                </section>


                {/* --------- SEÇÃO DE ESTOQUE E LIMITES ------------ */}

                <section
                    className={`${estilos.secaoCadastro} ${estilos.secao3}`}
                >

                    <div className={estilos.campo}>

                        <label htmlFor="estoque">
                            Estoque
                        </label>

                        <input
                            id="estoque"
                            readOnly={editando}
                            type="number"
                            placeholder="0"
                            {...register("estoque", {
                                valueAsNumber: true
                            })}
                        />

                    </div>

                    <div className={estilos.campo}>

                        <label htmlFor="qtdMin">
                            Quantidade mínima:
                        </label>

                        <input
                            id="qtdMin"
                            type="number"
                            placeholder="0"
                            {...register("qtdMin", {
                                valueAsNumber: true
                            })}
                        />

                    </div>

                    <div className={estilos.campo}>

                        <label htmlFor="qtdMax">
                            Quantidade máxima:
                        </label>

                        <input
                            id="qtdMax"
                            type="number"
                            placeholder="0"
                            {...register("qtdMax", {
                                valueAsNumber: true
                            })}
                        />

                    </div>

                </section>


                {/* ------------- SEÇÃO DE VALORES E FORNECEDOR ------------- */}

                <section
                    className={`${estilos.secaoCadastro} ${estilos.secao3}`}
                >

                    <div className={estilos.campo}>

                        <label htmlFor="precoCusto">
                            Preço de custo
                        </label>

                        <input
                            id="precoCusto"
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            {...register("precoCusto", {
                                valueAsNumber: true
                            })}
                        />

                    </div>

                    <div className={estilos.campo}>

                        <label htmlFor="precoVenda">
                            Preço de venda
                        </label>

                        <input
                            id="precoVenda"
                            type="number"
                            placeholder="0,00"
                            {...register("precoVenda", {
                                valueAsNumber: true
                            })}
                        />

                    </div>

                    <div className={estilos.campo}>

                        <label htmlFor="fornecedor">
                            Fornecedor
                        </label>

                        <input
                            id="fornecedor"
                            type="text"
                            placeholder="Digite o fornecedor"
                            {...register("fornecedor")}
                        />

                    </div>

                </section>


                {/* ------------- SEÇÃO BOTÃO CADASTRAR ------------- */}

                <section className={estilos.secaoCadastro}>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar produto"}
                    </button>
                    {editando && <button type="button" disabled={isSubmitting} onClick={() => navigation("/principal/detalheProduto/" + produtoEdicao?.codigo)}>Cancelar</button>}

                </section>

            </form>


            <ModalCategoria
                exibir={modalVisivel}
                ocultar={ocultarModal}
                criarCategoria={cadastrarCategoria}
            />

        </div>
    );
};

export default CadastroProdutos;

