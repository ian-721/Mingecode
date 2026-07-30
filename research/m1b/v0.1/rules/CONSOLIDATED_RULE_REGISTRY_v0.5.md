# CRX-0.5｜40 条规则合并状态登记

**版本：** `RR-CONSOLIDATED-0.5.0`  
**依据：** Batch 01—04 逐条审查与跨批次回归  
**状态：** Research Candidate / Not Human-Tested

## 1. 状态变化原则

本文件不回写四批历史审查，而是在 CRX-0.5 层记录跨批次后的当前状态。

本轮仅对六条原 `pending_definition` 规则作去留裁决：

- 008、013保留为需要继续闭合的独特守门机制；
- 016、029合并进入容量负荷敏感性家族；
- 017因依赖全局“约束缺失”否定命题而降级；
- 030因对象竞争到现代边界行为的推论过强而降级。

`pending_source` 仍不等于可用于真人报告。

## 2. 合并登记

| Rule ID | CRX-0.5 status | Core eligibility | Report release | 当前角色 |
|---|---|---|---|---|
| MC-R-001 | `eligible_modifier` | no | modifier_with_independent_anchor | 容量基础背景 |
| MC-R-002 | `eligible_modifier` | no | modifier_with_independent_anchor | 失令多根恢复背景 |
| MC-R-003 | `sensitivity_only` | no | none | 单点根与时间脆弱性 |
| MC-R-004 | `eligible_modifier` | no | visibility_modifier | 月令主题公开显现 |
| MC-R-005 | `eligible_modifier` | no | conditional_visibility_only | 月令主题藏层存在 |
| MC-R-006 | `eligible_modifier` | no | modifier_with_independent_anchor | 多点容量背景 |
| MC-R-007 | `pending_source` | no | none | 容量闭路综合状态；与039互斥 |
| MC-R-008 | `pending_definition` | no | none | 支持实际到达的恢复守门；目标为modifier/gate |
| MC-R-009 | `eligible_modifier` | no | strength_gate_only | 可见意向不等于稳定能力 |
| MC-R-010 | `eligible_modifier` | no | suppression_gate_only | 潜在存在不自动入报告 |
| MC-R-011 | `eligible_modifier` | no | modifier_with_independent_anchor | 输入偏置；需完整输出弱验证 |
| MC-R-012 | `pending_source` | candidate_after_source | audit_only | 输入—输出整合候选 |
| MC-R-013 | `pending_definition` | reverse_candidate_only | none | 关键输出直接过滤守门 |
| MC-R-014 | `pending_source` | candidate_after_source | audit_only | 公开有效输出候选 |
| MC-R-015 | `eligible_modifier` | no | conditional_visibility_only | 输出潜在/条件可见 |
| MC-R-016 | `sensitivity_only` | no | none | 输出来源型容量负荷子类 |
| MC-R-017 | `sensitivity_only` | no | none | 外部约束弱/内部参照历史候选；全局否定不适合核心 |
| MC-R-018 | `pending_source` | candidate_after_source | audit_only | 可谈判边界候选 |
| MC-R-019 | `eligible_modifier` | no | modifier_with_independent_anchor | 单一约束转成运行框架 |
| MC-R-020 | `pending_source` | reverse_candidate_after_source | none | 多重约束未解决状态 |
| MC-R-021 | `pending_source` | candidate_after_source | audit_only | 方法化压力响应候选 |
| MC-R-022 | `pending_source` | candidate_after_source | audit_only | 重定义压力响应候选 |
| MC-R-023 | `pending_source` | reverse_candidate_after_source | none | 表达—正式标准未解决接口 |
| MC-R-024 | `eligible_modifier` | no | combination_modifier | 表达—标准接口财桥已解决 |
| MC-R-025 | `eligible_modifier` | no | visibility_modifier | 资源/完成节点公开有承接 |
| MC-R-026 | `pending_source` | candidate_after_source | audit_only | 输出进入完成接口候选 |
| MC-R-027 | `pending_source` | candidate_after_source | audit_only | 完成进入正式承诺候选 |
| MC-R-028 | `eligible_modifier` | no | bridge_modifier | 约束经印进入内部支持 |
| MC-R-029 | `sensitivity_only` | no | none | 资源来源型容量负荷子类 |
| MC-R-030 | `sensitivity_only` | no | none | 对象特定资源竞争附录；现代边界映射不释放 |
| MC-R-031 | `sensitivity_only` | no | none | 合关系稳定转向附录 |
| MC-R-032 | `sensitivity_only` | no | none | 合而不化占用附录 |
| MC-R-033 | `sensitivity_only` | no | none | 势均冲重组附录；不支持探索维度 |
| MC-R-034 | `sensitivity_only` | no | none | 强弱悬殊冲稳定性附录 |
| MC-R-035 | `sensitivity_only` | hard_excluded | none | 重复刑历史附录 |
| MC-R-036 | `sensitivity_only` | hard_excluded | none | 害历史附录 |
| MC-R-037 | `eligible_modifier` | no | combination_modifier | 已确认显隐状态组合；新增0证据 |
| MC-R-038 | `pending_source` | state_candidate_after_source | none | 多重约束已解决状态 |
| MC-R-039 | `pending_source` | composite_gate_only | none | 容量开放综合门；与007互斥 |
| MC-R-040 | `sensitivity_only` | hard_excluded | none | 严格从格专家敏感性复核 |

## 3. CRX-0.5 统计

```text
rules reviewed:              40 / 40
eligible_core:                0
eligible_modifier:           14
sensitivity_only:            12
pending_source:              12
pending_definition:           2
excluded_m1b:                 0
core_hard_excluded subset:    3
```

总和：

```text
14 + 12 + 12 + 2 = 40
```

## 4. 六条原定义阻塞规则的去留

| Rule ID | Prior | CRX-0.5 | 原因 |
|---|---|---|---|
| 008 | pending_definition | pending_definition | 支持是否实际到达仍是必要守门，且不能由其他规则完全替代 |
| 013 | pending_definition | pending_definition | 关键输出被直接过滤是D4反向机制，须继续完成替代输出与作用验证器 |
| 016 | pending_definition | sensitivity_only | 与029统一为负荷来源子型；没有独立正向人格用途 |
| 017 | pending_definition | sensitivity_only | “外部约束弱”是全局否定，难以稳定证明；不再作为D1锚点 |
| 029 | pending_definition | sensitivity_only | 与016统一为负荷来源子型；从财与阈值问题不应阻塞核心模型 |
| 030 | pending_definition | sensitivity_only | 结构竞争到现代资源边界行为跳跃过大；只留对象敏感性附录 |

## 5. 当前禁止升级

以下任何情况都不能把规则升级为核心：

- 只有正式来源、没有独立现代行为证据；
- 只有现代文案认领感、没有稳定结构合同；
- 同一依赖簇内多条规则同时满足；
- 关系标签、显隐修饰、桥接链或综合门被当作独立家族；
- 依赖研究者知道被试职业、关系或生活经历后反向开关；
- 为保住六维或八原型结构而补写规则。
