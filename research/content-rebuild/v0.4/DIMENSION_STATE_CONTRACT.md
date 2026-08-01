# D1—D6 静态结构维度合同

状态：`research_candidate`

维度只能从完整 role-matrix 闭包计算，不能读取手工 edge、人格、问题、恢复、范围或阶段字段。

## 1. 核心门

核心 established 必须同时满足：两个不可重复结构维度、两个独立证据家族、两个不同 originClusterKey、一项 E4 同源张力、排除未命中、最近邻边界唯一、所有合理候选盘同核。问题答案不得补门。

## 2. 维度

### D1 供能链

输出：`supply_continuous / supply_limited / supply_blocked / unresolved`

- continuous：input、subject usable 且矩阵必生的 input→subject effective；
- limited：无 unknown/blocked，至少一端或边 limited；
- blocked：input absent 或必需边 blocked/not_supported；
- unresolved：unknown、同候选冲突或候选聚合不同。

### D2 输出—主体容量

输出：`output_visible_asymmetric / output_supported / output_limited / unresolved`

- asymmetric：output visible+usable、subject limited、subject→output limited；
- supported：subject/output usable 且 subject→output effective；
- output_limited：output 可见但 output limited，或输出边 limited 且不满足 asymmetric；
- unresolved：输出非 visible 且本维度被要求，或 unknown/候选冲突。

环境敏感、反馈耗电、恢复体验不属于本维度。

### D3 约束中介路径

输出：

```text
constraint_mediated_by_output
constraint_mediated_by_input
direct_only
mixed
blocked
unresolved
```

先计算三条路径：

- output-mediated：subject→output→constraint；
- input-mediated：constraint→input→subject；
- direct：constraint→subject。

判定顺序：

1. constraint absent：blocked；
2. 任一关键状态 unknown：unresolved；
3. output 与 input 两条中介路径均 effective：mixed；
4. 仅 output-mediated effective：constraint_mediated_by_output；direct 可同时 effective，它是固有闭包，不造成 mixed；
5. 仅 input-mediated effective：constraint_mediated_by_input；direct 可同时 effective；
6. 两条中介均 blocked/not_supported，direct effective：direct_only；
7. 任一中介仅 limited：unresolved；
8. 全部 blocked/not_supported：blocked。

A03 正例必须是 `constraint_mediated_by_output`；input 不显不构成失败。方法化、质检和首版延迟不得成为 D3 输入。

### D4 输入—主体—输出—资源转换

输出：`conversion_continuous / conversion_limited / conversion_blocked / unresolved`

- continuous：四节点 usable，input→subject→output→resource 全 effective；
- limited：无 unknown/blocked，至少一个节点或边 limited；
- blocked：节点 absent 或必需边 not_supported/blocked；
- unresolved：unknown 或候选冲突。

### D5 输出—约束反馈接口

输出：

```text
output_constraint_regulating
output_constraint_feedback
shared_endpoint_competition
uncoupled
unresolved
```

必须共同读取 subject→output、output→constraint、constraint→subject：

- regulating：subject→output limited、output→constraint effective、constraint→subject limited；
- feedback：三边 effective；
- shared_endpoint_competition：output→constraint 或 constraint→subject 因同对象竞争降为 limited；
- uncoupled：output 或 constraint absent，或 output→constraint not_supported/blocked；
- unresolved：unknown，或其他未闭合组合。

固有的 constraint→subject 不能仅因存在就排除 A02。A02 使用 regulating；A03 使用 feedback 作为张力支持。

### D6 资源接口

输出：`resource_interface_effective / resource_interface_limited / resource_interface_blocked / unresolved`

- effective：output/resource usable，output→resource effective；
- limited：无 unknown/blocked，至少一端或边 limited；
- blocked：resource absent 或边 not_supported/blocked；
- unresolved：unknown 或候选冲突。

## 3. 四机制两维门

| 机制 | 维度 1 | 维度 2 | E4 张力 | 结构反证 |
| --- | --- | --- | --- | --- |
| A01 | D1 supply_continuous | D6 limited/blocked | A01 output 收束张力 | constraint 路由形成有效中介，或 D6 effective |
| A02 | D2 output_visible_asymmetric | D5 output_constraint_regulating | A02 完整三边不对称 | D5 competition/feedback，或 D4 continuous |
| A03 | D3 constraint_mediated_by_output | D2 output_supported | A03 output-control feedback | D3 mixed/input-mediated/direct_only/blocked |
| A04 | D4 conversion_continuous | D6 resource_interface_effective | A04 转换交接 | D3 mixed/output-mediated，或 D6 limited/blocked |

A03 不再依赖 D1；两个维度均可由冻结 S03 的主体容量、输出通道、约束节点和 input absent 推出。D2 以 node_availability 容量家族为区分性证据，D3 以 output→constraint 的完整关系闭包家族为区分性证据；共享 subject→output 只作连接边，不重复计票。

## 4. 最近邻

- A01/A04：D6 limited/blocked 对 D4 continuous + D6 effective；
- A02/A04：D2 asymmetric + D5 regulating 对 D4 continuous；
- A03/A04：D3 output-mediated + D2 supported 对完整资源转换；
- A01/A03：constraint absent/无中介 对 output-mediated feedback；
- A02/A03：regulating 三边不对称对 feedback 三边全有效；
- A01/A02：D1 supply continuous、输出非 asymmetric 对 D2 asymmetric + D5 regulating。

两个机制均完整过门且边界仍不唯一时保留双候选；不得固定排序。候选盘核心不同必须 boundary_sensitive。
