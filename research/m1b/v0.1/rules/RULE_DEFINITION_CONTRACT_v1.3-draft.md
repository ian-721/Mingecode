# M1-B 规则定义合同 v1.3-draft

**状态：** F0 Draft / Research Candidate / Process Test Only  
**继承版本：** `RULE_DEFINITION_CONTRACT_v1.2-draft.md`  
**新增范围：** `MC-R-031`—`MC-R-040`，并对 `MC-R-007`、`MC-R-020` 给出不回写历史文件的后续状态裁决  
**禁止用途：** 真人裁决、用户展示、准确率宣传、业务实现

## 1. 版本关系

v1.3 完整继承 v1.0—v1.2 的四层分离、根气、显隐、连续链、容量/负荷、对象范围、家族/依赖簇上限和版本治理。旧批次审查文件作为历史记录保持不变；本文件只记录新增定义和后续裁决。

Batch 04 的目标不是把合、冲、刑、害、从格“人格化”，而是回答：

1. 某个关系是否真实作用于一个明确对象；
2. 关系结果是转向、牵制、激活、覆盖，还是无法判定；
3. 关系是否只是对既有规则的修饰，而非新的独立证据；
4. 特殊结构是否应从首轮核心裁决中排除；
5. `MC-R-038` 是否能关闭 `MC-R-020` 的解决白名单；
6. `MC-R-039` 是否能与 `MC-R-007` 形成可执行的开放/闭路互斥。

## 2. Batch 04 新增必填字段

```text
relation_scope_id
relation_object_ids
relation_type
relation_effectiveness
strength_relation
resolution_state
competing_relations
affected_function_ids
time_stability
core_eligibility
appendix_only_reason
supersedes_or_closes
```

- `relation_scope_id`：关系只对哪一对支、哪一个功能对象、哪一段链路成立；
- `relation_effectiveness`：effective / ineffective / indeterminate；
- `strength_relation`：comparable / side_a_dominant / side_b_dominant / indeterminate；
- `resolution_state`：resolved / unresolved / redirected / bound / displaced / not_applicable；
- `core_eligibility`：candidate / modifier_only / sensitivity_only / hard_excluded；
- `supersedes_or_closes`：该状态关闭或改写哪些旧规则。

## 3. 关系对象与力量合同

### 3.1 对象特定

任何合、冲、刑、害必须绑定明确的 `relation_object_ids`。同一对地支可能同时承载多个功能，但不得把一个关系标签扩展成全局人格。

关系只可影响：

- 被该关系直接触及的根、输出、资源、约束或支持节点；
- 依赖这些节点的已审查链路；
- 该对象在当前时间候选中的稳定性。

不得直接推出：

- 爱合作、爱变化、内耗、敏感、叛逆、命运多变；
- 婚恋、疾病、官非、财富、事故或社会等级；
- 任何“逢合必好”“逢冲必动”“逢刑必凶”的结论。

### 3.2 力量分类

`strength_relation` 采用分类而非伪精确分数。至少检查：

```text
月令/季节上下文
独立根与来源
透出或引动
支持与制约链
是否被更强关系关闭
是否依赖时支或边界输入
```

若这些因素不能稳定区分双方，状态必须为 `indeterminate`，不得为了触发 033 或 034 强行判定“势均”或“悬殊”。

### 3.3 关系优先级

1. 先判断两端是否有效；
2. 再判断是否存在更具体的连续链或对象机制；
3. 更具体链路优先于一般关系标签；
4. 同一对象出现多个同等级关系且无法预注册优先级时，输出 `unresolved`；
5. 关系规则不得成为第二份或第三份独立人格证据，除非其 L0 事实与既有家族完全不重叠——Batch 04 当前不释放这种例外。

## 4. 六合与合而不化状态轴

### 4.1 `combine_relation_state`

| 状态 | 对应规则 | 必要条件 | 报告释放 |
|---|---|---|---|
| `C0 none_or_ineffective` | 无 | 名义六合但任一端无效，或作用被更强关系关闭 | 不写 |
| `C1 redirected_or_stable_interface` | MC-R-031 | 两端有效；得时得势；有稳定引化/转向，或双方原作用被可重复地重新分配 | sensitivity only |
| `C2 binding_without_redirection` | MC-R-032 | 两端有效；关系真实占用；无足够化神/引化；双方原功能被牵制 | sensitivity only |
| `C3 contested_or_broken` | 争合/冲破 | 多重争合、强冲破合或主次不可判 | 不写；记录冲突 |

031 与 032 对同一对象互斥。`C1` 不等于“善于合作”，`C2` 不等于“优柔寡断”。它们只能在敏感性审计中描述接口是否完成转向。

