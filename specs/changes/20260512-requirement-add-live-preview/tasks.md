# 实时预览 开发任务

## 任务概述
- 功能名称：实时预览结果
- 变更类型：新增功能 (requirement-add)
- 开发阶段：IMPLEMENTING
- 预计任务数：1（S 级复杂度，可合并）

## 任务列表

### 任务 1：在 CalculatorPage 新增实时预览功能

**描述**：
1. 新增 `@State livePreview: string = ''` 状态变量
2. 新增 `updateLivePreview()` 方法：每次输入后实时计算当前表达式结果
3. 修改所有按钮事件（onDigit/onOp/onFunc/onConst/onBS/onAC）末尾调用预览刷新
4. 在 DisplayPanel 中表达式行与结果行之间新增预览文本行

**涉及文件**：
- `entry/src/main/ets/pages/CalculatorPage.ets`（修改，+33 −6 行）

**依赖任务**：无

**验收标准**：
1. 编译通过：`hvigorw assembleHap` → BUILD SUCCESSFUL
2. 输入 `1+2` → 预览区显示 `3`
3. 输入 `1÷0` → 预览区不显示（不崩溃）
4. 按 `AC` → 表达式和预览同时清空
5. 原有功能不受影响（历史/主题/横竖屏）

## 开发顺序
```
Task 1 → 完成
```

## 验收计划
| 任务 | 验收方式 |
|------|---------|
| Task 1 | 编译 + 手动功能测试（10项验证，见 apply-report.md） |
