# Real Occurrence Multiplicity Contract v0.5

状态：`research_candidate / ADR-0013 Accepted`

时间口径：`civil_time_v1`

## 1. 权威关系

本合同由 [ADR-0013（Accepted）](../../../docs/DECISIONS/ADR-0013-real-occurrence-multiplicity.md) 路由，并继承 [`v0.4`](../v0.4/README.md) 未被本文件明确替代的内容。v0.4 的 occurrence、availability、role matrix、closure、E/D、排除、最近邻、candidate aggregation 与 manifestation 边界继续有效。

本文件只替代 v0.4 的 automatic cardinality competition 与 atomic-path-to-decision 接口。它不修改 threshold、role mapping、D1—D6、机制门或 `/test`。

## 2. 固定类型

### 2.1 DecisionInterfaceKey

```ts
type DecisionInterfaceKey =
  | "generates:input>subject"
  | "generates:subject>output"
  | "generates:output>resource"
  | "controls:output>constraint"
  | "controls:constraint>subject"
  | "generates:constraint>input";

type InterfaceBaseState = "effective" | "limited" | "absent" | "unknown";
type InterfacePathState = InterfaceBaseState | "conflicted";
```

上述枚举顺序也是唯一序列化顺序。interface identity 只等于 `DecisionInterfaceKey`；candidate、sample、profile、expected、answer、mechanism、archetype、target、result、object/origin identity 及其数量均不得进入 key。

`peer`、`same_role` 与未列入六接口的其他合法 relation 继续保留在 atomic closure 和 E3/provenance 中，但不投影为 decision interface，也不得偷偷映射为 `subject` interface。

### 2.2 InterfaceContributor

```ts
interface InterfaceContributor {
  readonly interfaceKey: DecisionInterfaceKey;
  readonly sourceDedupeKey: string;
  readonly representativeRelationKey: string;
  readonly atomicRelationKeys: readonly string[];
  readonly sourceOriginClusterKey: string;
  readonly targetOriginClusterKey: string;
  readonly originClusterKeys: readonly string[];
  readonly sourceObjectKeys: readonly string[];
  readonly targetObjectKeys: readonly string[];
  readonly state: "effective" | "limited" | "unknown";
}
```

`sourceDedupeKey` 的逻辑 tuple 继续使用 v0.4 的五项，但 v0.5 必须用无碰撞的 JSON array 序列化：

```ts
JSON.stringify([
  kind,
  sourceRole,
  targetRole,
  sourceOriginClusterKey,
  targetOriginClusterKey,
])
```

不得用 delimiter join 或依赖 origin key 不含标点；真实 adapter 的 origin key 可以包含 `:`。同一 key 只形成一个 contributor。`representativeRelationKey` 是组内字典序最小的 canonical relation key；`atomicRelationKeys` 保存排序后的全部 alias keys。`originClusterKeys`、source/target object keys 都必须去重、排序。不同来源形成不同 contributor，但 contributor 数量不投票、不改变 interface base state，也不产生 contention。

### 2.3 RelationInterface

```ts
interface RelationInterface {
  readonly interfaceKey: DecisionInterfaceKey;
  readonly state: InterfaceBaseState;
  readonly contributorKeys: readonly string[];
  readonly atomicRelationKeys: readonly string[];
  readonly originClusterKeys: readonly string[];
  readonly contentionFactKeys: readonly string[];
  readonly invalidatedByFactKeys: readonly string[];
}
```

`contentionFactKeys` 与 `invalidatedByFactKeys` 是 overlay provenance，不重写 `state` 或 atomic relation effectiveness。

### 2.4 AtomicPathWitness、InterfacePath 与 E4 witness