### 4.2 合化判据边界

“化”至少要求：

- 化神方向在结构中有实际承接；
- 不是只出现一个名义元素；
- 两端原功能确实发生稳定改写；
- 争合、冲破和时间候选不会改变结论；
- 不依赖岁运。

无法同时满足时，不能写“合化成立”；若关系仍占用双方，只能进入 032 的候选检查。

## 5. 冲的双状态轴

### 5.1 `clash_relation_state`

| 状态 | 对应规则 | 必要条件 | 报告释放 |
|---|---|---|---|
| `K0 ineffective_or_mitigated` | 无 | 任一端无效，或被明确合解/替代通道吸收 | 不写 |
| `K1 comparable_activation` | MC-R-033 | 两端有效、力量接近、均未被拔除、同一对象相互推动 | sensitivity only |
| `K2 dominant_displacement` | MC-R-034 | 一端明显占优，弱端承担关键功能且无独立救应 | sensitivity only |
| `K3 indeterminate` | 无 | 力量或对象范围不稳定 | 不写；时间附录 |

033 与 034 对同一对象互斥。

### 5.2 现代机制边界

- 033 只能记录“该对象发生重组/切换候选”，不得自动增加 D3 探索启动；
- 034 只能记录“关键功能稳定性下降候选”，不得写成灾祸、突然失败或人格脆弱；
- 若 034 作用于 `MC-R-003` 的唯一关键根，采用更具体的单点容量脆弱叙事，不能重复计两份；
- 关系涉及时支且跨合理时间候选变化时，一律 `sensitivity_only`。

## 6. 刑与害的硬边界

### 6.1 MC-R-035｜重复刑

- `core_eligibility: hard_excluded`
- `review_status: sensitivity_only`
- 只允许在研究附录中记录“重复关系标签与某功能重叠”的事实；
- 不生成 D2、D6 或用户行为声明；
- 不允许把“反复校验”“细致”作为正向补偿，因为该现代映射尚无独立证据；
- 犯罪、疾病、灾祸、内耗人格全部禁止。

### 6.2 MC-R-036｜害

- `core_eligibility: hard_excluded`
- `review_status: sensitivity_only`
- 只有在更具体的冲、合、链断和对象竞争均不能解释时，才保留为附录标签；
- 不生成“隐性不匹配”“直觉敏锐”或任何用户声明；
- 若不能由其他规则观察到具体受影响功能，视为名义存在并忽略。

## 7. 透藏不一致组合修饰

### 7.1 MC-R-037 工作定义

`public_hidden_state_difference` 必须同时满足：

- 至少一个公开可见功能已由 004/014/019/025 等规则独立确认；
- 至少一个藏层功能已由 005/015 等规则确认有效，但未被 009/010 关闭；
- 两者不是同一连续链的不同节点；
- 两者对应的具体情境可被区分；
- 时间候选稳定。

037 不形成新证据家族，只是 `CL-VISIBILITY-STATE` 的组合修饰。允许的最小声明形式为：

```text
明确情境 A 中的可观察动作
+ 明确情境 B 中的内部准备/延迟
+ 一个反向条件
```

禁止使用“你有两面”“外冷内热”“公私反差大”等泛化文本。

## 8. 官杀混杂的解决白名单

### 8.1 `constraint_mix_state`

| 状态 | 对应规则 | 说明 |
|---|---|---|
| `M0 unknown` | 无 | 官杀有效性、对象或主次未完成 |
| `M1 single_integrated` | MC-R-019 | 一类主导，另一类无效/从属 |
| `M2 mixed_unresolved` | MC-R-020 | 两端同对象有效、无主次且无解决机制 |
| `M3 mixed_resolved` | MC-R-038 | 两端原本有效，但经可审计机制形成稳定主次 |

### 8.2 038 的解决机制白名单

至少满足一种，且位置、对象与力量有效：

1. `effective_retention`：一方被有效合留，另一方形成稳定主导；
2. `direct_control`：食制、印化或其他已审查链对一端形成稳定处理；
3. `stable_subordination`：一端仍存在但明确从属，不再与主导端争夺同一对象；
4. `scope_separation`：两端实际作用于不同对象/情境，因此不构成同一 scope 的混杂——此时关闭 020，但不必触发 038 的正向声明。

名义合制、岁运暂时解决、研究者按结果挑选主次均不合格。

### 8.3 对 MC-R-020 的后续裁决

v1.3 关闭了“解决白名单缺失”的定义阻塞。因此：

```text
MC-R-020:
  prior_status: pending_definition
  new_status: pending_source
  user_release: none
```

