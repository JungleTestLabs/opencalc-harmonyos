# Delta Spec: 实时预览结果

## Why

当前 OpenCalc 的交互模式是"输入 → 按等号 → 看到结果"，用户需要完成输入并按键才能知道计算结果。这违背了"所见即所得"的现代 UX 趋势。新增实时预览功能后，用户每输入一个字符都能立即看到当前表达式的计算结果，无需按等号。

## What Changes

- **CalculatorPage.ets**：
  - 新增 `@State livePreview: string = ''` — 预览结果状态
  - 新增 `updateLivePreview()` 方法 — 每次输入后实时计算并更新预览
  - 修改所有按钮事件（onDigit/onOp/onFunc/onConst/onBS/onAC）末尾调用 preview 刷新
  - DisplayPanel 新增预览文本行 — 在表达式和结果之间，运算符色小字显示
- **不修改**：Calculator.ets、Expression.ets、NumberFormatter.ets（全部复用已有 API）

## Acceptance Criteria

| # | 验证项 | 输入 | 预期结果 |
|---|--------|------|---------|
| 1 | 实时预览显示 | 输入 `1+2` | 预览区显示 `3` |
| 2 | 连算预览 | 继续输 `×3` | 预览区显示 `9` |
| 3 | 三角预览 | 输入 `sin(30)` | 预览区显示 `0.5`（角度模式） |
| 4 | 不完整表达式容错 | 输入 `1÷` | 预览区不显示（不崩溃） |
| 5 | 除零容错 | 输入 `1÷0` | 预览区不显示（不崩溃） |
| 6 | 优先级正确 | 输入 `4+5×2` | 预览区显示 `14` |
| 7 | AC 清空预览 | 按 `AC` | 表达式和预览同时清空 |
| 8 | 等号行为不变 | 按 `=` | 结果写入历史，行为与之前一致 |
| 9 | 编译通过 | `hvigorw assembleHap` | BUILD SUCCESSFUL |
| 10 | 原有功能不受影响 | 历史/主题/横竖屏 | 全部正常 |

## Non-Goals

- ❌ 不修改计算引擎（Calculator.ets）
- ❌ 不修改表达式预处理（Expression.ets）
- ❌ 不修改数字格式化（NumberFormatter.ets）
- ❌ 不新增数据模型
- ❌ 不新增存储功能
- ❌ 不改变等号按钮行为
