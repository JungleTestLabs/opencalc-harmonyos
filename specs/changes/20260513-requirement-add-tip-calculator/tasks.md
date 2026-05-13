# Tasks: 小费计算器

## 复杂度: S（单模块 + UI 微调）

| # | 任务 | 文件 | 状态 |
|---|------|------|------|
| 1 | 创建 TipCalculator 模块（计算逻辑+校验） | `converter/TipCalculator.ets` | ✅ done |
| 2 | CalculatorPage 集成小费 UI（状态+Builder+切换） | `CalculatorPage.ets` | ✅ done |

## 改动统计

```
entry/src/main/ets/converter/TipCalculator.ets      |  44 ++++++++
entry/src/main/ets/pages/CalculatorPage.ets          | 117 ++++++++++++++++++++-
specs/changes/20260513-requirement-add-tip-calculator/apply-report.md | 37 +++++++
3 files changed, 196 insertions(+), 2 deletions(-)
```

## 验收对照

| AC | 状态 | 说明 |
|----|------|------|
| AC1 金额/人数输入 | ✅ | tipAmount + tipPeople TextInput |
| AC2 预设+自定义比例 | ✅ | 4 个预设按钮 (10/15/18/20) + 自定义% 输入 |
| AC3 人均2位小数 | ✅ | Math.round(x * 100) / 100 |
| AC4 金额明细 | ✅ | 原始 + 小费 + 合计 三列展示 |
| AC5 人数<=0 提示 | ✅ | "人数必须大于 0" 红色错误提示 |
| AC6 原有功能回归 | ✅ | showTip=false 时 ButtonGrid 完整保留 |
