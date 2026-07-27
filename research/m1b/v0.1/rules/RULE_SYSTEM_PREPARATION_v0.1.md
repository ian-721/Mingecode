# M1-B 规则系统准备 v0.1

**版本：** `CRX-0.1.0-draft`  
**状态：** Research Candidate / Process Test Only

## 1. 定义合同

### 输入事实与推论分离

规则必须区分：排盘可观察事实、传统结构解释、项目现代机制假设、报告语言。任何一层不得跳过中间层直接包装成结论。

### 必填字段

```text
rule_id
source_package
input_features
necessary_conditions
exclusion_conditions
enhancers
reducers
counterevidence
evidence_family
dimension_effect
context_scope
time_requirements
modern_mechanism_hypothesis
falsifiable_behavior
forbidden_inference
confidence
review_status
```

### 证据家族去重

- 月令、根气、透干、藏干若共同表达同一容量或显隐事实，视为相关家族，不机械累计四次；
- 同一证据家族只保留最高贡献；
- 核心原型至少由两个独立证据家族同向支持；
- 单一十神数量不得独立生成维度或原型；
- 权重仅为内部证据序位，不是用户分数。

### 冲突协议

- 同场景、同等级反向证据：`unresolved`，不得简单相减或强行居中；
- 不同场景反向证据：输出情境分化；
- 只有一个家族：不得形成核心原型；
- 两个核心候选并列：保留双候选研究状态；
- 时间候选盘改变核心原型：退出主样本。

## 2. 24 槽试验集

| 槽位 | 数量 | 目的 | 当前 Rule ID |
|---|---:|---|---|
| A 锚点 | 12 | 六维各两种方向或机制 | B1 审查后填写 |
| B 反向/排除 | 6 | 六维各至少一个关停、反证或近失 | B1 审查后填写 |
| C 情境/守门 | 6 | 显隐、负荷、时间、冲突、单家族、稳定性 | B1 审查后填写 |

每条入选规则必须通过 Positive、Near miss、Exclusion、Counterevidence、Boundary、Family duplicate 六类抽象试验。

## 3. 40 条规则审查矩阵

| Rule ID | 初始层级 | 来源分层 | 必要/排除 | 证据家族 | 初始裁决理由 |
|---|---|---|---|---|---|
| MC-R-001 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-002 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-003 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-004 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-005 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-006 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-007 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-008 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-009 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-010 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-011 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-012 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-013 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-014 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-015 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-016 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-017 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-018 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-019 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-020 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-021 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-022 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-023 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-024 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-025 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-026 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-027 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-028 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-029 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-030 | pending_rule_review | Pending | Pending | Pending | 等待来源、必要条件、反证与证据家族逐条审查 |
| MC-R-031 | sensitivity_or_modifier | Pending | Pending | Pending | 关系/合冲刑害类需先通过力量、必要与排除定义审查 |
| MC-R-032 | sensitivity_or_modifier | Pending | Pending | Pending | 关系/合冲刑害类需先通过力量、必要与排除定义审查 |
| MC-R-033 | sensitivity_or_modifier | Pending | Pending | Pending | 关系/合冲刑害类需先通过力量、必要与排除定义审查 |
| MC-R-034 | sensitivity_or_modifier | Pending | Pending | Pending | 关系/合冲刑害类需先通过力量、必要与排除定义审查 |
| MC-R-035 | core_excluded | Pending | Pending | Pending | 已确认不进入 M1-B 核心裁决；仅保留历史/敏感性记录 |
| MC-R-036 | core_excluded | Pending | Pending | Pending | 已确认不进入 M1-B 核心裁决；仅保留历史/敏感性记录 |
| MC-R-037 | sensitivity_or_modifier | Pending | Pending | Pending | 关系/合冲刑害类需先通过力量、必要与排除定义审查 |
| MC-R-038 | sensitivity_or_modifier | Pending | Pending | Pending | 关系/合冲刑害类需先通过力量、必要与排除定义审查 |
| MC-R-039 | sensitivity_or_modifier | Pending | Pending | Pending | 关系/合冲刑害类需先通过力量、必要与排除定义审查 |
| MC-R-040 | core_excluded | Pending | Pending | Pending | 已确认不进入 M1-B 核心裁决；仅保留历史/敏感性记录 |

## 4. 当前硬排除

`MC-R-035`、`MC-R-036`、`MC-R-040` 不进入首轮核心裁决。该裁决不删除历史规则，也不宣称其永远无效。
