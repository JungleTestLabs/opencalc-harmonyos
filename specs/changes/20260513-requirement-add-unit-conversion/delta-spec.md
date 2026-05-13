# Delta Spec: 单位换算功能

## 验收标准

- [ ] AC1: 长度换算 (cm↔inch, m↔feet, km↔mile)
- [ ] AC2: 温度换算 (C↔F)
- [ ] AC3: 重量换算 (kg↔pound, g↔ounce)
- [ ] AC4: 自然语言输入 ("100cm to inch" / "100厘米转英寸")
- [ ] AC5: 结果保留 2 位小数
- [ ] AC6: 不支持的单位 → "暂不支持该单位换算"
- [ ] AC7: 原有四则运算不受影响

## 设计约束

- 新增 `converter/UnitConverter.ets`（独立模块）
- 修改 `CalculatorPage.ets`：增加"换算"模式按钮 + 换算 UI
- 不影响 `Expression.ets` / `CalcEngine` / `NumberFormatter`
- 使用 @State 管理换算状态
- 正则匹配自然语言输入模式

## 文件改动清单

| 文件 | 操作 | 预计行数 |
|------|------|----------|
| `entry/src/main/ets/converter/UnitConverter.ets` | 新增 | ~120 行 |
| `entry/src/main/ets/pages/CalculatorPage.ets` | 修改 | +~30 行 |

## 依赖

无外部依赖。纯 ArkTS 实现。
