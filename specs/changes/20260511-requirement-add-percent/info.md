# 代码仓理解 (info.md)

## 项目结构
```
entry/src/main/ets/
├── calculator/
│   ├── Calculator.ets    — 计算引擎（递归下降解析器）
│   ├── Expression.ets    — 表达式预处理（含百分比逻辑 getPercentString）
│   └── NumberFormatter.ets — 数字格式化
├── model/
│   ├── Models.ets        — 数据模型
│   └── ErrorFlags.ets    — 错误标志
├── pages/
│   ├── CalculatorPage.ets — 主页面（按钮布局+交互）
│   └── Index.ets         — 入口页
└── preferences/
    └── PreferencesStore.ets — 偏好存储
```

## 百分比逻辑现状

Expression.ets 的 `getPercentString()`（第169-255行）已完整实现：
- `A+B%` → `A + A*(B/100)` （加法/减法）
- `A*B%` → `A*(B/100)` （乘法/除法）
- `B%` → `(B/100)` （单独百分比）

## CalculatorPage.ets 按钮布局

按钮通过 `@Builder` 函数构建，使用 Grid 布局。需在基础键盘区域增加 % 按钮。

关键代码段：
- `build()` 方法：决定横竖屏布局
- `buildButtonGrid()` 或类似：构建按钮网格
- `onButtonPress(text: string)`：处理按钮点击

## 改动范围
- CalculatorPage.ets：+5行（1个按钮定义 + 1行GridItem布局）
- 无其他文件改动
