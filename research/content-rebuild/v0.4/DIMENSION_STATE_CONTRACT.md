# E1—E6 → D1—D6 合同 v0.4

## 1. 记号与共同门

以下公式只读取 E1—E6 规范化节点，不读取人格标签。

```text
U(role)       = E1 中 role availability = usable
L(role)       = E1 中 role availability = limited
A(role)       = E1 中 role availability = absent
V(role)       = E2 中 role visibility = visible
P(a..z)       = E4 中有一条 orderedRoles=a..z 且 state=established
R(kind, ends) = E5 中对应关系 state=established
X(a,b)        = E3 中 a→b effective
```

共同门：

1. 每个状态先按单候选盘计算，再按 E6 聚合；
2. `established` 至少需要表中家族数和两个不同 `originClusterKey`；
3. 必需容量节点不是 `usable` 时不得 established；
4. 关键边 unknown/limited 时降为 candidate，blocked 时不支持；
5. 支持与排除同时成立为 conflicted；
6. 候选盘改变状态为 boundary_sensitive；
7. 问题答案不得进入任何 D 状态。

## 2. D1｜定标来源

| 状态 | 必需证据与公式 | 最少独立家族 | 容量/关系条件 | 排除与降级 |
|---|---|---:|---|---|
| `internally_generated` | U(subject), U(input), P(input..subject)；外部接口到 subject 不成立 | 2，须含 E1+E4 | subject/input usable；内部 scope | X(constraint,subject) 或 X(resource,subject) 为主且内部路径 limited 时排除；scope unknown 降级 |
| `externally_calibrated` | 外部 scope 的 X(constraint,subject) 或 X(resource,subject)；内部路径不主导 | 2，须含 E3/E4 | 外部端点 usable | P(input..subject) 同强时转 dual；外部 scope unknown 降级 |
| `dual_reference` | 内部路径与至少一条外部接口路径同时 established | 3，须含 E1+E3+E4 | 两侧容量均 usable | 任一侧 limited 降为 candidate；同源簇只计一次 |
| `unresolved` | 以上均不唯一，或关键 scope/edge unknown | 0 | 无 | 不允许用行为自述补齐 |

时间规则：所有候选盘同一状态才稳定；`internally_generated` 与 `externally_calibrated/dual_reference` 跨盘变化即 `boundary_sensitive`。

## 3. D2｜输入—表达—恢复

| 状态 | 必需证据与公式 | 最少独立家族 | 容量/关系条件 | 排除与降级 |
|---|---|---:|---|---|
| `deep_processing` | P(input..subject)，output hidden/limited，恢复节点 usable | 2，E1+E4 | input/subject usable | output visible 且持续路径 established 时排除；恢复 unknown 降级 |
| `high_expression` | U(output), V(output), P(subject..output)；无过热反证 | 2，须含 E2+E4 | subject/output usable | 恢复 limited 或外部响应边同强时转 overheat candidate |
| `high_response_overheat` | U(output), V(output), P(subject..output), 外部 X(constraint,subject)，且 L(recovery) 或恢复路径 blocked | 3，须含 E1/E2/E4 | output usable；recovery limited | recovery usable 且恢复路径 effective 为排除；recovery 未定义只能 candidate |
| `blocked_expression` | P(input..subject) 且 output absent 或 subject→output blocked | 2，E1+E4 | input/subject usable | 仅 hidden 不等于 blocked；未知时柱降级 |
| `balanced_cycle` | P(input..subject..output)，output/recovery usable，恢复路径 effective | 3，E1+E3+E4 | 全部 usable | 任一 bottleneck limited 转 candidate |
| `unresolved` | 无唯一公式或 recovery 未定义且会改变状态 | 0 | 无 | 不允许把“外向/内向”作为输入 |

时间规则：表达状态或恢复门跨盘变化即 `boundary_sensitive`；只改变 visible/hidden 而不改变核心路径时，对外显声明降级但不自动改核心。

## 4. D3｜约束加工方式

| 状态 | 必需证据与公式 | 最少独立家族 | 容量/关系条件 | 排除与降级 |
|---|---|---:|---|---|
| `self_rewrite` | P(input..subject..output)，外部 constraint 路径 blocked/limited，存在内部替代路径 | 3，E1+E3+E4 | subject/input/output usable | constraint 直接主导时排除；scope unknown 降级 |
| `methodize_pressure` | P05：constraint→input→subject→output 连续，且 output→constraint 为 effective 调节边 | 2，E3+E4，且两簇 | constraint/input/output usable | 仅见官杀+食伤不得成立；直接服从链同强为 conflicted |
| `internalize_standard` | P(constraint..input..subject) established，标准边 scope 从 external 进入 internal | 3，E1+E3+E4 | constraint/input/subject usable | scope 缺失只能 candidate；不得直接推出自我批评 |
| `direct_compliance` | X(constraint,subject) effective，且不存在有效中介路径 | 2，E3+E4 | constraint/subject usable | 存在 methodize 路径时为 conflicted/context_switching |
| `context_switching` | 同一候选盘存在两条不同 scope 的加工路径，或候选盘间路径变化但不改变核心 | 3 | 各路径容量有效 | 若跨盘改变核心则不用本状态，改 `boundary_sensitive` |
| `unresolved` | 路径、scope 或关系有效性不足 | 0 | 无 | 不允许由“认真/谨慎”补齐 |

