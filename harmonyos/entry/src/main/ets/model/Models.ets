// OpenCalc — Data Models
// Ported from: Models.kt (multiple files)

/** Calculation error types */
export enum CalculatorError {
  NONE = 'none',
  DIVISION_BY_ZERO = 'division_by_zero',
  DOMAIN_ERROR = 'domain_error',
  SYNTAX_ERROR = 'syntax_error',
  INFINITY = 'infinity',
  REQUIRE_REAL = 'require_real_number'
}

/** Numbering system for digit grouping */
export enum NumberingSystem {
  INTERNATIONAL = 0,
  INDIAN = 1
}

/** Scientific mode toggle states */
export enum ScientificModeType {
  NOT_ACTIVE = 0,
  ACTIVE = 1,
  OFF = 2
}

/** History entry */
export interface HistoryItem {
  id: number
  expression: string
  result: string
  timestamp: number
}

/** Calculator preferences (stored in @ohos.data.preferences) */
export interface CalculatorPreferences {
  theme: number
  forceDayNight: number
  vibrationEnabled: boolean
  preventSleep: boolean
  historySize: number
  scientificModeDefault: number
  radiansDefault: boolean
  numberPrecision: number
  decimalSeparatorSymbol: string
  groupingSeparatorSymbol: string
}

/** Default preferences */
export const DEFAULT_PREFERENCES: CalculatorPreferences = {
  theme: 0,
  forceDayNight: 0,
  vibrationEnabled: true,
  preventSleep: false,
  historySize: 100,
  scientificModeDefault: ScientificModeType.NOT_ACTIVE,
  radiansDefault: false,
  numberPrecision: 12,
  decimalSeparatorSymbol: '.',
  groupingSeparatorSymbol: ','
}
