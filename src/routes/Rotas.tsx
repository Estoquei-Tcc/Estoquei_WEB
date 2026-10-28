import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";

import Layout from "../components/layout/Layout";

/* import Principal from "../pages/funcionalPages/Principal"; */
import CadastroProdutos from "../pages/funcionalPages/CadastroProdutos";
import Dashboard from "../pages/funcionalPages/Dashboard";
import DetalheProduto from "../pages/funcionalPages/DetalheProduto";
import Historico from "../pages/funcionalPages/Historico";
import ListaProdutos from "../pages/funcionalPages/ListaProdutos";
import RegistrarMovimento from "../pages/funcionalPages/RegistrarMovimento";
import Relatorios from "../pages/funcionalPages/Relatorios";

const Rotas = () => {
    return (
        <BrowserRouter basename="/TCC_Estoquei">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                <Route path="principal" element={<Layout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />

                    <Route path="cadastroProd" element={<CadastroProdutos />} />
                    <Route path="editarProduto/:id" element={<CadastroProdutos />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="detalheProduto/:codigo" element={<DetalheProduto />} />
                    <Route path="historico" element={<Historico />} />
                    <Route path="listaProdutos" element={<ListaProdutos />} />
                    <Route
                        path="registrarMovimento"
                        element={<RegistrarMovimento />}
                    />
                    <Route path="relatorios" element={<Relatorios />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Rotas;