```ts
type InterfacePathId =
  | "input_subject"
  | "subject_output"
  | "output_resource"
  | "output_constraint"
  | "constraint_subject"
  | "constraint_input"
  | "output_mediated"
  | "input_mediated"
  | "conversion"
  | "output_constraint_feedback";

type WitnessState = "effective" | "limited" | "unknown" | "conflicted";

interface AtomicPathWitness {
  readonly witnessKey: string;
  readonly pathId: InterfacePathId;
  readonly interfaceKeys: readonly DecisionInterfaceKey[];
  readonly contributorKeys: readonly string[];
  readonly atomicRelationKeys: readonly string[];
  readonly objectPath: readonly string[];
  readonly originPath: readonly string[];
  readonly baseState: Exclude<InterfaceBaseState, "absent">;
  readonly state: WitnessState;
  readonly contentionFactKeys: readonly string[];
  readonly counterRelationKeys: readonly string[];
}

interface InterfacePath {
  readonly pathKey: InterfacePathId;
  readonly interfaceKeys: readonly DecisionInterfaceKey[];
  readonly baseState: InterfaceBaseState;
  readonly state: InterfacePathState;
  readonly witnessKeys: readonly string[];
  readonly witnesses: readonly AtomicPathWitness[];
  readonly atomicWitnessCount: number;
  readonly representativeAtomicWitness: readonly string[];
  readonly contributorKeys: readonly string[];
  readonly atomicRelationKeys: readonly string[];
  readonly originClusterKeys: readonly string[];
  readonly involvedObjectKeys: readonly string[];
  readonly contentionFactKeys: readonly string[];
  readonly counterRelationKeys: readonly string[];
}

interface E4AtomicWitness {
  readonly witnessKey: string;
  readonly mechanism: "A01" | "A02" | "A03" | "A04";
  readonly contributorKeys: readonly string[];
  readonly atomicRelationKeys: readonly string[];
  readonly objectPath: readonly string[];
  readonly originPath: readonly string[];
  readonly absenceInterfaceKeys: readonly DecisionInterfaceKey[];
  readonly baseState: Exclude<InterfaceBaseState, "absent">;
  readonly state: "established" | "candidate" | "conflicted" | "not_supported";
  readonly contentionFactKeys: readonly string[];
  readonly counterRelationKeys: readonly string[];
}
```

direct path 的每条 canonical atomic relation 形成一个 witness；alias 因 atomic key 不同仍是不同 witness，但通过同一个 contributor key 回指。compound witness 只由相邻 direct witnesses 连接；`atomicRelationKeys`、`contributorKeys`、`objectPath` 与 `originPath` 保持 traversal 顺序，不能先排序再破坏拓扑。

path `witnessKey` 精确为 `JSON.stringify([pathId, ...atomicRelationKeys])`；E4 witness 使用 `JSON.stringify(["e4:" + mechanism, ...atomicRelationKeys, ...absenceInterfaceKeys])`。相同 key 去重。无 witness 时 `representativeAtomicWitness=[]`；否则它等于 witnessKey 排序后第一项的 `atomicRelationKeys`。

普通字符串一律使用 locale-independent UTF-16 code-unit ordinal ascending：`left === right ? 0 : left < right ? -1 : 1`。不得使用 locale、numeric、case folding 或输入顺序。固定 enum 按声明顺序；其余依次按 candidateId、sourceDedupeKey、canonical relation key、witnessKey、factKey、participant/object/origin key 排序。`invalidatedInterfaceKeys` 按 `DecisionInterfaceKey` 声明顺序。所有 union provenance arrays 先去重再按对应规则输出。

## 3. Atomic closure 与 contributor projection

每个 candidate 独立执行：

1. 按 `objectKey` 排序全部 occurrences；
2. 按 v0.4 role matrix 为每个无序对象对生成且只生成一条 relation；
3. raw count 必须为 `n * (n - 1) / 2`；
4. canonical relation keys 唯一，四项 closure diagnostics 全 0；
5. 先计算不含 contention 的 atomic base effectiveness；
6. 仅把精确匹配六个 key 的 atomic relations 按 `sourceDedupeKey` 分组为 contributors；
7. 固定生成六个 RelationInterfaces，包括没有 contributor 的接口。

