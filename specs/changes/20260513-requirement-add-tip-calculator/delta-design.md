# Delta Design: 小费计算器

## 架构影响

- **层级**: UI 层 + 工具模块层
- **影响范围**: 新增 `converter/TipCalculator.ets`（与已有 UnitConverter 并列），修改 `CalculatorPage.ets`
- **不涉及**: 计算引擎、表达式解析、持久化、网络

## 模块设计

### TipCalculator.ets

```typescript
export class TipCalculator {
  static readonly PRESETS: number[] = [10, 15, 18, 20]

  static calculate(totalAmount: number, people: number, tipPercent: number): TipResult
}

export interface TipResult {
  success: boolean
  perPerson: number    // 人均应付
  tipAmount: number    // 小费金额
  total: number        // 合计
  error: string        // 错误信息
}
```

**计算逻辑**:
1. 校验 people <= 0 → "人数必须大于 0"
2. 校验 totalAmount <= 0 → "金额必须大于 0"
3. 校验 tipPercent < 0 → "小费比例不能为负数"
4. tipAmount = totalAmount × (tipPercent / 100)
5. total = totalAmount + tipAmount
6. perPerson = total / people
7. 所有结果 Math.round(x * 100) / 100 保留 2 位小数

### CalculatorPage.ets 集成

**新增 @State 变量**（7 个）:
- showTip: boolean — 控制显示小费面板
- tipAmount: string — 金额输入
- tipPeople: string — 人数输入
- tipPercent: number — 当前比例（默认 15）
- tipCustomPercent: string — 自定义比例输入
- tipResult: TipResult | null — 计算结果
- tipError: string — 错误信息

**UI 结构**:
- ToggleRow: 新增"小费"按钮
- TipPanel @Builder:
  - 金额 TextInput + 人数 TextInput
  - 预设按钮组（10%/15%/18%/20%），选中高亮
  - 自定义% TextInput（输入后清除预设高亮）
  - "计算"按钮
  - 结果展示：大字体人均 + 明细行（原始/小费/合计）
- 条件渲染: `if (showTip) TipPanel() else ButtonGrid()`

## 数据流

```
用户输入金额+人数+比例 → onTipCalculate()
  → TipCalculator.calculate(amount, people, percent)
  → TipResult { success, perPerson, tipAmount, total, error }
  → 更新 @State tipResult / tipError
  → UI 渲染
```
