# 代码仓理解 (info.md)

## 项目结构
```
entry/src/main/ets/
├── calculator/
│   ├── Calculator.ets    — 计算引擎（递归下降解析器，evaluate() 返回 number）
│   ├── Expression.ets    — 表达式预处理（getCleanExpression() 清理+转换）
│   └── NumberFormatter.ets — 数字格式化（format() 返回格式化字符串）
├── model/
│   ├── Models.ets        — 数据模型（NumberingSystem, HistoryItem）
│   └── ErrorFlags.ets    — 错误标志（静态 boolean）
├── pages/
│   ├── CalculatorPage.ets — 主页面（按钮布局+交互+显示）
│   └── Index.ets         — 入口页
└── preferences/
    └── PreferencesStore.ets — 偏好存储
```

## 现有评估链路

CalculatorPage.onEquals() 已实现完整评估流程：
```
expression → Expression.getCleanExpression() → CalcEngine.evaluate() → NumberFormatter.format() → result
```

实时预览复用同一链路，区别在于：
- **onEquals**：写入 HistoryItem + 持久化 + 清屏
- **updateLivePreview**：仅更新 UI 状态，不写历史

## CalculatorPage.ets 关键代码段

### 按钮事件（第70-76行）
- `onDigit/onOp/onFunc/onConst`：追加字符到 expression
- `onBS`：删除最后一个字符
- `onAC`：清空 expression + result + errorMsg

### DisplayPanel Builder（第225-253行）
- 表达式行（顶部）
- 结果行 / 错误行（底部）
- 预览行插入位置：表达式行与结果行之间

### 横竖屏适配
- 竖屏：expression fontSize 18, result fontSize 36
- 横屏：expression fontSize 14, result fontSize 28
- 预览行需同步适配字号

## ErrorFlags 注意事项

实时预览调用 evaluate() 会修改 ErrorFlags 全局状态（静态变量）。必须在预览前 reset()，预览后通过 ErrorFlags 判断表达式有效性。

## 改动范围
- CalculatorPage.ets：+33 −6 行
- 无其他文件改动