正常 fan-in、fan-out、同角色 multiplicity、独立来源和 alias 都不得降低 atomic effectiveness。

`duplicateRelationAfterSourceDedupeCount` 保留 v0.4 完备性失败条件的精确定义：它只统计重复的 canonical relation key。两个不同 canonical keys 共享同一个 `sourceDedupeKey` 是合法 atomic aliases；它们折叠为一个 contributor、完整保留在 `atomicRelationKeys`，且不会增加该 diagnostic。若 canonical key 自身重复，仍然 hard fail。

## 4. Interface base state

每个接口只读取两个端点 role 的 v0.4 `nodeAvailability` 与 contributor 完备性：

1. 任一端点 `absent`：`absent`；此时不得存在 contributor，否则 schema/closure 失败。
2. 无 absent，任一端点 `unknown`：`unknown`。
3. 两端都 `usable`：`effective`。
4. 两端均已观察且至少一端 `limited`：`limited`。
5. 两端均已观察却没有 contributor：不是 `absent`，而是 deterministic closure 失败。

`unknown` 不能因没有当前 occurrence 被改写为 `absent`；缺失位置继续按 v0.4 availability 与 finite-candidate 规则处理。contention 不改变 base state。

## 5. InterfaceContentionFact

candidate 可选地携带 `interfaceContentionFacts`; 缺失等价于空数组。真实 adapter 默认输出空数组，不得根据 occurrence、object、origin 或 contributor 数量生成 fact。

`interfaceContentionFacts` 的非空值还受独立的来源授权门约束。仅以下两类来源可以提供非空 facts：（1）身份与版本均由受信任内部调用路径静态固定、且经适用合同明确授权的 deterministic producer；（2）与 ordinary runtime 不可达、仅用于合同验证的隔离 fixture / test harness。尚无经合同明确授权的 producer 时，ordinary runtime 的唯一合法值是缺失或空数组。

来自 UI、user input、`BirthInput`、external adapter DTO、API request 或除前述受信任 producer 路径以外的 ordinary runtime caller 的非空 `interfaceContentionFacts`，必须在进入 core evaluation 前 hard fail；不得过滤、忽略、静默改写为空数组或在 schema 通过后继续执行。真实 adapter 仍只能默认输出空数组。

来源授权与 payload validation 是两个独立且都必须通过的门。通过下述 exact seven-field schema、`derivationVersion`、banned-semantic scan 或 basis/provenance validation，不构成来源授权；producer identity、producer version、trusted/authorized 标记或 caller metadata 不得作为第八字段进入 payload，也不得由 `factKey` 或 caller-supplied metadata 自证。本规则不改变下述七字段 schema、现有 fixture input 或 expected assertions。

fact schema 必须精确为：

```ts
interface InterfaceContentionFact {
  factKey: string;
  interfaceKey: DecisionInterfaceKey;
  basis:
    | "mutually_exclusive"
    | "shared_capacity"
    | "path_invalidating";
  sharedEndpointObjectKey: string | null;
  participantObjectKeys: readonly string[];
  invalidatedInterfaceKeys: readonly DecisionInterfaceKey[];
  derivationVersion: "interface_contention_v1";
}
```

### 5.1 通用 validator

- 只允许上述七个字段；缺失、额外字段、错误类型或错误枚举均失败。
- `factKey` 在 candidate 内唯一、非空、与输入顺序无关；不得编码样本、profile、目标机制或预期结果。
- `participantObjectKeys` 至少两个、唯一；每个 key 必须解析到该 candidate 的 occurrence。
- `mutually_exclusive` 与 `shared_capacity` 的 participants 必须覆盖命名 interface 的至少两个不同 `sourceDedupeKey` contributors；仅两个 atomic aliases 不足。`path_invalidating` 使用 5.2 的跨接口 witness 规则，不受这一同接口基数条件约束。
- fact、participants、invalidated keys 在验证后按 canonical order 序列化；输入顺序不改变结果。
- 对 fact payload 的每个字段名，以及 `factKey` 的值，先做 Unicode NFKC、camelCase 边界拆分、小写化，再按非 ASCII 字母数字分词。精确 token `mechanism / archetype / sample / profile / expected|expectation / target / answer|answers / result|outcome` 任一命中即失败；不做 substring、locale 或模糊同义词判断。participant/object/origin 引用值不做语义扫描，只做存在性与 provenance 验证。该扫描只作用于 contention payload；fixture assertion 与 manifestation input 不在此扫描范围。

