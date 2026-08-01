# ChartFacts → EvidenceGraph 合同 v0.4

## 1. 计算顺序

每个候选盘必须独立执行：

```text
原子 ChartFacts
→ 校验 known/unknown 与来源
→ 建立功能节点
→ 建立原始关系边
→ 应用有效性公式
→ 按 originClusterKey 去重
→ 生成 E1—E6
→ 候选盘聚合
```

禁止跨候选盘拼出一张不存在的“最佳盘”，也禁止先选择原型再回填证据。

## 2. 规范化图对象

```text
FunctionalRole = subject | input | peer | output | resource | constraint | recovery | pruning
Availability   = usable | limited | absent | unknown
Visibility     = visible | hidden | absent | unknown
EdgeState      = effective | limited | blocked | unknown
EdgeKind       = supports | produces | exchanges | constrains | checks | combines | clashes | punishes | harms | competes
Stage          = input | generation | output | completion | unknown
Scope          = internal | external | mixed | unknown
```

`recovery` 与 `pruning` 是待批准的规范化代理，不是新的十神或原子人格事实；它们的 ChartFacts 生成公式仍为 blocker。每个 node/edge 必须保留 `sourceKey[]` 与 `originClusterKey[]`。规范化图不包含人格含义。v0.4 夹具允许直接输入该图，是因为 Issue #11 明确允许规范化关系节点与边；这不等于当前运行时已能从四柱生成它。

## 3. 通用状态公式

对任一 E、D 或谓词 `X`：

- `established`：所有必需字段 known；公式在每个合理候选盘为 true；反证公式均为 false；独立性门通过；
- `candidate`：方向公式为 true，但有必需字段 unknown、容量仅 limited、缺一个独立家族，或现代翻译仍待来源；
- `conflicted`：同一候选盘内支持公式与关键反证公式同时为 true；
- `not_supported`：所有候选盘中支持公式均为 false，且没有可能改变结果的 unknown；
- `boundary_sensitive`：不同候选盘对同一核心公式给出不同状态、不同维度或不同最近邻优先结果。

状态优先级是：`boundary_sensitive > conflicted > candidate > established/not_supported`；它不是人格强度。

## 4. 去重键

规范键：

```text
candidateId + originClusterKey + mechanismPurpose
```

`sourceKey` 用于追踪原子来源，`originClusterKey` 用于独立性。以下必须共享一个 `originClusterKey`：

- 月支本身；
- 该月支的主气/余气藏干；
- 仅因这条月令链被识别为相关的透干；
- 从上述对象直接派生的 seasonal、root、visibility 或 relation 事实。

它们可共同加强一个节点，但不得被包装成 E1、E2、E3 三个独立家族来通过核心门。非月令事实若来自同一柱同一藏干，也只计一簇。

## 5. E1—E6 定义

### E1｜容量与季节

- **输入：** `monthBranch`、元素、`seasonalStrength`、`rootOccurrence`、藏干比例、候选盘 unknown。
- **步骤：** 按批准的容量公式得到各功能节点 `Availability`；当前公式尚缺，禁止用十神数量替代。
- **输出：** `CapacityNode(role, availability, sources, clusters)`。
- **去重：** 月令链一簇；相同根位置一簇。
- **未知/反证：** 未知时柱为 unknown；`limited/absent` 是相关功能的反证，不是相反人格证据。
- **候选聚合：** 全盘同值才稳定；usable 与 limited/absent 跨盘变化为 `boundary_sensitive`。
- **当前闭合度：** 原始输入可算，`nodeAvailability` 组合公式 `definition_pending`。

### E2｜显隐与可见接口

