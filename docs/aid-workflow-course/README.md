# AID Workflow 增量开发实战课程

> **AI-Native Development 工作流入门 + 实操**
>
> 课程时长：~3 小时（讲座 1h + 动手实验 2h）
> 适用对象：有基础编程经验的开发者，想学习用 AI 辅助做增量开发
> 前置要求：Git 基础、会写代码（语言不限）、了解 HarmonyOS 基础（可选）

---

## 课程目标

学完本课程后，你将能够：

1. 理解 AID 增量开发流程的 **4 个阶段**（PLANNING → IMPLEMENTING → APPLYING → ARCHIVING）
2. 用 **rq-parse** 方法把自然语言需求解析为结构化设计输入
3. 学会判断需求复杂度（S/M/L/XL）并据此跳过不必要的步骤
4. 写出诚实的 apply-report（用 `git diff --stat` 自证）
5. 避免 AID 开发中最常见的 3 个坑

---

## AID Workflow 核心概念

### 什么是 AID 增量开发？

传统开发：需求 → 一口气写完 → 测试 → 修 bug（瀑布）

AID 增量开发：**把每次改动拆成可审查的独立增量**，每个增量走完整的设计-实现-验证闭环。

```
需求提出
    ↓
意图识别 → 创建 feature 分支 + change 目录
    ↓
PLANNING        ← 需求分析 + 系统设计
    ↓ [门控确认]
IMPLEMENTING    ← 任务分解
    ↓ [门控确认]
APPLYING        ← 代码生成 + 编译验证
    ↓ [门控确认]
ARCHIVING       ← 归档到 specs/archives/
```

### 四阶段详解

| 阶段 | 做什么 | 产出物 |
|------|--------|--------|
| **PLANNING** | 拆需求、查现状、评复杂度、出方案 | proposal / delta-spec / info / delta-design |
| **IMPLEMENTING** | 拆任务、建检查清单 | tasks.md |
| **APPLYING** | 写代码、编译、验证、出报告 | 实际代码改动 + apply-report.md |
| **ARCHIVING** | 归档完成的 change | 移动目录到 archives/ |

### 产物路径

```
specs/changes/{YYYYMMDD}-{type}-{name}/
  ├── proposal.md       — rq-parse 需求解析
  ├── delta-spec.md     — 增量规格（验收标准）
  ├── info.md           — 代码仓理解
  ├── delta-design.md   — 设计方案
  ├── tasks.md          — 任务分解
  ├── apply-report.md   — 应用报告（含差分验证）
  └── todo.md           — 进度追踪
```

### 复杂度判定（决定跳过什么）

| 等级 | 特征 | 跳过步骤 | 案例 |
|------|------|---------|------|
| **S** | 单领域、1-2文件 | 跳过架构设计 | 加一个按钮、加一行预览 |
| **M** | 2-3领域、跨2-3层 | 完整流程 | 新增历史记录功能 |
| **L** | 多领域联动、需新建模块 | 可能需要拆分 | 添加云同步功能 |
| **XL** | 架构级变更 | 必须拆分 | 多主题引擎 |

---

## 案例对比：两个真实增量

我们对同一个项目（OpenCalc 计算器 HarmonyOS 版）做了两个 S 级增量开发。以下是完整对比：

### Case A：百分号按钮（feat/percent-button）

**需求**："加一个百分号按钮，输入 50+10% 自动算出 55"

**关键发现（rq-parse 阶段）**：检查 Expression.ets 后，发现 `getPercentString()` **已经实现了完整的百分比语义**。需求从"新增计算逻辑 + UI"降为"仅增加 UI 按钮"，复杂度从 M 降为 S。

**实际改动**：3 处修改
1. 按钮行新增 `BtnOp('%')` + 5 按钮显式传 `'18%'`（解决 5×22%=110% 溢出）
2. BtnOp Builder 参数化：`width('22%')` → `width(w)`，签名加 `w: string = '22%'`
3. BtnAct Builder 参数化：同上

