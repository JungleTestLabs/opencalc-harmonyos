# Delta Design: 实时预览结果

## 复杂度评估
- **等级**：S（简单）
- **跳过**：step7 架构设计（无架构影响，单文件改动）

## 设计方案

### 修改点

**文件**：`entry/src/main/ets/pages/CalculatorPage.ets`

### 新增状态

```typescript
@State livePreview: string = ''  // 预览结果
```

### 新增方法：updateLivePreview()

```
updateLivePreview():
  1. expression 为空 → livePreview = ''; return
  2. ErrorFlags.reset()
  3. try:
     a. clean = expr.getCleanExpression(expression, '.', ',')
     b. raw = engine.evaluate(clean, !radianMode)
     c. 检查 ErrorFlags (division_by_0/domain_error/syntax_error/is_infinity/require_real_number)
        → 任意为 true → livePreview = ''; return
     d. livePreview = NumberFormatter.format(raw, '.', ',', INTERNATIONAL)
  4. catch → livePreview = ''  (静默处理，不抛错)
```

### 按钮事件修改

所有按钮事件末尾追加 `this.updateLivePreview()`：
- `onDigit/onOp/onFunc/onConst`：expression 追加后调用
- `onBS`：删除字符后调用
- `onAC`：直接清空 `livePreview`（无需计算）

### UI 布局修改

DisplayPanel 中，在表达式行与结果/错误行之间新增预览行：

```
┌──────────────────────────────┐
│  123 + 45        (表达式行)    │
│  = 168            (预览行)    │  ← 新增
│  168              (结果行)    │
└──────────────────────────────┘
```

预览行特性：
- 字号略小于结果（14-16 vs 28-36）
- 颜色使用运算符色（getOp()），与结果区分
- 仅当 `livePreview` 非空且无错误时显示
- 横竖屏自适应字号

### 伪代码

```typescript
// DisplayPanel 中新增
if (this.livePreview.length > 0 && this.errorMsg.length === 0) {
  Text(this.livePreview)
    .fontSize(this.isLandscape ? 14 : 16)
    .fontColor(this.getOp())
    .width('100%').textAlign(TextAlign.End)
    .padding({ right: 12, left: 12, top: 2, bottom: 2 })
}
```

### 影响范围
- CalculatorPage.ets：+33 −6 行
- 无其他文件修改

### 验证方法
- 编译：`hvigorw assembleHap`
- 功能：见 apply-report.md 中的验证清单
