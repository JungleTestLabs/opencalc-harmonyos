# AID Workflow 增量开发实战 — PPT 演示文稿

> 每节 = 1 页 PPT 的内容量。供狗爹讲解使用。
> 标注 [DEMO] 的节配合实操演示，标注 [CASE] 的节配合案例讲解。

---

## Slide 1: 封面

**AID Workflow 增量开发实战**
AI-Native Development — 让 AI 帮你拆需求、写代码、做验证

课程时长：~3 小时 | 狗爹@zhangtbj
前置：Git 基础 + 会写代码

---

## Slide 2: 问题 — 传统开发 vs AID 增量开发

| 传统开发 | AID 增量开发 |
|----------|-------------|
| 需求 → 一口气写完 → 测试 → 修 bug | 需求 → 拆增量 → 设计 → 实现 → 验证 → 下一个 |
| 改动大、审查难 | 每次改动小、每次有报告 |
| "改完了你看看吧" | "改动 +33 -6 行，AC 全部通过，diff 自证" |

**核心理念**：把每次改动做成一个**可审查的独立增量**

---

## Slide 3: 四阶段流程

```
PLANNING        →  IMPLEMENTING    →  APPLYING       →  ARCHIVING
需求分析+设计      任务分解            代码+验证          归档
proposal.md       tasks.md           apply-report.md    → archives/
delta-spec.md                        + git diff --stat
delta-design.md
```

每阶段结束 → **门控确认** → 下一阶段

---

## Slide 4: [CASE] rq-parse — 需求解析

**输入**："加一个百分号按钮，输入 50+10% 自动算出 55"

**解析结果**：
- 意图：新增功能
- 领域：UI/交互 + 计算引擎
- 影响：View（modify CalculatorPage）
- 复杂度：**S**（单文件）

**关键发现**：检查 Expression.ets → `getPercentString()` 已实现完整百分比语义！

→ 需求从"新增计算+UI"降为"仅增加 UI 按钮"

---

## Slide 5: [CASE] 复杂度判定

| 等级 | 特征 | 跳过什么 | 案例 |
|------|------|---------|------|
| S | 单领域、1-2文件 | 架构设计 | 加按钮、加预览行 |
| M | 2-3领域 | 无 | 历史记录功能 |
| L | 多领域联动 | 可能需要拆分 | 云同步 |
| XL | 架构级 | 必须拆分 | 多主题引擎 |

> S 级 ≠ 不重要。S 级 = **改动小、逻辑已就绪** → 最快的增量。

---

## Slide 6: [CASE] info.md — 代码仓理解

两个真实案例的 info.md 发现：

| Case | 发现 | 价值 |
|------|------|------|
| 百分号按钮 | `getPercentString()` 已实现 3 种百分比语义 | 避免重复开发计算逻辑 |
| 实时预览 | ErrorFlags 全局状态会被 `evaluate()` 污染 | 在设计中前置防护逻辑 |

**info.md 是 AID 最被低估的产出物** — 它防止你"改错文件"和"遗漏副作用"

---

## Slide 7: [CASE] delta-spec 与 AC 表

**delta-spec** = 需求规格，核心是**验收标准（AC）**

百分号按钮的 AC（7 项）：
- AC1: 按钮显示在基础键盘第一行
- AC2: 点击 % 按钮，表达式追加 '%'
- AC3: `50+10%` 计算结果为 `55`
- AC4: `100*5%` 计算结果为 `5`
- AC5: 百分比可在表达式中多次使用
- AC6: 振动反馈（⚠️ 未实现 — spec 与实现脱节）
- AC7: 原有功能不受影响

**教训**：AC 写到 spec 里，必须在 design + apply 中体现到。AC6 失踪 → spec 可信度下降。

---

## Slide 8: [CASE] apply-report — 最重要的产出物

**apply-report 必须包含**：
1. 改动摘要（文件、行数）
2. 逐点改动说明
3. **git diff --stat 自证** ← 最关键
4. AC 对照表（每项是否实现）
5. 编译/验证状态

**反面教材**：百分号按钮的初版 apply-report
- 声称："+13 字符，1 行修改"
- 实际：3 处修改、~85 字符参数化重构
- 根因：没跑 `git diff --stat`
- 评分：4/10

**爹助教训**：报告失实 = 审查信任崩塌。**自证，不要自评。** 好消息：修正后 apply-report 评分 4→8/10（见下页）。

---

## Slide 8b: [CASE] 翻车后 — 修正的力量

**百分号按钮 apply-report 修正过程**：