**爹助评分**：7.3/10（修正后）— apply-report 初版 4/10（失实，声称"+13字符"实际 ~85 字符参数化重构），修正后 8/10（诚实差分自证 + .claude/commands/ 清理）

**关键教训**：
- ✅ rq-parse 的"代码洞察"环节价值巨大——发现已有能力，避免重复开发
- ❌ apply-report 缺乏差分自证——必须 `git diff --stat` 验证 → ✅ 修正后差分自证，apply-report 评分 4→8
- ❌ `.claude/commands/` 污染 feature branch——非代码文件应单独提交，修正后已清理

### Case B：实时预览（feat/live-preview）

**需求**："在输入表达式的时候，等号上面实时显示预览结果"

**关键发现（rq-parse 阶段）**：
1. 评估链路已完整（evaluate → format），无需改引擎
2. ErrorFlags 全局状态污染风险——不完整表达式会报错，需静默捕获
3. 不完整表达式（如 `1+`）不应显示预览

**实际改动**：+33 −6 行
1. 新增 `@State livePreview` 状态变量
2. 新增 `updateLivePreview()` 方法（含 ErrorFlags 防护 + try-catch）
3. 所有按钮事件挂载预览刷新
4. DisplayPanel 新增预览行

**爹助评分**：8.6/10 — apply-report 诚实、设计前瞻（ErrorFlags 防护）、AC 覆盖完整

**关键亮点**：
- ✅ rq-parse 准确识别全局状态污染风险，design 中前置了防护逻辑
- ✅ apply-report 如实报告改动量，AC 对照表完整
- ✅ `git diff --stat` 与实际一致

---

## 爹助评审精华

> 以下来自爹助对两个 branch 的系统评审（完整版见 Issue #19）

### aid-workflow 的 4 个优势

1. **结构化思维引导**：rq-parse → spec → design → info → tasks → apply 的线性流程强制分阶段思考
2. **AC 驱动开发**：delta-spec 的 AC 表成为 apply-report 验证清单的直接输入，形成"需求→验收"闭环
3. **复杂度自适应**：S 级自动跳过架构设计，避免过度设计
4. **info.md 价值被低估**：两个 branch 的 info.md 都准确定位了关键代码段和潜在风险

### aid-workflow 的 4 个不足

1. **apply-report 缺乏差分验证机制**（最危险 gap）：声称"1行修改"与 `git diff --stat` 显示完全不符
2. **编译验证缺失不可接受**（即使是 S 级）：应明确标记"待验证"而非只在备注提一句
3. **`.claude/commands/` 污染 feature branch**：基础设施配置不应与功能代码混合
4. **AC 与实现的 traceability 不完整**：spec 中的 AC 在 design 中消失

> 注：P0 = 阻塞级（必须立刻修），P1 = 重要（强烈建议）

### 改进建议

| 优先级 | 改进 | 效果 |
|--------|------|------|
| P0 | apply-report 模板强制含 `git diff --stat` | 杜绝报告失实 |
| P0 | todo.md 增加"差分自检"checkpoint | 发布前最后一关 |
| P1 | 非代码文件分 commit 提交 | 审查清晰 |
| P1 | 编译验证标记标准化 | 降低遗漏风险 |

---

## 实验：动手做一个增量

### 前置准备

```bash
# 1. 克隆项目
git clone https://github.com/JungleTestLabs/opencalc-harmonyos.git
cd opencalc-harmonyos

# 2. 了解项目结构（可选，但强烈推荐）
# CalculatorPage.ets — 主页面（按钮布局、事件处理）
# Expression.ets   — 表达式引擎（解析、百分比、清理）
# Calculator.ets   — 计算引擎（evaluate）
# NumberFormatter.ets — 数字格式化
```

