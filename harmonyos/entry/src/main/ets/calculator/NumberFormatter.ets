// OpenCalc — NumberFormatter
// Ported from: NumberFormatter.kt (133 lines)
// Pure logic — no Android dependencies

import { NumberingSystem } from '../model/Models'

/**
 * Formats a calculation result with digit grouping and decimal separators.
 * Supports International (3-digit groups) and Indian numbering systems.
 */
export class NumberFormatter {
  static format(
    text: string,
    decimalSeparatorSymbol: string,
    groupingSeparatorSymbol: string,
    numberingSystem: NumberingSystem = NumberingSystem.INTERNATIONAL
  ): string {
    const textNoSeparator: string = NumberFormatter.removeSeparators(text, groupingSeparatorSymbol)
    const numbersList: string[] = NumberFormatter.extractString(textNoSeparator, decimalSeparatorSymbol)
    const numbersWithSeparators: string[] = NumberFormatter.addSeparators(
      numbersList, decimalSeparatorSymbol, groupingSeparatorSymbol, numberingSystem
    )

    let result: string = ''
    for (let i: number = 0; i < numbersWithSeparators.length; i++) {
      result += numbersWithSeparators[i]
    }
    return result
  }

  private static extractString(text: string, decimalSeparatorSymbol: string): string[] {
    const result: string[] = []
    let currentNumber: string = ''

    for (let i: number = 0; i < text.length; i++) {
      const char: string = text.charAt(i)
      if (NumberFormatter.isDigit(char) || char === decimalSeparatorSymbol) {
        currentNumber += char
      } else {
        if (currentNumber.length > 0) {
          result.push(currentNumber)
          currentNumber = ''
        }
        result.push(char)
      }
    }

    if (currentNumber.length > 0) {
      result.push(currentNumber)
    }

    return result
  }

  private static addSeparators(
    numbersList: string[],
    decimalSeparatorSymbol: string,
    groupingSeparatorSymbol: string,
    numberingSystem: NumberingSystem
  ): string[] {
    const result: string[] = []
    for (let i: number = 0; i < numbersList.length; i++) {
      const item: string = numbersList[i]
      if (item.indexOf(decimalSeparatorSymbol) !== -1) {
        if (item.charAt(0) === decimalSeparatorSymbol) {
          result.push(item)
        } else {
          const idx: number = item.indexOf(decimalSeparatorSymbol)
          const integersPart: string = item.substring(0, idx)
          const fractions: string = item.substring(idx + 1)
          result.push(
            NumberFormatter.formatIntegers(integersPart, groupingSeparatorSymbol, numberingSystem === NumberingSystem.INTERNATIONAL) +
            decimalSeparatorSymbol + fractions
          )
        }
      } else {
        result.push(NumberFormatter.formatIntegers(item, groupingSeparatorSymbol, numberingSystem === NumberingSystem.INTERNATIONAL))
      }
    }
    return result
  }

  private static formatIntegers(
    integers: string,
    groupingSeparatorSymbol: string,
    isInternational: boolean
  ): string {
    if (isInternational) {
      // Reverse → chunk by 3 → join → reverse
      const reversed: string = integers.split('').reverse().join('')
      const chunks: string[] = []
      for (let i: number = 0; i < reversed.length; i += 3) {
        chunks.push(reversed.substring(i, i + 3))
      }
      return chunks.join(groupingSeparatorSymbol).split('').reverse().join('')
    } else {
      return NumberFormatter.formatIndianNumberingSystem(integers)
    }
  }

  private static removeSeparators(text: string, groupingSeparatorSymbol: string): string {
    // Replace all occurrences
    let result: string = text
    while (result.indexOf(groupingSeparatorSymbol) !== -1) {
      result = result.replace(groupingSeparatorSymbol, '')
    }
    return result
  }

  private static formatIndianNumberingSystem(numberStr: string): string {
    const isNegative: boolean = numberStr.charAt(0) === '-'
    const numberWithoutSign: string = isNegative ? numberStr.substring(1) : numberStr

    const dotIdx: number = numberWithoutSign.indexOf('.')
    const integerPart: string = dotIdx >= 0 ? numberWithoutSign.substring(0, dotIdx) : numberWithoutSign
    const decimalPart: string = dotIdx >= 0 ? numberWithoutSign.substring(dotIdx + 1) : ''

    const length: number = integerPart.length
    const chars: string[] = []
    let count: number = 0

    for (let i: number = length - 1; i >= 0; i--) {
      chars.push(integerPart.charAt(i))
      count++

      if (count === 3 && i !== 0) {
        chars.push(',')
        count = 0
      } else if (count === 2 && i !== 0 && length - i > 3) {
        chars.push(',')
        count = 0
      }
    }

    const formattedIntegerPart: string = chars.reverse().join('')
    const formattedNumber: string = decimalPart.length > 0 ?
      formattedIntegerPart + '.' + decimalPart : formattedIntegerPart
    return isNegative ? '-' + formattedNumber : formattedNumber
  }

  private static isDigit(char: string): boolean {
    return char >= '0' && char <= '9'
  }
}