| 阶段 | 动作 | 结果 |
|------|------|------|
| 初版 | 声称 "+13 字符，1 行修改" | 4/10 |
| 爹助指出 | apply-report 失实，需差分自证 | — |
| 修正 | 如实描述 3 处参数化改动 + `git diff --stat` 验证 + 清理 `.claude/commands/` 污染 | — |
| 再审查 | apply-report **4→8/10**，综合 **6.7→7.3/10** | ✅ |

> **"一个好的 apply-report 不是天生的——是 diff 出来的。"**

修正后的 apply-report 差分验证节已成为本课程新的正面教材。

---

## Slide 9: 对比 — 两个案例的审判结果

| 维度 | 百分号按钮 | 实时预览 |
|------|:--------:|:-------:|
| 需求解析 | 8/10 | 9/10 |
| AC 覆盖 | 7 项（含冗余） | 10 项（无冗余） |
| 设计前瞻性 | 7/10 | 9/10 |
| **apply-report 诚实度** | **4→8/10** 修正后 | **8/10** |
| 代码最小化 | 7/10 | 8/10 |
| **综合** | **6.7→7.3/10** | **8.6/10** |

**差异根因**：apply-report 的自证机制。live-preview 的 diff 与报告一致；percent-button 初版失实，修正后 4→8。最戏剧性的教学时刻：翻车后如何爬回来。

---

## Slide 10: AID 的 4 个优势

1. **结构化思维引导** — 线性流程强制分阶段，不会"上来就写"
2. **AC 驱动开发** — delta-spec → apply-report，形成"需求→验收"闭环
3. **复杂度自适应** — S 级自动跳过架构设计，不浪费精力
4. **info.md** — 关键代码洞察，防止改错文件和遗漏副作用

---

## Slide 11: AID 的 4 个坑

| # | 坑 | 对策 |
|---|----|------|
| 1 | **apply-report 注水** | 强制 `git diff --stat` |
| 2 | **先写 spec 后查代码** | spec 前快速扫描关键文件 |
| 3 | **漏评估全局状态影响** | rq-parse 检查副作用 |
| 4 | **非代码文件混入 branch** | 文档/配置单独 commit |

---

## Slide 12: 改进方案（爹助推荐）

| 优先级 | 改进 | 一句话 |
|--------|------|--------|
| **P0** | apply-report 模板强制 diff | "报告写完，先 diff" |
| **P0** | todo.md 加差分自检 | 发布前最后一关 |
| P1 | 非代码文件分离 | 审查清晰 |
| P1 | 编译验证标记标准化 | 降低遗漏 |

---

## Slide 13: [DEMO] 动手实验 — 45-60 分钟做一个增量

**任务**："给计算器加一个倒数按钮 (1/x)"

**步骤**：
1. `git checkout -b feat/reciprocal` → 创建分支
2. 写 proposal.md（rq-parse：查 Expression.ets 有没有 `1/` 逻辑）
3. 写 delta-spec.md（3-5 条 AC）
4. 改代码（CalculatorPage.ets 加按钮 + 事件处理）
5. 写 apply-report.md（**必须附 `git diff --stat`**）
6. push → 交给旁边的人审查

**验收标准**：apply-report 的 diff 与实际改动一致，AC 全部勾选

---

## Slide 14: 总结 — 三条铁律

1. **先查代码再写 spec** — rq-parse 不是猜，是读代码后的判断
2. **apply-report 用 diff 自证** — `git diff --stat` 是报告的第一句话
3. **编译验证不可跳过** — 不能编译的代码不算完成
   ↳ 无法编译时（如环境限制）：apply-report 标记 ⚠️ 待宿主机验证 + 附编译日志。**诚实标注 > 假装编译过。**

> "增量开发的核心不是增量的大小，而是**每次增量的可审查性**。"
> — 爹助，2026-05-13

---

## Slide 15: 参考与下一步

**本课程源码**：
- [feat/percent-button](https://github.com/JungleTestLabs/opencalc-harmonyos/tree/feat/percent-button)
- [feat/live-preview](https://github.com/JungleTestLabs/opencalc-harmonyos/tree/feat/live-preview)

**爹助评审报告**：[Issue #19](https://github.com/Intelli-Jungle/hermes-agent-workflow/issues/19)（已更新：狗助修正 + 爹助重新审查）

**AID Workflow Skill**：[skill_bank](https://github.com/sdd-group2026/skill_bank/tree/main/skills/working/aid-workflow/)

**下一步**：在 OpenCalc 上用真需求做一次完整的 AID 增量。遇到坑 → 回来更新这份材料。
