# Delta Design: 单位换算功能

## 架构影响

- **层级**: UI 层 + 工具模块层
- **影响范围**: 新增 `converter/UnitConverter.ets`（与已有 TipCalculator 并列），修改 `CalculatorPage.ets`
- **不涉及**: 计算引擎、表达式解析、持久化、网络

## 模块设计

### UnitConverter.ets

**核心数据结构**:
```
interface ParseResult  { value, fromUnit, toUnit }
interface ConvertResult { success, result, error }
```

**常量表**:
- `UNIT_ALIASES`: 12 种单位的别名映射（中英文归一化）
- `LENGTH_FACTORS`: cm_inch(1/2.54), m_feet(3.28084), km_mile(0.621371)
- `WEIGHT_FACTORS`: kg_pound(2.20462), g_ounce(0.035274)

**方法**:
| 方法 | 功能 | 复杂度 |
|------|------|--------|
| normalize(unit) | 别名→标准键（如 "英寸"→"inch"） | O(n×m) |
| sameCategory(u1,u2) | 判断是否同类型 | O(1) |
| getFactor(from,to) | 双向因子查表（含倒数） | O(1) |
| parse(input) | 正则解析 "数字+单位+分隔词+单位" | O(1) |
| convert(value,from,to) | 核心换算（温度公式/长度权重因子） | O(1) |
| evaluate(input) | 一键解析+换算 | O(1) |

**温度特殊处理**（非简单乘法）:
- C→F: value × 9/5 + 32
- F→C: (value - 32) × 5/9

**正则匹配**:
```
/^([+-]?\d+\.?\d*)\s*([a-zA-Z\u4e00-\u9fa5]+)\s*(?:to|in|转|到|=)\s*([a-zA-Z\u4e00-\u9fa5]+)$/i
```
支持分隔词: to / in / 转 / 到 / =

### CalculatorPage.ets 集成

**新增 @State 变量**（4 个）:
- showConverter: boolean — 控制显示换算面板
- converterInput: string — 表达式输入
- converterResult: string — 换算结果
- converterError: string — 错误信息

**UI 结构**:
- ToggleRow: 新增"换算"按钮
- ConverterPanel @Builder:
  - TextInput 表达式输入（placeholder: "如: 100cm to inch"）
  - "换算"按钮
  - 结果/错误展示
- 条件渲染: `if (showConverter) ConverterPanel() else ButtonGrid()`

## 数据流

```
用户输入 "100cm to inch" → onConverter()
  → UnitConverter.evaluate(input)
  → parse() → ParseResult { value:100, fromUnit:"cm", toUnit:"inch" }
  → convert() → getFactor("cm","inch")=1/2.54 → 100×0.3937=39.37
  → Math.round(3937)/100 = 39.37
  → 更新 @State converterResult
  → UI 渲染 "39.37 英寸"
```

## 错误处理流程

```
空输入 → "请输入换算内容"
未知单位 → normalize返回'' → parse返回null → "格式: 数字+单位+to+单位"
不同类型 → sameCategory=false → "暂不支持该单位换算"
同单位 → fromUnit==toUnit → parse返回null → 格式提示
```