validator 的失败优先级固定为：1）递归禁用语义扫描；2）七字段 exact schema、类型与 enum；3）factKey 唯一性及 participant 基数/存在性；4）basis-specific contributor、endpoint 与 witness provenance。稳定错误码只允许：`banned_semantic_field / schema_error / duplicate_fact_key / participant_cardinality / unknown_participant / participant_interface_mismatch / alias_only_contention / shared_endpoint_mismatch / path_invalidation_mismatch`。因此带 `target` 或 `expected` 的额外字段先返回 `banned_semantic_field`，不会被泛化为 schema error。

### 5.2 basis 专用规则

`mutually_exclusive`：

- `sharedEndpointObjectKey` 必须为 `null`；
- `invalidatedInterfaceKeys` 必须为空；
- 每个 participant 必须属于命名 interface 的 contributor，且至少覆盖两个独立 contributor。

`shared_capacity`：

- `sharedEndpointObjectKey` 必须是命名 interface relation 的真实 source 或 target endpoint；
- 每个 participant 必须与该 shared endpoint 形成命名 interface 的 atomic relation；
- participants 必须覆盖至少两个不同 contributor；
- `invalidatedInterfaceKeys` 必须为空。

`path_invalidating`：

- `invalidatedInterfaceKeys` 必须非空、唯一、不得包含 `interfaceKey`；
- `interfaceKey` 与全部 `invalidatedInterfaceKeys` 的集合必须精确等于一条固定 compound path 或 E4 topology 的完整 ordered interface sequence；只命中该 sequence 的子集、分别命中多条 pairwise path，或让未声明 constituent 混入 sequence 都不足；顺序只由固定 topology 恢复，不从 fact 输入顺序推断；
- validator 必须先枚举该完整 sequence 的 concrete atomic witnesses，再逐 witness 重建 ordered `atomicRelationKeys / objectPath / originPath`。每个 participant 必须解析到该 witness 的同一个 occurrence，出现在它的 `objectPath`，并共同触达命名 interface 与每个 invalidated interface 的 constituent relation；每条 constituent relation 的 source/target object 与 origin 必须分别等于 `objectPath / originPath` 的相邻位置；
- `sharedEndpointObjectKey` 非空时，必须是该 witness 的内部 join object，且 join 两侧 relation 在该位置的 `originClusterKey` 精确相同；为 `null` 时仍必须由同一 witness 的 ordered contributor provenance 完整闭合；
- validation 输出仅是满足上述全部条件的 concrete `witnessKey` 集合。`path_invalidating` 只覆盖这个集合；不得从 interface、path 或 mechanism 聚合状态反推、扩张或补选 witness；
- constituent direct paths、未匹配 witnesses、其他 compound paths 与 interface base state 均不属于该 coverage set。

未知 participant、alias-only contention、shared endpoint 不匹配、跨无关 interface 的 invalidation、空 participant 或禁用字段都必须 hard fail，不能忽略或降级。

### 5.3 Witness-level overlay

validator 先验证 fact，再计算它覆盖的 concrete witnesses；不得先把整个 interface 标为竞争再反推 witness。

