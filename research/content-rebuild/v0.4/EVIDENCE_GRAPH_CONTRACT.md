# EvidenceGraph 合同：relationEffectiveness 与 E1—E6

状态：`research_candidate`

## 1. 关系输入与标准化

`rawRelations` 只记录当前排盘库可确定的结构关系：

| 字段 | 类型 / 枚举 | 约束 |
| --- | --- | --- |
| `relationId` | 非空字符串 | 候选盘内唯一 |
| `kind` | `generates / controls / same_role / combines / clashes / punishes / harms` | 五行生克、同类或合冲刑害原始关系 |
| `sourceObjectKey` | occurrence 的 `objectKey` | 必须指向具体端点 |
| `targetObjectKey` | occurrence 的 `objectKey` | 必须指向具体端点 |
| `direction` | `forward / undirected / unknown` | 生、克为 `forward`；同类及合冲刑害为 `undirected`；方向不充分时为 `unknown` |
| `originClusterKey` | 非空字符串 | 该关系的同源去重键 |

十神只把具体端点映射为 `input / peer / output / resource / constraint` 功能角色，不增加第二条证据。合冲刑害只证明两个端点存在结构接触；本合同不推断合化成功、吉凶、内部/外部范围、生成/完成阶段或人格行为。

## 2. relationEffectiveness 唯一化公式

输出仅允许：`effective / limited / blocked / unknown`。

### 2.1 端点与方向

对每条关系先读取两个端点的 `nodeAvailability`：

1. 任一端点为 `unknown`，或 `direction=unknown`：输出 `unknown`，只保留 raw relation。
2. 任一端点为 `absent`：输出 `blocked`。
3. 两端均为 `usable`：进入同对象竞争检查；无竞争则为 `effective`。
4. 两端均已观察、至少一端为 `limited` 且没有 `absent/unknown`：输出 `limited`。

`blocked` 表示关系端点在该候选盘内确定不可成立；`unknown` 表示端点或方向资料不足。不能把 raw relation 的存在直接写成 `effective`。

### 2.2 同对象竞争

同一具体 `objectKey` 在同一方向上同时连接两个或更多不同对端，且这些关系争用同一个作用对象时，形成：

`competitionKey = candidateId + sharedObjectKey + direction + relationClass`

其中 `relationClass` 仅为 `generate / control / peer_contact / branch_contact`。竞争组内原本可为 `effective` 的边统一降为 `limited`；不选择胜者、不设原型优先级。仅共享抽象角色但不共享具体 `objectKey` 的边不构成竞争。

### 2.3 中介链

一条有向路径的状态按最弱环节确定：

- 所有节点为 `usable` 且所有边为 `effective`：`effective`；
- 没有 `blocked/unknown`，但至少一个节点或边为 `limited`：`limited`；
- 任一节点或边为 `blocked`：`blocked`；
- 没有 `blocked`，但任一节点或边为 `unknown`：`unknown`。

中介路径和其中的单边共享相同来源簇时，只形成一组结构证据，不能重复计票。

### 2.4 raw-only 条件

下列情况只能保留 raw relation，不能声明 `effective`：

- 端点、方向或候选位置未知；
- 合关系缺少项目尚未定义的合化条件；此时只记录 `combines` 接触，不记录合化结果；
- 只有十神名称而没有具体 occurrence 端点；
- 关系是从人格、自述、职业或问题答案反推而来。

冲、刑、害可按端点可用性判定“接触是否有效”，但该状态不等于吉凶或人格效应。

### 2.5 同源去重与候选聚合

- 同一 `originClusterKey` 派生的 raw edge、角色别名和中介子路径只算一个来源簇。
- 每个候选盘独立计算；所有候选同态才聚合为该态。
- 候选状态不同或任一候选为 `unknown` 时聚合为 `unknown`，并由 E6 标记 `boundary_sensitive`。

## 3. E1—E6

每个证据节点输出：`established / candidate / conflicted / not_supported / boundary_sensitive`，并携带 `originClusterKeys`、支持边、反证边和候选盘状态。

### E1：节点可用性证据

