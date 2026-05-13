# Apply Report: 单位换算功能

## 应用摘要

- 分支: `feat/unit-conversion`
- 修改文件: 2 (1 new + 1 modified)
- 逻辑正确性: 纯算术模块，输入→解析→换算因子→输出，无副作用

## 代码验证

### UnitConverter.ets (156 lines)
- `parse()`: 正则 `/([+-]?\d+\.?\d*)\s*([a-zA-Z\u4e00-\u9fa5]+)\s*(?:to|in|转|到|=)\s*([a-zA-Z\u4e00-\u9fa5]+)/i`
  - 覆盖中英文输入
  - 返回 null 表示格式不符
- `convert()`: 温度用公式，长度/重量用因子表
  - 双向自动支持
  - Math.round 保留 2 位小数
- `evaluate()`: 一键 parse+convert

### CalculatorPage.ets (+66/-2)
- 新增 4 个 @State 变量 (showConverter, converterInput, converterResult, converterError)
- 新增 ConverterPanel @Builder（TextInput + Button + 结果显示）
- 修改 build() 条件判断：showConverter → ConverterPanel，否则 → ButtonGrid
- ToggleRow 增加"换算"按钮
- 原有计算路径完全不受影响（AC7）

## 已知限制

- 不支持复杂表达式混合换算（如 "100cm + 50cm to inch"）
- 不支持面积/体积/速度等其他单位类别
- ⚠️ 本地无 HarmonyOS SDK，无法编译验证 — 需委托爹助在 DevEco Studio 环境编译

## 下一步

需爹助验证:
1. DevEco Studio 编译通过 (BUILD SUCCESSFUL)
2. 模拟器运行测试: 输入 "100cm to inch" → 39.37
3. 回归测试: 基础计算 / 科学计算不受影响