- `mutually_exclusive` 覆盖命名 interface 中至少一个端点属于 participants 的 direct witness；包含该 direct constituent 的 compound/E4 witness 同样被覆盖。
- `shared_capacity` 只覆盖命名 interface 中一端精确等于 shared endpoint、另一端精确属于 participants 的 direct witness；包含该 constituent 的 compound/E4 witness 同样被覆盖。
- `path_invalidating` 只覆盖 5.2 已计算出的 concrete compound/E4 `witnessKey`；overlay 阶段不得重新做更宽的 role-level、interface-level、path-level 或 mechanism-level 匹配。
- covered witness 加入 factKey、`state=conflicted`，并把它的 atomic keys 记入 `counterRelationKeys`；未覆盖 witness 保持 base state。
- 同一 witness 命中多个 facts 时只合并去重排序后的 fact keys，不重复计票。
- `InterfacePath.state=conflicted` 当且仅当至少一个 witness conflicted；这是 matched-witness reduction，不能反向改写同 path 的未匹配 witness。其他正常 witness 不能抵消明确冲突，未匹配 witness 的 state、fact provenance 与 counter provenance 保持 base；path provenance 只是全部 covered witnesses 的 fact/relation union。
- E4 也逐 concrete witness 应用同一 coverage set：只把精确匹配的 E4 witness 标为 conflicted，再按第 7 节的机制聚合顺序 reduction。不得因为一个 path 或某机制的聚合结果 conflicted，就污染该机制的其他 E4 witness 或任何其他机制；其他机制若要 conflicted，必须有自己的 concrete witness 独立满足 5.2 全部条件。
- `mutually_exclusive` / `shared_capacity` 只把 factKey 加入命名 `interfaceKey` 的 `RelationInterface.contentionFactKeys`；其他 interface 的两个 provenance arrays 不因 compound/E4 传播而改变。
- `path_invalidating` 把 factKey 加入命名 `interfaceKey` 的 `contentionFactKeys`，并分别加入每个 `invalidatedInterfaceKeys` 成员的 `invalidatedByFactKeys`；不得把它加入其他 constituent interface。若一个 interface 分别被不同 facts 命名和 invalidated，两个数组独立去重并按 factKey ordinal 排序。两数组都只是 interface-level 诊断 provenance，不改变 `RelationInterface.state` 或 direct path state。
- base interface state、path baseState 与 atomic relation effectiveness 永不被 overlay 改写。
- D5 读取 `output>constraint` 或 `constraint>subject` 上合法的 `mutually_exclusive/shared_capacity` 时输出既有 `shared_endpoint_competition`；E2/E4/排除按 v0.4 conflicted 传播规则处理。

## 6. Direct 与 compound paths

六个 direct path 与 interface key 一一对应。compound paths 固定为：

```text
output_mediated = subject>output + output>constraint
input_mediated = constraint>input + input>subject
conversion = input>subject + subject>output + output>resource
output_constraint_feedback = subject>output + output>constraint + constraint>subject
```

相邻 atomic relations 必须在共享端点同时满足相同 `objectKey` 与相同 `originClusterKey`。role-level interface state 不能凭空制造 compound path。每条 path 保存全部 canonical atomic witness sets；witness 数量不投票。

未命中 contention 时，path state 按以下顺序计算：

1. 任一 constituent interface `absent`：`absent`；
2. 无 absent 且任一 `unknown`：`unknown`；
3. compound path 没有 concrete atomic witness：`absent`；
4. 有 witness 且任一 constituent `limited`：`limited`；
5. 其余：`effective`。

每个已存在 witness 按 constituent atomic effectiveness 得到 effective / limited / unknown baseState；它本身不能为 absent。overlay reduction 按 5.3 执行。多个正常 witnesses、contributors 或 origins 不能导致 conflicted。

## 7. E4 与 atomic witness

E4 必须同时读取 interface/path state 与具体 atomic witness。先按第 6 节生成 topology-correct witness；每个 witness 的 ordered constituent states 来自同一 traversal 中各 direct atomic witness 的 base state，不能用 interface 聚合状态替代具体 constituent，也不能从 mechanism、sample 或 expected 选择 witness。

每个 concrete witness 严格按以下顺序裁决：

