# Delta Spec: 小费计算器

## 验收标准

- [ ] AC1: 用户可输入总金额和人数
- [ ] AC2: 支持选择和自定义小费比例（默认 10%、15%、18%、20% 快捷按钮）
- [ ] AC3: 实时显示每人应付金额（含小费），保留 2 位小数
- [ ] AC4: 实时显示总金额明细（原始金额 + 小费 + 合计）
- [ ] AC5: 人数为 0 或负数时给出友好提示
- [ ] AC6: 原有计算功能不受影响（回归测试通过）

## 设计约束

- 新增 `converter/TipCalculator.ets`（独立模块）
- 修改 `CalculatorPage.ets`：增加"小费"模式按钮 + 小费 UI
- 不影响 `Expression.ets` / `CalcEngine` / `NumberFormatter`
- 使用 @State 管理小费计算状态
- 条件渲染隔离（showTip ? TipPanel : ButtonGrid）

## 文件改动清单

| 文件 | 操作 | 预计行数 |
|------|------|----------|
| `entry/src/main/ets/converter/TipCalculator.ets` | 新增 | ~50 行 |
| `entry/src/main/ets/pages/CalculatorPage.ets` | 修改 | +~120 行 |

## 依赖

无外部依赖。纯 ArkTS 实现。
