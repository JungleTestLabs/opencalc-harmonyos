## 需求解析报告 (rq-parse)

### 原始需求
> "在输入表达式的时候，等号上面实时显示预览结果，不用按等号"

### 意图分类
- **类型**：新增功能 (requirement-add)
- **一句话概括**：在计算器输入过程中，实时计算并显示当前表达式的结果预览，改变"必须按等号才知道结果"的核心交互模式

### 领域映射
- **UI/交互**：CalculatorPage.ets 的 DisplayPanel 中新增预览行
- **计算引擎**：复用 CalcEngine.evaluate() + Expression.getCleanExpression()，无需修改引擎代码

### 影响层次
| 层次 | 变更类型 | 说明 |
|------|---------|------|
| View | modify | DisplayPanel 新增预览文本行 |
| ViewModel | modify | 新增 livePreview 状态 + updateLivePreview() 方法 |
| Model | - | 无需变更 |

### 关键实体
- 页面实体：CalculatorPage（按钮事件挂载预览刷新、DisplayPanel 新增预览行）
- 接口实体：CalcEngine.evaluate()、Expression.getCleanExpression()、NumberFormatter.format()（复用，不新增）

### 代码洞察（关键发现）
1. **现有评估链路已完整**：`expression → getCleanExpression() → evaluate() → format()` 可直接用于预览，无需修改引擎
2. **容错需求**：不完整表达式（如 `123+`）会导致 SyntaxError/domain_error。updateLivePreview() 需静默捕获错误而不影响主流程
3. **ErrorFlags 全局状态**：预览调用 evaluate() 会修改 ErrorFlags，需在预览前后 reset/检查，避免污染主计算流程
4. **S 级复杂度**：单文件改动（CalculatorPage.ets），+33 −6 行，无架构变更

### 模糊点
| # | 类别 | 描述 | 严重程度 |
|---|------|------|---------|
| 1 | 交互模糊 | 预览结果显示在哪个位置？表达式下方还是结果区？ | nice-to-have |
| 2 | 行为模糊 | 不完整表达式（如 `1+`）是显示 `1` 还是不显示？ | nice-to-have |

### 复杂度评估
- **等级**：S（简单）
- **理由**：单一领域(UI+ViewModel)，单文件修改。计算引擎完全复用，仅新增 UI 刷新逻辑。

### 备注
- 不影响历史记录写入逻辑（onEquals 不变）
- 不影响原有 button handler 行为（仅追加 updateLivePreview() 调用）