> ⏱ 预计 **45-60 分钟**（新手建议预留 60 分钟）。课前准备：先通读 `CalculatorPage.ets`（10 min）。

### 实验步骤

**Step 1: 理解需求**

选一个需求（或自己想一个），用一句话描述。例如：
- "增加一个倒数按钮 (1/x)"
- "历史记录支持滑动删除"
- "增加角度/弧度切换按钮"

**Step 2: 创建 feature 分支**

```bash
git checkout -b feat/your-feature-name main
mkdir -p specs/changes/$(date +%Y%m%d)-requirement-add-your-feature/
```

**Step 3: rq-parse 需求解析**

在这个阶段回答 5 个问题：
1. 意图类型是什么？（新增/变更/修复/重构/迁移）
2. 涉及哪些领域？（UI/计算/存储/网络...）
3. 影响哪个层次？（View/ViewModel/Model）
4. **关键：检查现有代码——有没有已经实现的东西可以复用？**
5. 复杂度是多少？

写出 `proposal.md`。参考 [percent-button proposal](https://github.com/JungleTestLabs/opencalc-harmonyos/blob/feat/percent-button/specs/changes/20260511-requirement-add-percent/proposal.md)

**Step 4: 写 delta-spec**

列出验收标准（AC），每条用一句话描述"用户期望什么行为"。参考 [percent-button delta-spec](https://github.com/JungleTestLabs/opencalc-harmonyos/blob/feat/percent-button/specs/changes/20260511-requirement-add-percent/delta-spec.md)

**Step 5: 写 delta-design**

用伪代码或文字描述设计方案。S 级可以很简略。参考 [live-preview delta-design](https://github.com/JungleTestLabs/opencalc-harmonyos/blob/feat/live-preview/specs/changes/20260512-requirement-add-live-preview/delta-design.md)

**Step 6: 写代码 + apply-report**

- 改代码
- **必须跑 `git diff --stat`**，把结果写入 apply-report
- 逐条对照 AC 验证
- 标注编译/验证状态

**Step 7: 提交**

```bash
git add -A
git commit -m "feat: your feature description"
git push origin feat/your-feature-name
```

**Step 8: 归档**

```bash
mv specs/changes/$(date +%Y%m%d)-requirement-add-your-feature/ specs/archives/
git add -A && git commit -m "archive: your-feature"
```

---

## 常见陷阱与对策

| # | 陷阱 | 案例 | 对策 |
|---|------|------|------|
| 1 | **先写 spec 后查代码** | 写了完整的百分比计算 spec，结果发现引擎已实现 | spec 前快速扫描关键文件 |
| 2 | **apply-report 注水** | 声称"+13字符"实际 ~85 字符参数化重构 | 强制 `git diff --stat` 自证 |
| 3 | **漏评估全局状态影响** | 预览调用 evaluate() 污染 ErrorFlags | rq-parse 阶段检查副作用 |
| 4 | **非代码文件混入 feature branch** | `.claude/commands/` 285 行跟功能代码一起提交 | 文档/配置单独 commit |
| 5 | **跳过门控确认** | 没确认 spec 就开始写代码 | 每阶段结束后等审查 |

---

## 参考资源

- [AID Workflow Skill (skill_bank)](https://github.com/sdd-group2026/skill_bank/tree/main/skills/working/aid-workflow/)
- [rq-parse 输出格式规范](https://github.com/sdd-group2026/skill_bank/blob/main/skills/working/aid-workflow/5-aid-reviewing/SKILL.md)
- [Issue #19 - 爹助评审报告](https://github.com/Intelli-Jungle/hermes-agent-workflow/issues/19)（已更新：狗助修正 apply-report + 爹助重新审查）
- [feat/percent-button 源码](https://github.com/JungleTestLabs/opencalc-harmonyos/tree/feat/percent-button)
- [feat/live-preview 源码](https://github.com/JungleTestLabs/opencalc-harmonyos/tree/feat/live-preview)
