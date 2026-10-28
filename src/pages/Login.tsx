import estilos from "./Login.module.css";

import { useState } from "react";


import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAutenticacao } from "../hooks/useAutenticacao";

import { useNavigate} from "react-router-dom";

type RegisterValues = {
    nome: string
    email: string
    senha: string
}

type LoginValues = {
    email: string
    senha: string
}

const registroSchema = z.object({
    nome: z
        .string()
        .trim()
        .min(2, "Mínimo de 2 caracteres.")
        .max(25, "Máximo de 25 caracteres"),
    email: z.email({ message: "Informe um e-mail válido." }),
    senha: z
        .string()
        .min(6, "Mínimo de 6 caracteres.")
        .max(25, "Máximo de 25 caracteres")
});

const loginSchema = z.object({
    email: z.email({ message: "Informe um e-mail válido." }),
    senha: z
        .string()
        .min(6, "Mínimo de 6 caracteres.")
        .max(25, "Máximo de 25 caracteres")
});

const Login = () => {
    const [ativo, setAtivo] = useState(false);

   
    const registroForm = useForm<RegisterValues>({
        resolver: zodResolver(registroSchema),
    });

    const loginForm = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
    });

    const {
        register: registerLogin,
        handleSubmit: handleSubmitLogin,
        formState: { errors: errorsLogin },
    } = loginForm;

    const {
        register: registerRegistro,
        handleSubmit: handleSubmitRegistro,
        formState: { errors: errorsRegistro },
    } = registroForm;


    const autenticacao = useAutenticacao()

    const criarUsuario = async (data: RegisterValues) => {
        const retornoRegistro = await autenticacao.criarAutenticacaoUsuario(data.email, data.senha, data.nome)

        if(retornoRegistro == "sucesso"){
            alert(`Bem vindo ${data.nome}!`);
            navigate("/principal");
        } else {
            alert(retornoRegistro)
        }
    };

    const autenticarUsuario = async (data: LoginValues) => {
        const retornoLogin = await autenticacao.validarUsuario(data.email, data.senha)

        if(retornoLogin == "sucesso"){
            navigate('/principal')
        } else {
            alert(retornoLogin)
        }
    };

    const navigate = useNavigate();

    return (
        <div className={estilos.container}>
            <div className={estilos.blur}>
                {/*---------------- Separação do painel ----------------*/}
                <div
                    className={`${estilos.modal} ${ativo ? estilos.ativo : ""}`}
                >
                    <div className={estilos.painel}>
                        <div className={estilos.splitRegistro}>
                            <h1>Olá amigo!</h1>
                            <p>
                                Crie sua conta agora para prosseguir e acessar
                                todas as funcionalidades do site
                            </p>
                            <button
                                className={estilos.buttonSplit}
                                onClick={() => setAtivo(true)}
                            >
                                Registrar-se
                            </button>
                        </div>

                        <div className={estilos.splitLogin}>
                            <h1>Bem vindo de volta!</h1>
                            <p>
                                Faça login agora mesmo para prosseguir e acessar
                                todas as funcionalidades
                            </p>
                            <button
                                className={estilos.buttonSplit}
                                onClick={() => setAtivo(false)}
                            >
                                Entrar
                            </button>
                        </div>
                    </div>

                    {/*---------------- LOGIN ----------------*/}
                    <form
                        className={estilos.formLogin}
                        onSubmit={handleSubmitLogin(autenticarUsuario)}
                        method="post"
                    >
                        <div className={estilos.login}>
                            <h1>Fazer login</h1>

                            <p>Use seu e-mail e senha</p>

                            <div className={estilos.campo}>
                                <input
                                    placeholder="Email"
                                    type="text"
                                    {...registerLogin("email")}
                                />
                                {errorsLogin.email && (
                                    <p className={estilos.mensagem}>
                                        {errorsLogin.email.message}
                                    </p>
                                )}
                            </div>

                            <div className={estilos.campo}>
                                <input
                                    placeholder="Senha"
                                    type="password"
                                    {...registerLogin("senha")}
                                />
                                {errorsLogin.senha && (
                                    <p className={estilos.mensagem}>
                                        {errorsLogin.senha.message}
                                    </p>
                                )}
                            </div>

                            <button type='submit' disabled={loginForm.formState.isSubmitting} className={estilos.buttonEnviar}>
                                Entrar
                            </button>
                        </div>
                    </form>

                    {/*---------------- REGISTRO ----------------*/}
                    <form
                        className={estilos.formRegistrar}
                        onSubmit={handleSubmitRegistro(criarUsuario)}
                        method="post"
                    >
                        <div className={estilos.registrar}>
                            <h1>Registrar conta</h1>

                            <p>Use seu e-mail e senha</p>

                            <div className={estilos.campo}>
                                <input
                                    placeholder="Nome"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    minLength={2}
                                    maxLength={25}
                                    {...registerRegistro("nome")}
                                />
                                {errorsRegistro.nome && (
                                    <p className={estilos.mensagem}>
                                        {errorsRegistro.nome.message}
                                    </p>
                                )}
                            </div>

                            <div className={estilos.campo}>
                                <input
                                    placeholder="Email"
                                    type="text"
                                    {...registerRegistro("email")}
                                />
                                {errorsRegistro.email && (
                                    <p className={estilos.mensagem}>
                                        {errorsRegistro.email.message}
                                    </p>
                                )}
                            </div>

                            <div className={estilos.campo}>
                                <input
                                    placeholder="Senha"
                                    type="password"
                                    {...registerRegistro("senha")}
                                />
                                {errorsRegistro.senha && (
                                    <p className={estilos.mensagem}>
                                        {errorsRegistro.senha.message}
                                    </p>
                                )}
                            </div>

                            <button type='submit' disabled={registroForm.formState.isSubmitting} className={estilos.buttonEnviar}>
                                Criar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
