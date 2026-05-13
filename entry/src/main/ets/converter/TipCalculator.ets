// OpenCalc — 小费计算器模块
// 输入总金额和人数，自动计算每人应付金额（含小费）

export class TipCalculator {
  // 预设小费比例
  static readonly PRESETS: number[] = [10, 15, 18, 20]

  // 计算: totalAmount=总金额, people=人数, tipPercent=小费比例
  // 返回: perPerson=人均, tipAmount=小费额, total=合计
  static calculate(totalAmount: number, people: number, tipPercent: number): TipResult {
    // 人数校验
    if (people <= 0) {
      return { success: false, perPerson: 0, tipAmount: 0, total: 0, error: '人数必须大于 0' }
    }
    // 金额校验
    if (totalAmount <= 0) {
      return { success: false, perPerson: 0, tipAmount: 0, total: 0, error: '金额必须大于 0' }
    }
    // 小费比例校验
    if (tipPercent < 0) {
      return { success: false, perPerson: 0, tipAmount: 0, total: 0, error: '小费比例不能为负数' }
    }

    const tipAmount: number = totalAmount * (tipPercent / 100)
    const total: number = totalAmount + tipAmount
    const perPerson: number = total / people

    return {
      success: true,
      perPerson: Math.round(perPerson * 100) / 100,
      tipAmount: Math.round(tipAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
      error: ''
    }
  }
}

export interface TipResult {
  success: boolean
  perPerson: number
  tipAmount: number
  total: number
  error: string
}
