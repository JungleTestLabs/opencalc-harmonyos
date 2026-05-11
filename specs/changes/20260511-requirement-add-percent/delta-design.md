# Delta Design: 百分号按钮

## 复杂度评估
- **等级**：S（简单）
- **跳过**：step7 架构设计（无架构影响）

## 设计方案

### 修改点

**文件**：`entry/src/main/ets/pages/CalculatorPage.ets`

**位置**：基础键盘按钮网格，与其他运算符（+-×÷=）同行或相邻

**改动**：
1. 在按钮网格的运算符区域增加 `%` 按钮
2. 点击处理与现有运算符一致：`expression += '%'` 后触发计算

### 伪代码

```
// 按钮定义（在现有的运算符按钮区域）
GridItem() {
  Button('%')
    .onClick(() => this.onButtonPress('%'))
}

// onButtonPress 中无需额外逻辑
// 现有流程：expression += '%' → getCleanExpression() → engine.evaluate()
```

### 按钮放置策略

在竖屏基础键盘中，建议布局：
```
C   ( )  %   ÷
7   8   9   ×
4   5   6   -
1   2   3   +
0   .   ⌫   =
```

百分号放在第一行，与 C（清除）、括号、除号并列。这是多数科学计算器的标准位置。

### 影响范围
- CalculatorPage.ets：~5 行新增
- 无其他文件修改

### 验证方法
- 编译：`hvigorw assembleHap --mode module -p product=default -p buildMode=debug`
- 功能：手动输入 `50+10%` → 确认显示 `55`