1. 该 witness 的 `witnessKey` 被 5.3 的合法 overlay coverage 精确命中：`conflicted`；
2. 任一必需 interface/path 或 constituent state 为 `unknown`：`not_supported`；
3. 任一必需 interface/path 为 `absent`，或不存在 topology-correct concrete witness：`not_supported`；
4. 命中下表 strong pattern：`established`；
5. 命中下表 frozen weak residual：`candidate`；
6. 其余 present-known witness：保留 witness provenance，但 state 为 `not_supported`。

| mechanism | ordered constituent states | strong pattern | frozen weak residual（strong 后） |
| --- | --- | --- | --- |
| A01 | `subject>output / output>resource` | `effective / limited` | `limited / limited` |
| A02 | `subject>output / output>constraint / constraint>subject` | `limited / effective / limited` | 首边必须为 `limited`，三边全部属于 `effective / limited` 且不等于 strong；即 `L/E/E`、`L/L/E`、`L/L/L` |
| A03 | 同 A02 三边 | `effective / effective / effective` | 三边全部属于 `effective / limited` 且至少一边 `limited` |
| A04 | `subject>output / output>resource` | `effective / effective` | 两边全部属于 `effective / limited` 且至少一边 `limited` |

A01 的 v0.5 特别收紧优先于 v0.4 的 legacy blocked 分支：`output>resource=absent` 只由 interface/path 与 D6 保存 absence provenance；E4 A01 必须为 `not_supported`，不得制造 E4 witness 或 output→resource atomic relation。因此 v0.4 raw weak 中的 blocked 情形在 v0.5 已被步骤 3 截断，strong 后的 residual candidate 只剩 `limited / limited`。

A02 还要求三边 witness 回到同一 subject `objectKey + originClusterKey`；A03 只要求 output/constraint 连续 witness，不继承 A02 的闭环条件；A01/A04 都要求共享 output 的具体连续 witness。

candidate-local E4 的状态仍精确为 `established / candidate / conflicted / not_supported`，不得输出 `boundary_sensitive`。同一机制只在所有 concrete witnesses 完成上述单 witness 裁决后聚合，顺序固定为 `conflicted > established > candidate > not_supported`；unknown witness 不能压过另一个已知 established witness。`absenceInterfaceKeys` 仅是已有 witness 的诊断字段；它不能创建 witness 或越过上述 absent gate。

unknown boundary 只在 candidate aggregation 出现：任一 candidate-local node、atomic relation、interface 或 path unknown 时，E6 与 top-level finalState 为 `boundary_sensitive`。manifestation answers 不得消除该 boundary。

这一定义不允许用匿名 role path 代替物理连续性，也不允许用 target mechanism 选择 witness。

## 8. D1—D6 与 nearest-neighbour

状态枚举、阈值与机制门继承 v0.4，只把读取源改为 interface paths。兼容映射固定为 `effective→effective / limited→limited / absent→blocked / unknown→unknown`；`conflicted` 是 overlay，不能伪装成其中任一普通状态。

- D1：unknown/conflicted→`unresolved`；否则 absent/legacy blocked→`supply_blocked`；其余沿用 continuous/limited。
- D2：unknown/conflicted→`unresolved`；effective/limited 按 output visibility 与 subject/output availability 沿用冻结公式；absent 不产生新状态，落入 `unresolved`。
- D3：constraint absent 优先为 `blocked`；否则任一关键 path unknown/conflicted→`unresolved`；其余把 absent 当 legacy blocked，按 mixed、output-mediated、input-mediated、direct-only、blocked 的冻结顺序判定。
- D4：任一关键 node/path unknown/conflicted→`unresolved`；否则任一 node absent 或 conversion absent→`conversion_blocked`；其余沿用 continuous/limited。
- D5：output/constraint absent 或 output→constraint absent 优先为 `uncoupled`；其次 unknown→`unresolved`；其次相关 validated contention→`shared_endpoint_competition`；其余严格沿用 v0.4 regulating/feedback：只有 subject→output `limited`、output→constraint `effective`、constraint→subject `limited` 才为 `output_constraint_regulating`，三边 `effective` 才为 `output_constraint_feedback`，其他组合为 `unresolved`。
- D6：unknown/conflicted→`unresolved`；否则 output/resource absent 或 output→resource absent→`resource_interface_blocked`；其余沿用 effective/limited。