- **输入：** `visibleStems`、`hiddenStems`、功能角色、候选盘。
- **步骤：** 同角色任一非日主天干透出为 visible；无透出但有藏干为 hidden；完整四柱均无为 absent；未知时柱且三柱未见为 unknown。
- **输出：** `VisibilityNode(role, visibility, sources, clusters)`。
- **去重：** 同一干或藏干只计一次；月令链仍为一簇。
- **未知/反证：** hidden 不是 absent；unknown 不可作为反证。
- **候选聚合：** 全 visible/hidden/absent 才稳定；不同为 `boundary_sensitive`。
- **当前闭合度：** 可由现有代码唯一计算，但只说明显隐，不说明环境响应。

### E3｜功能关系

- **输入：** 功能节点、原始生克/同类/合冲刑害边、`relationEffectiveness`。
- **步骤：** 先枚举原始边，再由批准条件将边定为 effective/limited/blocked/unknown；禁止“同时出现两个十神”直接生成有效关系。
- **输出：** `FunctionalEdge(from, to, kind, state, stage, scope, sources, clusters)`。
- **去重：** 同一端点、同一作用、同一来源簇只保留一边。
- **未知/反证：** blocked 是该关系反证；unknown 只能降级。
- **候选聚合：** 关键边跨盘变化为 `boundary_sensitive`。
- **当前闭合度：** 原始边可算；有效性、阶段与作用域 `definition_pending`。

### E4｜链路连续性

- **输入：** E1 节点、E3 effective 边。
- **步骤：** 只沿 effective 边求有向可达；任一必需节点 limited/unknown 或边 limited/unknown 时路径最多 candidate；blocked/absent 使路径不成立。
- **输出：** `PathNode(pathId, orderedRoles, state, bottleneck, sources, clusters)`。
- **去重：** 共享同一边或同一来源簇的多条路径不能充当独立家族。
- **未知/反证：** 首个 blocked/absent 为反证；unknown 为显式 bottleneck。
- **候选聚合：** 核心路径在候选盘间改变即 `boundary_sensitive`。
- **当前闭合度：** 算法已唯一；输入边有效性未闭合，所以当前不能 established。

### E5｜结构关系

- **输入：** raw stem/branch relations、端点、`relationEffectiveness`、竞争关系。
- **步骤：** 枚举关系后检查适用条件；只输出生效或受限关系，不从“出现合冲刑害”直接推出张力。
- **输出：** `StructuralRelation(kind, endpoints, state, stage, sources, clusters)`。
- **去重：** 同一端点组合、关系种类和来源簇一次。
- **未知/反证：** 适用条件 unknown 时 candidate；blocked 为不支持。
- **候选聚合：** 关键关系生效与否跨盘变化为 `boundary_sensitive`。
- **当前闭合度：** 原始出现可算；实际生效条件 `definition_pending`。

### E6｜反证与时间稳定

- **输入：** E1—E5 的支持、blocked/absent/unknown、全部候选盘结果。
- **步骤：** 对每个目标公式生成支持集合、关键反证集合和 unknown 集合；再按通用状态公式聚合。
- **输出：** `EvidenceAssessment(targetId, status, supportRefs, counterRefs, unknownRefs, candidateResults)`。
- **去重：** 反证与支持使用相同 `originClusterKey` 时记录为同源冲突，不增加独立家族。
- **未知/反证：** unknown 不得变成 absent；答题结果不得进入 E6。
- **候选聚合：** 先逐盘裁决，再聚合；不得只比较旧 `ChartCue`。
- **当前闭合度：** 聚合算法已唯一；上游关键字段缺失时只能返回 candidate/conflicted/boundary_sensitive。

## 6. 独立家族计数

核心门先得到满足公式的家族集合，再应用来源簇约束：

1. 至少两个家族 ID；
2. 至少两个不同 `originClusterKey`；
3. 至少一个家族为 E1、E3 或 E4；
4. E6 只记录稳定与反证，不能单独充当第二个正向家族；
5. E2 的显隐不能把同一月令链变成额外票。

不满足时最多为 `candidate`；只剩一个来源簇时输出结构特质，不授予核心。