这不是将 020 升级为有效人格规则，只表示其“未解决”状态现在有可执行的反向白名单。020 与 038 仍须通过正式版本、页码和报告映射，且对同一对象互斥。

## 9. 容量开放/闭路全局状态

### 9.1 全局路由注册表

对 `MC-R-007` 与 `MC-R-039`，必须扫描以下已审查路由：

```text
input/support:       008, 011, 012, 028
output:              012, 014, 015
pressure handling:   021, 022
resource/completion: 024, 025, 026
constraint/commit:   018, 019, 027, 028, 038
load/closure gates:  013, 016, 020, 023, 029, 030
```

仅出现元素或十神不算通道；必须满足相应批次合同。

### 9.2 `capacity_route_state`

| 状态 | 对应规则 | 必要条件 |
|---|---|---|
| `R0 unknown` | 无 | 容量或路由扫描未完成 |
| `R1 closed_capacity` | MC-R-007 | 容量有效，但输出、现实转化和约束/边界路由均无有效通道 |
| `R2 open_integrated_capacity` | MC-R-039 | 容量有效；至少一条输出/转化路由与一条边界/约束/完成路由有效；彼此不相互关闭 |
| `R3 overloaded_or_conflicted` | 016/020/023/029/030 | 通道存在但负荷或冲突未解决 |

007 与 039 对同一结构互斥。039 是跨簇综合状态，不是新的独立家族，不得把已有容量、输出、资源和约束再次相加。

### 9.3 对 MC-R-007 的后续裁决

v1.3 完成全局路由扫描表，因此：

```text
MC-R-007:
  prior_status: pending_definition
  new_status: pending_source
  user_release: none
```

007 与 039 都只能在来源关闭和跨批次回归后评估。不得把 039 写成“高能力者”“可持续做成事”，也不得把 007 写成“固执、封闭、没有出口”。

## 10. 从格严格候选

### 10.1 MC-R-040

- `core_eligibility: hard_excluded`
- `review_status: sensitivity_only`
- 保留严格候选条件：无稳定根、无有效比印救应、单一方向纯而有势、无异质通道、所有时间候选一致；
- 任一稳定根、支持链、混杂方向或边界变化即关闭；
- 即使结构条件满足，也不生成“高度环境适配”的真人声明；
- 仅保留为未来专家复核和多流派一致性研究对象。

从格不得覆盖普通容量、路由和负荷规则来制造更漂亮的解释。

## 11. Batch 04 证据家族与依赖簇

| Family / cluster | Rule IDs | 作用 | 独立正向证据 |
|---|---|---|---|
| `CL-RELATION-STATE` | 031—036 | 合、冲、刑、害对象状态 | 否；全部敏感性/附录 |
| `CL-VISIBILITY-STATE` | 004、005、009、010、014、015、037 | 公开/潜在/不稳定及组合差异 | 否；037只组合修饰 |
| `EF-CONSTRAINT-MIX-RESOLUTION` | 020、038 | 多重约束未解决/已解决 | 来源关闭后可作状态候选，但同对象只取一态 |
| `CL-CAPACITY-ROUTE-SYSTEM` | 007、039 + 所有依赖路由 | 容量闭路/开放综合状态 | 否；综合门，不是新增家族 |
| `CL-FOLLOW-STRUCTURE` | 040 | 严格从象候选 | 否；核心硬排除 |

## 12. Batch 04 技术裁决

| Rule ID | Review status | 核心资格 | 报告释放 |
|---|---|---|---|
| 031 | `sensitivity_only` | relation modifier only | none |
| 032 | `sensitivity_only` | relation modifier only | none |
| 033 | `sensitivity_only` | relation modifier only | none |
| 034 | `sensitivity_only` | relation modifier only | none |
| 035 | `sensitivity_only` | hard_excluded | none |
| 036 | `sensitivity_only` | hard_excluded | none |
| 037 | `eligible_modifier` | modifier_only | conditional modifier candidate |
| 038 | `pending_source` | state candidate, not anchor | audit_only |
| 039 | `pending_source` | composite gate, not anchor | audit_only |
| 040 | `sensitivity_only` | hard_excluded | none |

本批不产生 `eligible_core`。031—036、040 不参与首轮核心裁决；037 不增加证据；038、039 只关闭定义链，来源门未关闭。

## 13. 版本规则

本文件新增关系状态轴、解决白名单、全局路由注册表，并改变 007/020 的后续状态，属于 minor 版本。任何修改合化、力量分类、020/038 或 007/039 互斥关系的后续变更必须升至 v1.4+，并重跑 Batch 01—04 相关夹具和跨批次回归。
