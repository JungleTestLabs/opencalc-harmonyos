// OpenCalc — Preferences Store
// Ported from: MyPreferences.kt (123 lines)
// Wraps @ohos.data.preferences for key-value storage

import { preferences } from '@kit.ArkData'
import { common } from '@kit.AbilityKit'
import {
  CalculatorPreferences,
  DEFAULT_PREFERENCES,
  HistoryItem,
  ScientificModeType
} from '../model/Models'

const PREF_NAME: string = 'opencalc_preferences'

export class PreferencesStore {
  private store: preferences.Preferences | null = null
  private context: common.UIAbilityContext

  constructor(context: common.UIAbilityContext) {
    this.context = context
  }

  async init(): Promise<void> {
    this.store = await preferences.getPreferences(this.context, PREF_NAME)
  }

  // ==================== Theme ====================

  async getTheme(): Promise<number> {
    if (!this.store) return DEFAULT_PREFERENCES.theme
    return await this.store.get('theme', DEFAULT_PREFERENCES.theme) as number
  }

  async setTheme(value: number): Promise<void> {
    if (!this.store) return
    await this.store.put('theme', value)
    await this.store.flush()
  }

  async getForceDayNight(): Promise<number> {
    if (!this.store) return DEFAULT_PREFERENCES.forceDayNight
    return await this.store.get('forceDayNight', DEFAULT_PREFERENCES.forceDayNight) as number
  }

  async setForceDayNight(value: number): Promise<void> {
    if (!this.store) return
    await this.store.put('forceDayNight', value)
    await this.store.flush()
  }

  // ==================== Vibration ====================

  async getVibrationEnabled(): Promise<boolean> {
    if (!this.store) return DEFAULT_PREFERENCES.vibrationEnabled
    return await this.store.get('vibrationEnabled', DEFAULT_PREFERENCES.vibrationEnabled) as boolean
  }

  async setVibrationEnabled(value: boolean): Promise<void> {
    if (!this.store) return
    await this.store.put('vibrationEnabled', value)
    await this.store.flush()
  }

  // ==================== Prevent Sleep ====================

  async getPreventSleep(): Promise<boolean> {
    if (!this.store) return DEFAULT_PREFERENCES.preventSleep
    return await this.store.get('preventSleep', DEFAULT_PREFERENCES.preventSleep) as boolean
  }

  async setPreventSleep(value: boolean): Promise<void> {
    if (!this.store) return
    await this.store.put('preventSleep', value)
    await this.store.flush()
  }

  // ==================== History ====================

  async getHistorySize(): Promise<number> {
    if (!this.store) return DEFAULT_PREFERENCES.historySize
    return await this.store.get('historySize', DEFAULT_PREFERENCES.historySize) as number
  }

  async setHistorySize(value: number): Promise<void> {
    if (!this.store) return
    await this.store.put('historySize', value)
    await this.store.flush()
  }

  async getHistory(): Promise<HistoryItem[]> {
    if (!this.store) return []
    const json: string = await this.store.get('history', '[]') as string
    try {
      return JSON.parse(json) as HistoryItem[]
    } catch (_e) {
      return []
    }
  }

  async setHistory(items: HistoryItem[]): Promise<void> {
    if (!this.store) return
    const maxSize: number = await this.getHistorySize()
    const trimmed: HistoryItem[] = items.slice(0, maxSize)
    await this.store.put('history', JSON.stringify(trimmed))
    await this.store.flush()
  }

  // ==================== Scientific Mode ====================

  async getScientificModeDefault(): Promise<number> {
    if (!this.store) return DEFAULT_PREFERENCES.scientificModeDefault
    return await this.store.get('scientificModeDefault', DEFAULT_PREFERENCES.scientificModeDefault) as number
  }

  async setScientificModeDefault(value: number): Promise<void> {
    if (!this.store) return
    await this.store.put('scientificModeDefault', value)
    await this.store.flush()
  }

  // ==================== Radians / Degrees ====================

  async getRadiansDefault(): Promise<boolean> {
    if (!this.store) return DEFAULT_PREFERENCES.radiansDefault
    return await this.store.get('radiansDefault', DEFAULT_PREFERENCES.radiansDefault) as boolean
  }

  async setRadiansDefault(value: boolean): Promise<void> {
    if (!this.store) return
    await this.store.put('radiansDefault', value)
    await this.store.flush()
  }

  // ==================== Number Precision ====================

  async getNumberPrecision(): Promise<number> {
    if (!this.store) return DEFAULT_PREFERENCES.numberPrecision
    return await this.store.get('numberPrecision', DEFAULT_PREFERENCES.numberPrecision) as number
  }

  async setNumberPrecision(value: number): Promise<void> {
    if (!this.store) return
    await this.store.put('numberPrecision', value)
    await this.store.flush()
  }

  // ==================== Separators ====================

  async getDecimalSeparator(): Promise<string> {
    if (!this.store) return DEFAULT_PREFERENCES.decimalSeparatorSymbol
    return await this.store.get('decimalSeparator', DEFAULT_PREFERENCES.decimalSeparatorSymbol) as string
  }

  async setDecimalSeparator(value: string): Promise<void> {
    if (!this.store) return
    await this.store.put('decimalSeparator', value)
    await this.store.flush()
  }

  async getGroupingSeparator(): Promise<string> {
    if (!this.store) return DEFAULT_PREFERENCES.groupingSeparatorSymbol
    return await this.store.get('groupingSeparator', DEFAULT_PREFERENCES.groupingSeparatorSymbol) as string
  }

  async setGroupingSeparator(value: string): Promise<void> {
    if (!this.store) return
    await this.store.put('groupingSeparator', value)
    await this.store.flush()
  }

  // ==================== Bulk ====================

  async getAllPreferences(): Promise<CalculatorPreferences> {
    return {
      theme: await this.getTheme(),
      forceDayNight: await this.getForceDayNight(),
      vibrationEnabled: await this.getVibrationEnabled(),
      preventSleep: await this.getPreventSleep(),
      historySize: await this.getHistorySize(),
      scientificModeDefault: await this.getScientificModeDefault(),
      radiansDefault: await this.getRadiansDefault(),
      numberPrecision: await this.getNumberPrecision(),
      decimalSeparatorSymbol: await this.getDecimalSeparator(),
      groupingSeparatorSymbol: await this.getGroupingSeparator()
    }
  }
}
