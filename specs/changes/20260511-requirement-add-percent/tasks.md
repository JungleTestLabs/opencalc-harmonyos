# 百分号按钮 开发任务

## 任务概述
- 功能名称：百分号按钮
- 变更类型：新增功能 (requirement-add)
- 开发阶段：IMPLEMENTING
- 预计任务数：1

## 任务列表

### 任务 1：在 CalculatorPage 增加 % 按钮

**描述**：在基础键盘区域增加百分号(%)按钮，点击时追加 `%` 到表达式，利用 Expression.ets 已有逻辑自动计算百分比语义。

**涉及文件**：
- `entry/src/main/ets/pages/CalculatorPage.ets`（修改，~5行新增）

**依赖任务**：无

**验收标准**：
1. 编译通过：`hvigorw assembleHap --mode module` → BUILD SUCCESSFUL
2. `50+10%` → 显示 `55`
3. `100-20%` → 显示 `80`
4. 按钮在键盘可视化区域可见

## 开发顺序
```
Task 1 → 完成
```

## 验收计划
| 任务 | 验收方式 | 
|------|---------|
| Task 1 | 编译 + 手动功能测试 |
