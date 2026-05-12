# 应用报告

## 应用信息
- 变更类型：新增功能 (requirement-add)
- 变更名称：百分号按钮 (percent)
- 关联分支：feat/percent-button
- 应用日期：2026-05-11
- 修正日期：2026-05-13（修正差分描述失实问题）

## 代码完成情况
| 任务 | 状态 | 说明 |
|------|:--:|------|
| Task 1: CalculatorPage 增加 % 按钮 | ✅ 完成 | 3处修改：按钮行新增 % + 参数化 BtnOp/BtnAct Builder |

## 差分验证
```
git diff --stat (vs main, 仅 CalculatorPage.ets):
 entry/src/main/ets/pages/CalculatorPage.ets | 3处修改

实际 diff 详情：
1. 第278行 按钮行：新增 this.BtnOp('%', '18%')，其余4个按钮显式传 '18%'
   原因：5个按钮均用默认 22% 会溢出 (5×22%=110% > 100%)
2. 第291行 BtnOp Builder：硬编码 width('22%') → width(w)，签名加 w: string = '22%'
   原因：参数化以支持5按钮行，同时向后兼容4按钮行（默认22%不变）
3. 第300行 BtnAct Builder：硬编码 width('22%') → width(w)，签名加 w: string = '22%'
   原因：同上，AC 按钮在5按钮行中也需 18%
```

## 改动细节
```
文件: entry/src/main/ets/pages/CalculatorPage.ets

变更1（按钮行，第278行）:
- Row() { this.BtnAct('AC'); this.BtnOp('('); this.BtnOp(')'); this.BtnOp('÷') }
+ Row() { this.BtnAct('AC', '18%'); this.BtnOp('%', '18%'); this.BtnOp('(', '18%'); this.BtnOp(')', '18%'); this.BtnOp('÷', '18%') }

变更2（BtnOp Builder，第291行）:
- @Builder BtnOp(l: string) { ... .width('22%') ... }
+ @Builder BtnOp(l: string, w: string = '22%') { ... .width(w) ... }

变更3（BtnAct Builder，第300行）:
- @Builder BtnAct(l: string) { ... .width('22%') ... }
+ @Builder BtnAct(l: string, w: string = '22%') { ... .width(w) ... }
```

## 自评
- 原 apply-report 误报为"+13 字符，1行修改"，实际是 3 处修改、~85 字符的参数化重构
- 原因：初始错误评估了布局溢出的影响范围，低估了参数化的必要性
- 修正：如实反映 3 处变更，标注参数化决策原因

## 测试结果
- 编译验证：⚠️ 当前环境无 HarmonyOS SDK，无法执行 `hvigorw assembleHap`。需在 DevEco Studio 环境中验证。
- 逻辑验证：✅ 百分比计算链已存在并验证（`getPercentString` 在 Expression.ets 第 169-255 行已实现完整百分比语义）
- 布局验证：5×18%=90% < 100%，不会溢出。4按钮行继续使用默认 22%（4×22%=88% < 100%）

## 逻辑验证（手动推导）

表达式流程 `50+10%`：
```
1. expression = "50+10%"
2. getCleanExpression()
3. getPercentString("50+10%"):
   - 检测到 % 在位置 5
   - 前一个是数字 "10"
   - 前面运算符是 '+'（opPos 指向 '+'）
   - 进入 else 分支（第 242-246 行）
   - result = "50+50*(10/100)"
4. Calculator 计算: 50 + 50*(0.1) = 50 + 5 = 55 ✅
```

## 下一步
1. 在 DevEco Studio 中执行 `hvigorw assembleHap` 验证编译
2. 编译通过后 merge 到 main
3. 执行 ARCHIVING 阶段
