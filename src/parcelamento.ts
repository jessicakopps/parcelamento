export type ResultadoParcelamento = {
    valorParcela: number
    valorPrimeiraParcelaAjustada: number
    valorTotal: number
    totalParcelas: number
}

export function calcularParcelamento(
    valorCompra: number,
    numeroParcelas: number
): ResultadoParcelamento {
    if (valorCompra <= 0) {
        throw new Error('Valor da compra deve ser maior que zero')
    }
    if (!Number.isInteger(numeroParcelas) || numeroParcelas < 1 || numeroParcelas > 18) {
        throw new Error('Número de parcelas deve ser um inteiro entre 1 e 18')
    }

    const juros = calcularJuros(numeroParcelas)
    const valorTotal = round2(valorCompra * (1 + juros))
    const valorParcela = round2(valorTotal / numeroParcelas)
    const valorPrimeiraParcelaAjustada = round2(valorTotal - (numeroParcelas - 1) * valorParcela)

    return {
        valorParcela,
        valorPrimeiraParcelaAjustada,
        valorTotal,
        totalParcelas: numeroParcelas,
    }
}

function calcularJuros(parcelas: number): number {
    if (parcelas <= 4) return 0
    if (parcelas <= 8) return 0.05
    if (parcelas <= 12) return 0.08
    return 0.1
}

function round2(value: number): number {
    return Math.round(value * 100) / 100
}
