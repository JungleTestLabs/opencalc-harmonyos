# apply-report — 实时预览功能

## 变更摘要

| 维度 | 内容 |
|------|------|
| 分支 | `feat/live-preview` |
| 文件 | `entry/src/main/ets/pages/CalculatorPage.ets` |
| 改动 | +33 −6 行 |
| 复杂度 | S（单文件，无架构变更） |

## 改动点

1. **新增 `@State livePreview: string = ''`** — 预览结果状态
2. **新增 `updateLivePreview()` 方法** — 每次输入后调用 `Expression.getCleanExpression()` + `CalcEngine.evaluate()`，错误时静默清空预览
3. **所有按钮事件挂载预览刷新** — `onDigit/onOp/onFunc/onConst/onBS` 末尾调用 `updateLivePreview()`，`onAC` 直接清空 `livePreview`
4. **DisplayPanel 新增预览行** — 在表达式行与结果行之间，运算符色小字显示，仅当无错误时展示

## 验收标准对照

| AC | 实现方式 | 状态 |
|----|---------|------|
| AC1: 输入时等号上方显示实时结果 | DisplayPanel 中新增 `livePreview` 行 | ✅ 已实现 |
| AC2: 每字符实时更新 | 所有按钮事件末尾调用 `updateLivePreview()` | ✅ 已实现 |
| AC3: 错误表达式不崩溃 | try-catch + ErrorFlags 检查，静默清空预览 | ✅ 已实现 |
| AC4: 按等号写入历史 | `onEquals()` 未改动，行为不变 | ✅ 已实现 |
| AC5: 原有功能不受影响 | 仅新增代码路径，未修改现有逻辑 | ✅ 逻辑正确 |

## ⚠️ 本地无 SDK，待验证

本机为 macOS，无 HarmonyOS DevEco Studio / hvigorw，无法编译。以下需爹助在 DevEco Studio 环境中验证：

### 编译验证
```bash
hvigorw assembleHap
```

### 功能验证清单
- [ ] 输入 `1+2` → 预览区显示 `3`
- [ ] 继续输入 `×3` → 预览区显示 `9`
- [ ] 输入 `sin(30)` → 预览区显示 `0.5`（角度模式）
- [ ] 输入 `1÷` → 预览区不显示（表达式不完整）
- [ ] 输入 `1÷0` → 预览区不显示（不会崩溃）
- [ ] 按 `=` → 结果写入历史，行为与之前一致
- [ ] 按 `AC` → 表达式和预览同时清空
- [ ] 连续输入 `4+5×2` → 预览区显示 `14`（正确优先级）
- [ ] 原有功能正常：历史记录、主题切换、横竖屏切换

### PR 链接
https://github.com/JungleTestLabs/opencalc-harmonyos/pull/new/feat/live-preview
