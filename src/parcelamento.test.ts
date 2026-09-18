import { describe, it, expect } from 'vitest'
import { calcularParcelamento } from './parcelamento'

describe('calcularParcelamento', () => {
    describe('sem juros (1x a 4x)', () => {
        it('retorna o valor total em parcela única quando for 1x', () => {
            expect(calcularParcelamento(1000, 1)).toMatchObject({
                valorParcela: 1000,
                totalParcelas: 1,
            })
        })
        it('divide o valor sem juros quando for 4x', () => {
            expect(calcularParcelamento(1000, 4)).toMatchObject({
                valorParcela: 250,
                totalParcelas: 4,
            })
        })
    })

    describe('com juros', () => {
        it('aplica 5% sobre o total quando for de 5x a 8x', () => {
            expect(calcularParcelamento(1000, 5)).toMatchObject({
                valorParcela: 210,
                totalParcelas: 5,
            })
            expect(calcularParcelamento(1000, 8)).toMatchObject({
                valorParcela: 131.25,
                totalParcelas: 8,
            })
        })
        it('aplica 8% sobre o total quando for de 9x a 12x', () => {
            expect(calcularParcelamento(1000, 9)).toMatchObject({
                valorParcela: 120,
                totalParcelas: 9,
            })
            expect(calcularParcelamento(1000, 12)).toMatchObject({
                valorParcela: 90,
                totalParcelas: 12,
            })
        })
        it('aplica 10% sobre o total quando for de 13x a 18x', () => {
            expect(calcularParcelamento(1000, 13)).toMatchObject({
                valorParcela: 84.62,
                totalParcelas: 13,
            })
            expect(calcularParcelamento(1000, 18)).toMatchObject({
                valorParcela: 61.11,
                totalParcelas: 18,
            })
        })
        it.each([
            [4,  250],
            [5,  210],
            [8,  131.25],
            [9,  120],
            [12, 90],
            [13, 84.62],
        ])('aplica a faixa correta no limite de %ix', (parcelas, esperado) => {
            expect(calcularParcelamento(1000, parcelas).valorParcela).toBe(esperado)
        })
    })

    describe('arredondamento', () => {
        it('arredonda o valor da parcela para 2 casas decimais', () => {
            expect(calcularParcelamento(100, 3)).toMatchObject({
                valorParcela: 33.33,
                totalParcelas: 3,
            })
        })
    })

    describe('valorTotal', () => {
        it('retorna o total sem juros para 1x a 4x', () => {
            expect(calcularParcelamento(1000, 4).valorTotal).toBe(1000)
        })
        it('retorna o total com 5% de juros para 5x a 8x', () => {
            expect(calcularParcelamento(1000, 5).valorTotal).toBe(1050)
        })
        it('retorna o total com 8% de juros para 9x a 12x', () => {
            expect(calcularParcelamento(1000, 9).valorTotal).toBe(1080)
        })
        it('retorna o total com 10% de juros para 13x a 18x', () => {
            expect(calcularParcelamento(1000, 13).valorTotal).toBe(1100)
        })
    })

    describe('ajuste de arredondamento', () => {
        it('soma das parcelas fecha com o valorTotal quando não há diferença', () => {
            const r = calcularParcelamento(1000, 4)
            const soma = r.valorPrimeiraParcelaAjustada + (r.totalParcelas - 1) * r.valorParcela
            expect(soma).toBe(r.valorTotal)
        })
        it('ajusta a primeira parcela para que a soma feche com o valorTotal', () => {
            const r = calcularParcelamento(100, 3)
            expect(r.valorPrimeiraParcelaAjustada).toBe(33.34)
            const soma = r.valorPrimeiraParcelaAjustada + (r.totalParcelas - 1) * r.valorParcela
            expect(soma).toBe(r.valorTotal)
        })
    })

    describe('validações', () => {
        it('lança erro quando o número de parcelas for menor que 1', () => {
            expect(() => calcularParcelamento(1000, 0)).toThrow(
                'Número de parcelas deve ser um inteiro entre 1 e 18'
            )
        })
        it('lança erro quando o número de parcelas for maior que 18', () => {
            expect(() => calcularParcelamento(1000, 19)).toThrow(
                'Número de parcelas deve ser um inteiro entre 1 e 18'
            )
        })
        it('lança erro quando o número de parcelas não for inteiro', () => {
            expect(() => calcularParcelamento(1000, 2.5)).toThrow(
                'Número de parcelas deve ser um inteiro entre 1 e 18'
            )
        })
        it('lança erro quando o valor da compra for zero ou negativo', () => {
            expect(() => calcularParcelamento(0, 3)).toThrow(
                'Valor da compra deve ser maior que zero'
            )
            expect(() => calcularParcelamento(-50, 3)).toThrow(
                'Valor da compra deve ser maior que zero'
            )
        })
    })
})
