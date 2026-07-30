# M1-B 规则定义合同 v1.4-draft

**状态：** F0 Draft / Process Test Only  
**继承：** `RULE_DEFINITION_CONTRACT_v1.3-draft.md`  
**新增范围：** 关闭 `MC-R-008` 与 `MC-R-013` 的定义缺口  
**禁止用途：** 真人裁决、业务实现、准确率宣传

## 1. MC-R-008｜低容量基线下的支持路由门

### 1.1 角色重定义

`MC-R-008` 不再是人格锚点，也不证明韧性、适应力或“有人托底”。它只回答：

> 当基础容量被判为低或脆弱候选时，是否存在一条真实到达日主、足以阻止其他规则把该结构直接判为失效的支持路由？

```text
core_role: support_gate_only
report_release_level: none
modern_behavior_claim: forbidden
```

### 1.2 必要条件

必须全部满足：

1. `capacity_baseline = low_or_fragile_candidate` 已由独立容量审计确定；
2. 至少一条印或比劫支持路径的起点有效；
3. 路径每一节点均可达，不是符号同现；
4. 路径没有被财破印、直接制尽、关键冲拔或时间边界完整关闭；
5. 支持到达日主，而非停留在外围节点；
6. 不属于 `MC-R-040` 严格从格候选；
7. 支持事实未被重复计入容量家族。

### 1.3 分类结果

```text
SG-0 unknown
  路径扫描未完成

SG-1 nominal_support
  名义有印比，但路径不到达或不稳定

SG-2 effective_support_route
  至少一条支持路径稳定到达日主

SG-3 support_overridden
  支持存在，但被同对象的更高优先级负荷或关闭机制完整覆盖
```

`MC-R-008` 只在 `SG-2` 时触发；`SG-3` 不得写成“有支持但仍很弱”的用户结论，只作为内部关闭状态。

### 1.4 与其他规则的关系

- 与 001、002、006共享容量/根气事实时，只作 gate，不增加家族；
- 允许 012、014、018、021、026、027 等路由在低容量候选下继续接受审查；
- 与 016、029 的负荷状态同对象冲突时，按具体负荷机制优先；
- 若 040 成立，008关闭；
- 008不得单独进入报告或槽位。

### 1.5 禁止推断

```text
抗压强
恢复快
有人帮助
适应力强
越弱越有后劲
低谷必能翻盘
```

### 1.6 状态迁移

```text
prior_status: pending_definition
new_status: pending_source
core_eligibility: no
```

定义已闭合，但传统来源页码与现代机制验证未闭合。

## 2. MC-R-013｜关键输出被直接过滤

### 2.1 角色重定义

`MC-R-013` 只描述一个对象特定的输出过滤状态：

> 一条原本有效且关键的食神输出路由，被一条有效偏印路由在同一对象上直接关闭，且不存在足以替代或解除该过滤的路径。

```text
core_role: reverse_candidate_only
report_release_level: none
D2_effect: removed
```

### 2.2 关键输出验证

`key_food_output_route` 必须同时满足：

1. 食神节点有效且有根、来源或连续承接；
2. 路径能够到达外部输出对象；
3. 移除该路径后，输出状态会从有效降为弱或不确定；
4. 不存在同等级、独立且未被关闭的伤官或其他输出路线；
5. 结论在合理时间候选中稳定。

只有“食神出现”不构成关键输出。

### 2.3 直接过滤验证

`direct_food_filtering` 必须同时满足：

1. 偏印节点有效；
2. 偏印与关键食神作用于同一对象；
3. 位置、链路和力量足以发生直接制约；
4. 食神路线不是仅名义存在；
5. 过滤发生后输出路线实际关闭，而非只降低强度；
6. 不是研究者根据报告文案反推过滤成立。

### 2.4 排除白名单

任一项成立即关闭 013：

- 偏印承担 `MC-R-008` 的必要支持，不能同时被当作纯过滤端；
- 有效财路线直接制偏印并解除过滤；
- 食神不是关键输出；
- 存在同等级独立伤官或其他输出；
- 食神多根且主路未被完整关闭；
- 偏印与食神作用于不同对象；
- 时间候选改变关键输出或过滤关系。

### 2.5 状态轴

```text
OF-0 unknown
OF-1 output_available
OF-2 output_moderated
OF-3 key_output_filtered
OF-4 alternative_output_available
```

`MC-R-013` 只对应 `OF-3`。`OF-2` 只能保留为审计说明；`OF-4` 关闭 013。

### 2.6 与其他规则的关系

- 与 012 对同一关键输出互斥；
- 成立时优先于 011 的一般“输出弱”叙事；
- 与 014 对同一输出对象互斥；
- 若命中财桥或替代输出，只保留更具体的解除/替代机制；
- 013不增加D2，也不能自动生成“质量控制强”的正向补偿。

### 2.7 禁止推断

```text
心理压抑
创作受阻人格
完美主义
疾病或子嗣问题
没福气
内审能力强
```

### 2.8 状态迁移

```text
prior_status: pending_definition
new_status: pending_source
core_eligibility: reverse_candidate_after_source_only
```

## 3. 全局结果

完成 v1.4 后，40 条规则中不再存在 `pending_definition`：

```text
eligible_modifier: 14
sensitivity_only: 12
pending_source: 14
pending_definition: 0
eligible_core: 0
```

定义闭合不等于来源关闭，更不等于现代行为有效。008与013在来源、回归和报告映射全部完成前，均不得释放用户声明。
