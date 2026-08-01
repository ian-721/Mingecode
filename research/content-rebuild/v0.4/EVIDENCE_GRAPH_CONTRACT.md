# EvidenceGraph 合同：完整关系闭包、effectiveness 与 E1—E6

状态：`research_candidate`

## 1. raw relation 不是可选输入

生克与同类关系必须按 `ROLE_RELATION_MATRIX.md` 对全部 observed occurrence 对生成。fixture input 出现 `rawRelations`、手工 edge 或目标路径即 schema 失败。生成闭包必须同时满足：非法边 0、缺失必需边 0、来源去重后重复 0、意外手选边 0。

合冲刑害只有具体干支对象身份完整时才能作为独立 raw-only contact；否则不使用。十神只映射角色，不增加第二条边或第二票。

## 2. relationEffectiveness

输出仅允许：`effective / limited / blocked / unknown`。

### 2.1 单边

对闭包中的每条规范化关系：

1. 任一端点的 nodeAvailability 为 unknown：`unknown`；
2. 任一端点为 absent：`blocked`；正常闭包不会为 absent 节点生成对象边，此状态只用于候选聚合或 raw-only contact；
3. 两端均 usable：无竞争为 `effective`；
4. 两端均已观察且至少一端 limited：`limited`。

raw relation 的存在不等于 effective。

### 2.2 同对象竞争

对同一 `kind + direction + sharedObjectKey + counterpartRole` 分组。若一个具体对象同时连接两个或更多同角色对端，它们争用同一作用接口：

- 组内本可 effective 的边统一降为 limited；
- 已 limited/blocked/unknown 的边不升级；
- 不选胜者，不按原型或 fixture 顺序排序；
- 仅共享抽象角色、但不共享具体 objectKey，不构成竞争。

例如一个 output 对象同时控制两个 constraint 对象时，两条 `output -> constraint` 都降为 limited；两个 constraint 对象同时控制同一 subject 时亦然。

### 2.3 路径

- 全部节点 usable、边 effective：path effective；
- 无 blocked/unknown，至少一节点或边 limited：path limited；
- 任一端点/边 blocked：path blocked；
- 无 blocked 但有 unknown：path unknown。

路径只是边的组合，不形成额外来源票。

### 2.4 raw-only

端点身份或候选位置未知、合化条件未定义、只有十神名称、或关系来自人格/答案/自述时，不得声明 effective。合冲刑害 contact 即使端点有效，也只证明结构接触，不证明合化、吉凶或行为。

### 2.5 来源去重与候选聚合

- `canonicalRelationKey` 在候选盘内唯一；关系携带两端去重后的 `originClusterKeys`。
- 同一月令链、同一具体对象的角色别名和派生路径只计一个来源簇。
- 每个候选盘独立生成闭包并计算；全部候选同态才聚合为该态。
- 候选状态不同或任一 unknown 时聚合 unknown，并由 E6 标 `boundary_sensitive`。

## 3. E1—E6

证据状态只允许：`established / candidate / conflicted / not_supported / boundary_sensitive`。

### E1 节点可用性

- 输入：seasonalStrength、occurrences、missingPositions。
- 计算：统一 nodeAvailability，按 role 与 originClusterKey 去重。
- established：候选同一已知态；candidate：关键节点仅 limited；not_supported：完整位置下 absent；boundary_sensitive：候选已知态不同；conflicted：同候选事实自相矛盾。

### E2 完整有向生克图

- 输入：全部 observed occurrences。
- 计算：先生成完整矩阵闭包，再计算每条 generates/controls 与路径。
- 输出：规范边、effectiveness、路径和四项闭包计数。
- established：关键路径达到规定状态且四项闭包计数全 0；candidate：关键路径 limited；conflicted：同一结构同时有支持与竞争/反证；not_supported：路径端点缺失；boundary_sensitive：候选结果不同。

### E3 同类与具体 contact

- 输入：矩阵生成的 same_role；可选、身份完整的合冲刑害 contact。
- 计算：同类按具体对象对生成；contact 只保留 raw-only 权限。
- 输出：无向边；端点排序去重。
- 状态规则同 E2，但没有具体身份时必须 not_supported，不得构造匿名 clash。

### E4 同源结构张力

只允许以下四种已版本化形态：

| 机制 | 张力形态 | 共享具体端点 |
| --- | --- | --- |
| A01 | subject→output 有效，而 output→resource limited/blocked | output |
| A02 | subject→output limited、output→constraint effective、constraint→subject limited | output 与 subject |
| A03 | subject→output→constraint effective，同时 constraint→subject effective | constraint |
| A04 | subject→output 与 output→resource 均 effective | output |

A03 的张力是输出调节约束与约束直接作用主体构成的反馈环；不再使用 constraint→input 作为必需链。竞争使某条关键边 limited 时，张力降级或 conflicted。路径无共享具体端点、缺来源簇或 unknown 时不得 established。

### E5 排除与最近邻

- 输入：E1—E4、D1—D6、完整闭包。
- 计算：先应用结构排除，再执行全部成对边界；不使用固定优先级。
- established：唯一机制；candidate：边界路径 limited；conflicted：核心支持与明确结构反证并存；not_supported：没有机制过门；boundary_sensitive：合理候选核心不同。

### E6 候选盘稳定性

- 输入：每个有限候选盘的 E1—E5。
- 计算：比较完整核心结果，不做多数票；相同 factSet 被不同 candidateId 引用也不增加来源数。
- 所有候选唯一同核为 established；已知核心不同为 boundary_sensitive；其余按 candidate/conflicted/not_supported 保留。

## 4. 独立证据家族

核心只计：`node_availability`、`complete_relation_closure`、`branch_contact`、`same_origin_tension`、`exclusion_boundary`、`candidate_stability`。同一 originClusterKey 在多个派生表达中只贡献一个来源簇；问题答案永不进入证据家族。
