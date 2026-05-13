// OpenCalc — 单位换算模块
// 支持长度、温度、重量的自然语言换算
// 用法: "100cm to inch" / "100厘米转英寸" / "30C to F"

interface ParseResult {
  value: number
  fromUnit: string
  toUnit: string
}

interface ConvertResult {
  success: boolean
  result: number
  error: string
}

// 单位别名表 (归一化键 -> 别名列表)
const UNIT_ALIASES: Record<string, string[]> = {
  'cm':      ['cm', '厘米'],
  'inch':    ['inch', 'in', '英寸'],
  'm':       ['m', '米', 'meter'],
  'feet':    ['feet', 'ft', '英尺'],
  'km':      ['km', '公里', 'kilometer'],
  'mile':    ['mile', 'mi', '英里'],
  'celsius': ['c', 'celsius', '摄氏度'],
  'fahrenheit': ['f', 'fahrenheit', '华氏度'],
  'kg':      ['kg', '千克', '公斤'],
  'pound':   ['pound', 'lb', '磅'],
  'g':       ['g', '克', 'gram'],
  'ounce':   ['ounce', 'oz', '盎司'],
}

// 长度换算因子 (from -> to 的乘数，双向自动处理)
const LENGTH_FACTORS: Record<string, number> = {
  'cm_inch': 1 / 2.54,
  'm_feet':  3.28084,
  'km_mile': 0.621371,
}

// 重量换算因子
const WEIGHT_FACTORS: Record<string, number> = {
  'kg_pound': 2.20462,
  'g_ounce':  0.035274,
}

export class UnitConverter {
  // 将别名归一化为标准键
  private static normalize(unit: string): string {
    const lower: string = unit.toLowerCase().trim()
    const keys: string[] = Object.keys(UNIT_ALIASES)
    for (let i: number = 0; i < keys.length; i++) {
      const k: string = keys[i]
      const aliases: string[] = UNIT_ALIASES[k]
      for (let j: number = 0; j < aliases.length; j++) {
        if (aliases[j] === lower) return k
      }
    }
    return ''
  }

  // 判断两个单位是否同类型
  private static sameCategory(u1: string, u2: string): boolean {
    const length: string[] = ['cm', 'inch', 'm', 'feet', 'km', 'mile']
    const temp: string[] = ['celsius', 'fahrenheit']
    const weight: string[] = ['kg', 'pound', 'g', 'ounce']

    if (length.indexOf(u1) >= 0 && length.indexOf(u2) >= 0) return true
    if (temp.indexOf(u1) >= 0 && temp.indexOf(u2) >= 0) return true
    if (weight.indexOf(u1) >= 0 && weight.indexOf(u2) >= 0) return true
    return false
  }

  // 获取两单位间的换算因子 (from -> to)
  private static getFactor(from: string, to: string): number | null {
    // 尝试 from_to
    const key1: string = from + '_' + to
    if (LENGTH_FACTORS[key1] !== undefined) return LENGTH_FACTORS[key1]
    if (WEIGHT_FACTORS[key1] !== undefined) return WEIGHT_FACTORS[key1]

    // 尝试 to_from 并取倒数
    const key2: string = to + '_' + from
    if (LENGTH_FACTORS[key2] !== undefined) return 1 / LENGTH_FACTORS[key2]
    if (WEIGHT_FACTORS[key2] !== undefined) return 1 / WEIGHT_FACTORS[key2]

    return null
  }

  // 解析输入: "100cm to inch" / "100厘米转英寸" / "30C to F"
  static parse(input: string): ParseResult | null {
    // 匹配模式: 数字 + 单位 + 分隔词 + 单位
    // 分隔词: to, in, 转, 到, =
    const pattern: RegExp = /^([+-]?\d+\.?\d*)\s*([a-zA-Z\u4e00-\u9fa5]+)\s*(?:to|in|转|到|=)\s*([a-zA-Z\u4e00-\u9fa5]+)$/i
    const match: RegExpMatchArray | null = input.match(pattern)
    if (!match) return null

    const value: number = parseFloat(match[1])
    const fromUnit: string = UnitConverter.normalize(match[2])
    const toUnit: string = UnitConverter.normalize(match[3])

    if (!fromUnit || !toUnit) return null
    if (fromUnit === toUnit) return null

    return { value: value, fromUnit: fromUnit, toUnit: toUnit }
  }

  // 执行换算
  static convert(value: number, fromUnit: string, toUnit: string): ConvertResult {
    // 同类型检查
    if (!UnitConverter.sameCategory(fromUnit, toUnit)) {
      return { success: false, result: 0, error: '暂不支持该单位换算' }
    }

    let result: number = 0

    // 温度特殊处理: 非简单乘法
    if ((fromUnit === 'celsius' && toUnit === 'fahrenheit') ||
        (fromUnit === 'fahrenheit' && toUnit === 'celsius')) {
      if (fromUnit === 'celsius') {
        result = value * 9 / 5 + 32
      } else {
        result = (value - 32) * 5 / 9
      }
    } else {
      // 长度/重量: 因子乘法
      const factor: number | null = UnitConverter.getFactor(fromUnit, toUnit)
      if (factor === null) {
        return { success: false, result: 0, error: '暂不支持该单位换算' }
      }
      result = value * factor
    }

    // 保留 2 位小数
    result = Math.round(result * 100) / 100

    return { success: true, result: result, error: '' }
  }

  // 获取单位的标准显示名
  static getDisplayName(unitKey: string): string {
    const display: Record<string, string> = {
      'cm': '厘米', 'inch': '英寸', 'm': '米', 'feet': '英尺',
      'km': '公里', 'mile': '英里', 'celsius': '°C', 'fahrenheit': '°F',
      'kg': '千克', 'pound': '磅', 'g': '克', 'ounce': '盎司'
    }
    return display[unitKey] || unitKey
  }

  // 一键解析+换算
  static evaluate(input: string): ConvertResult {
    const parsed: ParseResult | null = UnitConverter.parse(input)
    if (!parsed) {
      return { success: false, result: 0, error: '格式: 数字+单位+to+单位 (如: 100cm to inch)' }
    }
    return UnitConverter.convert(parsed.value, parsed.fromUnit, parsed.toUnit)
  }
}
