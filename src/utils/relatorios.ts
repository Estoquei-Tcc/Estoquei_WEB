import type { MovimentoTipo } from "../types/MovimentoTipo";

export function chaveMes(data: Date): string {
    return data.getFullYear() + "-" + String(data.getMonth() + 1).padStart(2, "0");
}

export function resumirMovimentos(movimentos: MovimentoTipo[]) {
    const entradas = movimentos.filter((item) => item.entrasai === "entrada");
    const saidas = movimentos.filter((item) => item.entrasai === "saida");
    const gastos = entradas.reduce((total, item) => total + item.precoTotal, 0);
    const receita = saidas.reduce((total, item) => total + item.precoTotal, 0);
    return {
        gastos, receita, saldo: receita - gastos,
        unidadesSaida: saidas.reduce((total, item) => total + item.quantidade, 0),
        unidadesEntrada: entradas.reduce((total, item) => total + item.quantidade, 0),
        numeroEntradas: entradas.length,
        numeroSaidas: saidas.length,
        mediaSaida: saidas.length ? receita / saidas.length : 0,
    };
}
