# Tasks: 单位换算功能

## 复杂度: S（单模块 + UI 微调）

| # | 任务 | 文件 | 状态 |
|---|------|------|------|
| 1 | 创建 UnitConverter 模块（解析+换算逻辑） | `converter/UnitConverter.ets` | ✅ done |
| 2 | 修改 CalculatorPage 集成换算 UI | `CalculatorPage.ets` | ✅ done |

## 改动统计

```
entry/src/main/ets/converter/UnitConverter.ets      | 156 ++++++++++++
entry/src/main/ets/pages/CalculatorPage.ets          |  66 ++++-
2 files changed, 220 insertions(+), 2 deletions(-)
```

## 验收对照

| AC | 状态 | 说明 |
|----|------|------|
| AC1 长度换算 | ✅ | cm↔inch(2.54), m↔feet(3.28084), km↔mile(0.621371) |
| AC2 温度换算 | ✅ | C↔F 公式: F=C*9/5+32, C=(F-32)*5/9 |
| AC3 重量换算 | ✅ | kg↔pound(2.20462), g↔ounce(0.035274) |
| AC4 自然语言 | ✅ | 正则匹配 "数字 单位 (to/in/转/到) 单位" |
| AC5 2位小数 | ✅ | Math.round(result*100)/100 |
| AC6 不支持提示 | ✅ | "暂不支持该单位换算" |
| AC7 原有功能 | ✅ | showConverter=false 时原ButtonGrid完整保留 |