- 输入：所有 occurrence、`seasonalStrength`、`missingPositions`。
- 计算：执行 `nodeAvailability`；按角色和来源簇去重。
- 输出：`role -> availability` 节点。
- 反证：完整位置下角色 `absent`；未知：聚合 `unknown`。
- 状态：所有候选同一已知态为 `established`；仅有限态可支撑但不足核心阈值为 `candidate`；同时存在相反已知态为 `boundary_sensitive`；同一候选内支持与阻断事实并存为 `conflicted`；确定缺失为 `not_supported`。

### E2：有向生克链证据

- 输入：`generates / controls` raw relations、端点 E1。
- 计算：执行单边与中介链公式。
- 输出：有向边与规范化路径。
- 去重：同一具体端点对、方向、`originClusterKey` 为一组。
- 反证：端点 `absent`、边 `blocked` 或只有相反方向有效。
- 状态：所需路径 `effective` 为 `established`；仅 `limited` 为 `candidate`；有效与阻断竞争为 `conflicted`；路径确定不存在为 `not_supported`；候选盘结果不同为 `boundary_sensitive`。

### E3：同类与合冲刑害接触证据

- 输入：`same_role / combines / clashes / punishes / harms` raw relations、端点 E1。
- 计算：只判定接触的 relationEffectiveness，不推断现代行为或合化结果。
- 输出：无向接触边。
- 去重：同一端点对排序后加 `kind + originClusterKey`。
- 反证：端点 `absent`；未知：端点或方向未决。
- 状态条件与 E2 相同。

### E4：结构张力证据

- 输入：两条共享一个具体端点来源簇的规范化路径，且两条路径承担不同结构功能。允许的张力形态只有：`effective support + limited/blocked interface`，或同一端点同时承接两种方向/功能的 `effective functional handoff`。
- 计算：A01 使用连续供能与受限收束；A02 使用主体生成与约束作用在同一 output 端点的功能对置；A03 使用 constraint→input 与 input→subject 的同源中介交接；A04 使用 subject→output 与 output→resource 的同源转换交接。不得把两个独立现象拼成心理矛盾。
- 输出：`pathA + pathB + sharedEndpointObjectKey + sharedOriginClusterKey + tensionKind`。
- 去重：`sharedEndpointObjectKey + sharedOriginClusterKey + tensionKind`。
- 反证：路径来源完全独立、没有共享具体端点，或所需路径 blocked/unknown。
- 状态：两条所需路径达到该形态规定状态为 `established`；任一仅 limited 为 `candidate`；支持与排除同时成立为 `conflicted`；无共享端点来源簇为 `not_supported`；候选变化为 `boundary_sensitive`。

### E5：排除与最近邻证据

- 输入：E1—E4 及谓词合同中的明确排除/边界条件。
- 计算：逐原型执行排除，再执行成对最近邻边界；不使用固定优先级。
- 输出：排除边和 `candidateMechanisms` 集合。
- 去重：同一排除事实或边界路径按其 `originClusterKey` 只计一次。
- 反证：排除条件命中；未知：边界所需路径为 unknown。
- 状态：唯一机制且排除未命中为 `established`；多机制仍有未决边界为 `candidate`；支持与排除同候选并存为 `conflicted`；无机制达门为 `not_supported`；候选盘核心不同为 `boundary_sensitive`。

### E6：候选盘稳定性证据

- 输入：每个有限候选盘的 E1—E5 完整结果。
- 计算：比较核心机制、排除和最近邻结果，不做多数票。
- 输出：聚合最终状态与每候选轨迹。
- 去重：相同 `candidateId` 只保留一次；相同事实来源不因候选复制增加家族数。
- 反证：任两个合理候选核心不同。
- 状态：所有候选唯一同核为 `established`；候选尚缺事实为 `candidate`；同候选支持与排除并存为 `conflicted`；均不成立为 `not_supported`；任两个合理候选核心不同为 `boundary_sensitive`。

## 4. 独立家族

核心计数只允许以下家族：`node_availability`、`directed_relation`、`branch_contact`、`same_origin_tension`、`exclusion_boundary`、`candidate_stability`。同一 `originClusterKey` 在多个家族产生的派生表达，核心成立门仍只贡献一个 origin cluster；问题答案与 manifestation 永远不属于证据家族。