六组 pairwise nearest-neighbour、强/弱门、排除与 provenance gate 继续使用 v0.4 公式。nearest path predicates 使用同一兼容映射：absent 可满足既有 blocked predicate；unknown 不满足 ordinary effective/limited/blocked predicate；conflicted 不满足普通 predicate，并经 E4/exclusion support 标为 conflicted。不得添加固定优先级、target-specific branch、样本特殊判断或新的 threshold。若 interface path 无法映射到既有 D/path ID，未来实现必须停止并重新申请合同，不得静默改 decision 公式。

## 9. Candidate aggregation

- 每个 finite candidate 独立生成 atomic closure、interfaces、paths、E/D 与 decision。
- candidates 按 `candidateId` 排序；重复或空 ID 失败。`candidateId` 只在外围标识 candidate，不进入 interface identity 或竞争语义。
- v0.4 E6 规则继续有效：candidate-local unknown 或 E5/coreMechanism/coreCandidates 不一致时为 `boundary_sensitive`；不做多数票。
- top-level dimensions/evidence 按 v0.4 聚合；问题答案不得消除 boundary。
- 同一 facts 被不同 candidate IDs 引用不增加来源数或票数。

## 10. Determinism 与 answers

canonical serialization 使用 2.4 的 ordinal 与 fixed-enum 顺序。occurrence、fact、participant、candidate 或 answer 输入顺序变化不得改变 core projection 的 bytes。

core projection 至少包括：

```text
candidateResults
nodeAvailability
atomic closure + diagnostics
interfaces + paths
E1—E6
D1—D6
tensions + exclusions
nearestNeighbor
coreCandidates
coreMechanism
finalState
```

manifestation answers 只在 core 冻结后选择批准的 manifestation 子块。`answers_reverse` 可改变 manifestation variant，但上述 core projection 必须 byte-equivalent。

## 11. S01—S04 与 reachability

fixture 中 S01—S04 只记录匿名 adapter-derived atomic facts 与实际 diagnostics：node availability、完整 closure/provenance、contributors、全部 path/E4 witnesses、E1—E6、D1—D6、tensions/exclusion、`nearestNeighbor`、core candidates/mechanism、candidate/final state。不得包含 `targetMechanism`、历史 expected label 或 candidate answer。全部 observed 字段必须由临时确定性 validator 重新计算并 byte-compare，不能用“实现可计算时”省略。

诊断结果不是产品效度证明，也不是实现可通过目标。不得为命中旧标签修改 availability、D1—D6、E4、nearest、threshold、role mapping、fixture expected 或 sample-specific code。

未来实现后的 reachability scan 必须先机制中立地产生并裁决 chart，再按 observed result 统计 A01—A04。每种机制 count 必须大于 0，否则停止并另立 `AVAILABILITY_AND_INTERFACE_SEMANTICS_RESEARCH`；完整数量与分布交给 Owner review。“严重失衡”在有批准阈值前不是可自动判定的 PASS；若 Owner 判定为严重失衡，同样停止并另立该研究任务。

## 12. 隐私、运行与授权边界

- 输入保持 `civil_time_v1`，未知时柱继续使用 finite candidates 与 explicit missing positions。
- fixture 不保存姓名、出生日期、出生时间、地点、URL、日志或外部服务数据。
- runtime 只允许确定性逻辑；LLM 不参与排盘、接口、contention 或人格裁决。
- 所有机制、维度、规则与诊断继续标记为研究候选。
- 本合同不授权修改代码、tests、app、components、data、依赖、配置、CI、workflow、Vercel、PR #16、Ready、merge、Preview 或 Production。