时间规则：加工路径在候选盘间从 methodize 变 direct/blocked 时 `boundary_sensitive`；仅外显位置变化时降级显化声明。

## 5. D4｜意义—价值转换

`input/output/resource` 是功能角色；“意义/价值”是项目现代翻译，不是事实字段。

| 状态 | 必需证据与公式 | 最少独立家族 | 容量/关系条件 | 排除与降级 |
|---|---|---:|---|---|
| `meaning_first` | P(input..subject..output)，resource limited/absent | 2，E1+E4 | input/subject/output usable | 完整 exchange 路径成立时排除 |
| `value_first` | U(resource), X(output,resource) effective，input 路径 limited | 2，E3+E4 | output/resource usable | input 路径同强时转 editor candidate |
| `meaning_value_editor` | P(input..subject..output..resource) 全链 established | 3，须含 E1/E3/E4 | 四节点 usable | 任一接口 absent/blocked 排除；现代翻译来源 pending 时最多 candidate |
| `conversion_gap` | input/output 路径 established，output→resource blocked/absent | 2，E1+E4 | 上游 usable | 不能仅凭“财不显”成立；unknown 降级 |
| `unresolved` | 链路或现代翻译不唯一 | 0 | 无 | 不允许读取职业、收入或审美自述 |

时间规则：完整链与 conversion gap 跨盘变化即 `boundary_sensitive`。

## 6. D5｜边界与连接

D5 只能描述结构接口；婚姻、亲密模式、信任方式和回应质量不是 ChartFacts。

| 状态 | 必需证据与公式 | 最少独立家族 | 容量/关系条件 | 排除与降级 |
|---|---|---:|---|---|
| `autonomy_protective` | internal P(input..subject) established；外部到 subject 路径 limited | 2，E3+E4 | subject usable | 外部路径同强转 mixed；不得推出关系行为 |
| `high_permeability` | 外部 scope 的 X(constraint/resource,subject) effective | 2，E3+E4 | 两端 usable | 只有可见 constraint 不成立；scope unknown 降级 |
| `reciprocity_sensitive` | subject→output→resource 与 resource→subject 双向交换 effective | 3，E1+E3+E4 | 三节点 usable | 单向资源路径不成立；用户“在意回应”不得作为证据 |
| `role_defined` | constraint→subject effective 且 stage/scope 明确 | 2，E3+E4 | constraint/subject usable | methodize 路径同强转 mixed；不得推出可靠性人格 |
| `mixed` | 两个以上 D5 公式同强且不同来源簇 | 3 | 各自容量有效 | 同源重复不够 |
| `unresolved` | scope、双向边或容量未知 | 0 | 无 | 保留 unknown |

时间规则：结构接口跨盘变化为 `boundary_sensitive`。Owner 已冻结 A03/A04 的关系声明为辅助候选；D5 即使结构成立，也不得自动充当这两个原型的第三核心维度。

## 7. D6｜扩张—承载—收束

| 状态 | 必需证据与公式 | 最少独立家族 | 容量/关系条件 | 排除与降级 |
|---|---|---:|---|---|
| `expansive` | P(input..subject..output) established；pruning/constraint/resource 收束边 limited | 3，E1+E3/E4 | 生成链 usable | 完成链同强转 balanced；不得推出“创意多” |
| `sustained_builder` | subject/output/resource usable；生成与完成路径均 established | 3，E1+E3+E4 | 各阶段容量 usable | 内部审查不是本状态自动结果 |
| `premature_gatekeeping` | P08：generation stage 已存在 effective completion/check edge | 3，E1+E4+E5 | 生成节点 usable | edgeStage unknown 时 blocked；delayed gate 为反证 |
| `closure_gap` | 生成路径 established；output→resource/constraint 完成路径 limited/blocked | 2，E1+E4 | 上游 usable | 完成路径 effective 时排除 |
| `balanced_delivery` | 生成与完成路径 established，gate stage=completion，恢复/承载 usable | 3，E1+E3+E4 | 全链 usable | 任一 stage unknown 降级 |
| `unresolved` | stage、完成边或容量不唯一 | 0 | 无 | 不允许用交付经历补齐 |

时间规则：生成/完成主状态跨盘变化为 `boundary_sensitive`；仅可见性变化不改变 D6。

## 8. 原型门的当前结构矛盾

v0.3 要求核心原型至少三个维度。当前核心规则覆盖：

| 原型 | 核心规则明确覆盖 | 可安全计入的核心维度 | 结果 |
|---|---|---|---|
| A01 | D1/D4/D6 | 3 | 图层可通过，仍受上游事实 blocker |
| A02 | D2/D5/D6 | 3 | 图层可通过，D5 现代翻译仍待定义 |
| A03 | D3/D6；D5 仅辅助关系声明 | 2 | 不得 established |
| A04 | D4/D6；D5 仅辅助关系声明 | 2 | 不得 established |

不得通过固定优先级、复用辅助关系文案或新增第五原型绕过该矛盾。需要 Owner 决定：为 A03/A04 批准一个新的第三核心结构维度，或修改“三维度”核心门；两者都会改变当前规则合同，不能由本研究代理代选。
