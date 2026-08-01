# D1—D6 静态结构维度合同

状态：`research_candidate`

维度只组织静态结构，不表达人格、行为、恢复能力、内外范围或生成/完成阶段。每个维度必须由规范化 E1—E6 推出，不能作为输入预填。

## 1. 通用状态与门槛

每个维度输出本节列出的枚举值，并携带：`evidenceFamilies`、`originClusterKeys`、`supportPaths`、`counterPaths` 和逐候选结果。

核心机制成立必须同时满足：

1. 至少两个不可重复的结构维度达到该机制要求；
2. 至少两个独立证据家族；
3. 至少两个不同 `originClusterKey`；
4. 一项 E4 同源核心张力；
5. 排除规则未命中；
6. 最近邻存在本文件第 4 节定义的可执行边界；
7. 所有合理候选盘保持同一核心。

不满足任一项都不得授予核心。问题答案不得补足维度、家族、来源簇或张力。

## 2. 维度定义

### D1 供能链连续性

输出：`supply_continuous / supply_limited / supply_blocked / unresolved`

- 必需证据：E1 中 `input`、`subject`；E2 中 `input -> subject`。
- `supply_continuous`：两节点 usable 且路径 effective。
- `supply_limited`：无 blocked/unknown，至少一节点或边 limited。
- `supply_blocked`：任一必需节点 absent 或路径 blocked。
- 排除：只有角色名、无具体端点；或同月令链被重复计票。
- 降级/冲突：同候选出现有效与阻断路径为 `unresolved` 并由证据标 `conflicted`。
- 时间：候选不一致则 `unresolved`，E6=`boundary_sensitive`。

### D2 输出—主体容量关系

输出：`output_visible_asymmetric / output_supported / output_limited / unresolved`

- 必需证据：输出存在 `visible` occurrence；E1 中 `output`、`subject`；E2 中 `subject -> output`。
- `output_visible_asymmetric`：output usable、subject limited、关系 limited，且限制原因来自 subject 端点。
- `output_supported`：output 与 subject usable，关系 effective。
- `output_limited`：输出可见但 output limited，或关系 limited 且不满足不对称条件。
- 排除：输出仅 hidden；端点 absent；把环境敏感或恢复体验当容量事实。
- 冲突/时间：支持与阻断并存，或候选不一致，输出 `unresolved`。

### D3 约束路由

输出：`constraint_mediated / constraint_direct_only / constraint_blocked / mixed / unresolved`

- 必需证据：constraint、input、subject、output 节点，以及 E2 有向路径。
- `constraint_mediated`：`constraint -> input -> subject -> output` 为 effective，且直接 `constraint -> subject` 不是唯一有效路径。
- `constraint_direct_only`：直接 `constraint -> subject` effective，而中介链 limited/blocked/not_supported。
- `constraint_blocked`：constraint absent，或所有作用路径 blocked。
- `mixed`：直接与中介路径均 effective；它不是 A03 核心通过态。
- 排除：方法化、内部质检或首版延迟等行为描述。
- 时间：候选不一致则 `unresolved`。

### D4 输入—输出—资源转换

输出：`conversion_continuous / conversion_limited / conversion_blocked / unresolved`

- 必需证据：input、subject、output、resource 节点及 `input -> subject -> output -> resource` 路径。
- `conversion_continuous`：全部节点 usable、全部边 effective。
- `conversion_limited`：无 blocked/unknown，但至少一个节点或边 limited。
- `conversion_blocked`：任一必需节点 absent 或路径边 blocked。
- 排除：意义价值验收、灵感淘汰或完成度行为。
- 冲突/时间：有效与阻断路径并存或候选不一致，输出 `unresolved`。

### D5 输出—约束接口

输出：`output_constraint_coupled / shared_endpoint_competition / uncoupled / unresolved`

- 必需证据：output、constraint 节点及二者之间的 E2 或 E3 关系。
- `output_constraint_coupled`：两节点 usable，具体端点接触 effective。
- `shared_endpoint_competition`：命中 relationEffectiveness 的同对象竞争，相关边降为 limited。
- `uncoupled`：端点完整但关系确定不存在或 blocked。
- 排除：将反馈、气氛或环境响应作为关系输入。
- 时间：候选不一致则 `unresolved`。

### D6 资源收束接口

输出：`resource_interface_effective / resource_interface_limited / resource_interface_blocked / unresolved`

- 必需证据：output、resource 节点及 `output -> resource`。
- `resource_interface_effective`：两节点 usable 且边 effective。
- `resource_interface_limited`：无 blocked/unknown，至少一节点或边 limited。
- `resource_interface_blocked`：resource absent 或边 blocked。
- 排除：恢复、裁剪倾向、完成阶段等未批准字段。
- 时间：候选不一致则 `unresolved`。

## 3. 四机制的两维门

| 机制 | 必需维度 1 | 必需维度 2 | 必需同源张力 | 排除 |
| --- | --- | --- | --- | --- |
| A01 | D1=`supply_continuous` | D6=`resource_interface_limited` 或 `resource_interface_blocked` | 连续供能链与受限收束接口共享来源簇 | D6 effective；D3 mediated 由最近邻干净排除；direct_only/mixed 与支持并存时为 conflicted |
| A02 | D2=`output_visible_asymmetric` | D5=`output_constraint_coupled` | 可见输出与主体限制共享来源簇 | D4 continuous，或输出并非 visible |
| A03 | D3=`constraint_mediated` | D1=`supply_continuous` | 约束链与供能/输出中介链共享来源簇 | D3 direct_only、mixed 或 blocked |
| A04 | D4=`conversion_continuous` | D6=`resource_interface_effective` | 连续转换与资源接口共享来源簇 | D6 limited/blocked，或关键约束直接阻断主体 |

这里没有为了 A03/A04 凑第三维度的要求，也没有 D7。辅助关系只能支持路径说明，不能被抬高为第三个核心维度。

## 4. 最近邻边界

边界逐对执行，不设固定优先级：

| 候选对 | 可执行边界 |
| --- | --- |
| A01 / A04 | D6 limited/blocked 指向 A01；D4 continuous 且 D6 effective 指向 A04 |
| A02 / A04 | D2 asymmetric 且 D4 非 continuous 指向 A02；D4 continuous、D6 effective 且 subject usable 指向 A04 |
| A03 / A04 | D3 mediated 且 A04 转换链不完整指向 A03；D4 continuous/D6 effective 且 D3 非 mediated 指向 A04 |
| A01 / A03 | D6 limited/blocked 且 D3 非 mediated 指向 A01；D3 mediated 且 D6 非受限张力指向 A03 |
| A02 / A03 | D2 asymmetric 且 D3 非 mediated 指向 A02；D3 mediated 且 D2 非 asymmetric 指向 A03 |
| A01 / A02 | D1 continuous/D6 limited 且 D2 非 asymmetric 指向 A01；D2 asymmetric/D5 coupled 且 D1 非 continuous 指向 A02 |

若两个候选都完整过门且成对边界无法唯一分开，输出 `candidate` 或 `conflicted`，不得按 A01—A04 编号回落。若合理候选盘得出不同核心，最终必须为 `boundary_sensitive`。
