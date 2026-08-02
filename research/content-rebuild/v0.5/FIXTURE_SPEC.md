# Archetype Fixture Spec v0.5

状态：`research_candidate / ADR-0013 Accepted`

唯一 v0.5 fixture：[`fixtures/archetype-fixtures.v0.3.json`](fixtures/archetype-fixtures.v0.3.json)。它从 [`v0.4/fixtures/archetype-fixtures.v0.2.json`](../v0.4/fixtures/archetype-fixtures.v0.2.json) 机械派生，不回写 v0.4。

## 1. 顶层 schema

fixture 必须包含：

- version、`civil_time_v1` 与 privacy flags；
- v0.4 source path 和 exact base commit；
- 16 个 profile 的一对一 inheritance map；
- 32 个 fixture 的一对一 inheritance map；
- 六个固定 `interfaceKeyOrder`；
- 继承的 `factSets`、新增的 contract fact sets 与 S01—S04 diagnostic fact sets；
- v0.5 inherited profile assertions 与 contract profile assertions；
- 32 个继承 fixture；
- multiplicity、contention invalid、equivalence 与 diagnostic cases。

所有 expected / observed assertion 都在 evaluator input 外。执行器只接收 case 的 `input`；不得把 `coverageMechanism`、expected、observed 或 case ID 传入 adapter/evaluator。

## 2. Atomic facts

继承的 F01—F16 必须与 v0.4 对应 factSet byte-equivalent after canonical JSON normalization。每个 factSet 只允许：

```text
precision
missingPositions
seasonalStrength[subject|input|peer|output|resource|constraint]
occurrences[]
branchContactFacts? (仍受 v0.4 限制)
```

occurrence 继续只允许 `role / kind / objectKey / originClusterKey / hiddenStemProportion / rootOccurrence`。`rawRelations`、edges、接口、维度、机制、答案或 expected 不得进入 factSet。

每个 candidate 可选带 `interfaceContentionFacts`; omission 等价于空数组。fact 不能放进 atomic factSet，也不能改变 closure。

## 3. 机械 closure 与 interface assertions

每个 factSet 必须断言并验证：

- raw relation count=`n * (n - 1) / 2`；
- canonical relation keys 唯一；
- 四项 diagnostics 全 0；
- atomic base effectiveness 不读取 contention；
- interface contributors 按 `sourceDedupeKey` 去重；
- `sourceDedupeKey` 精确等于主合同定义的五项 JSON tuple，不得用 delimiter join；
- alias keys 全部保留在 contributor provenance；
- 六接口总是按固定顺序输出；
- contributor/object/origin 数量不改变 interface base state。

`expectedProfiles` 必须为 F01—F16 保存完整 projection；`expectedContractProfiles` 必须为 M01—M04 保存完整 projection；S01—S04 的 `diagnosticCases[].observed` 必须保存完整 projection 与 decision diagnostics。三者都必须保存排序后的全部 `atomicRelations`、source-deduped representative relation keys、每个 contributor 的全部排序 atomic keys、每条 path 的全部 canonical witnesses，以及 E4 witness provenance；只保存 count 或一个 representative 不足以验证本合同。fixture 中的 path assertion 精确使用 `InterfacePath.pathKey`，并增加排序后的 `witnessKeys` 与等于 `witnesses.length` 的 `atomicWitnessCount`；interface assertion精确增加 `contributorCount` 与 `atomicRelationCount`。这些计数只用于一致性校验，不参与状态计算。

## 4. 16 / 32 继承门

- profile map 必须精确覆盖 F01—F16，一一对应、无缺失、无重复 target。
- fixture map 必须精确覆盖 CF-001—CF-032，一一对应、无缺失、无重复 target。
- F01—F16 的 atomic fact sets 为 16/16 canonical-equivalent；F08 atomic input 也不变。
- CF-013 只在 candidate 层增加两个通用 `shared_capacity` facts 与对应 v0.5 assertions；其他 31 个 fixture 的 evaluator input 与完整 expected record 继承 v0.4，因此完整 scenario/assertion record 继承精确为 31/32。
- 32 个 fixture 的历史顶层 `{coreMechanism, finalState}` 标签实际为 32/32 不变，不得把 31/32 record inheritance 误写成只有 31 个 outcome label 继承。重算后的 finalState 分布在 v0.4 与 v0.5 均为：16 `established`、4 `not_supported`、4 `candidate`、4 `conflicted`、4 `boundary_sensitive`。
- 16 profile 的 atomic closure assertions 全部重新计算；不得复制 v0.4 的 implicit-competition flags。

E4 expected / observed diagnostics 必须按第 7 节 gate 全量重生成，不能只修报告点名的三例。本次 source-truth reconciliation 机械修正 14 个 mechanism aggregates、45 个仍保留 provenance 的 concrete witnesses，由 `candidate` 改为 `not_supported`：

- inherited profiles：F04/A02、F09/A02、F10/A02、F12/A02、F13/A01、F14/A01、F16/A01、F16/A02；
- contract profiles：M01_ALIAS/A01、M02_INDEPENDENT/A01；
- diagnostics：S01/A01、S02/A01、S03/A01、S03/A02。

这些修正都来自同一冻结 strong/weak gate，不改变 32 个历史顶层 outcome；F08 approved migration 保持不变。

## 5. F08 迁移

F08 的四个 occurrences 原样继承。无 fact 变体必须断言：

- raw relation count=6；
- atomic base states 为 3 effective / 3 limited；
- 两个 output→constraint contributors effective；
- 两个 constraint→subject contributors limited；
- 正常 multiplicity 不产生 contention；
- finalState 不得 conflicted。

CF-013 使用两个通用 `shared_capacity` facts：一个验证共享 output endpoint，另一个验证共享 subject endpoint。facts 不包含 F08、sample、profile、mechanism、expected、target、answer 或 result 语义。加入 facts 后断言：

- atomic closure 与无 fact 变体 byte-equivalent；
- output→constraint 与 constraint→subject overlay conflicted；
- D5=`shared_endpoint_competition`；
- finalState=`conflicted`。

## 6. 必需 contract cases

至少覆盖：

| Case | 机械断言 |
| --- | --- |
| 正常同角色多 occurrence | 无 contention；不得 conflicted |
| 同源 alias | 一个 contributor；全部 atomic keys 回指；不竞争 |
| 多个独立来源 | 多 contributors；一个 interface state；不投票、不竞争 |
| A01 resource absent | output→resource interface/path absent、D6 blocked、E4 A01 与 candidate 均 not_supported；保留 absence provenance，不伪造 atomic/E4 witness |
| mutually_exclusive 正例 | 两个独立 contributors；命名 direct path 与包含它的 witnesses conflicted |
| path_invalidating 正例 | 完整 interface sequence 上至少两个 concrete witnesses；只覆盖 participant/object/origin 精确匹配的一条，path aggregate conflicted；未匹配 witness、direct constituents、其他 compound paths 与全部不匹配 E4 mechanisms 不变 |
| 非法 participant | validator hard fail |
| alias-only contention | validator hard fail |
| shared endpoint 不匹配 | validator hard fail |
| `target` 字段注入 | recursive banned-key fail |
| `expected` 字段注入 | recursive banned-key fail |
| 无共同 witness 的 path invalidation | validator hard fail |
| unknown hour | bounded + finite candidates；unknown 不变 absent；答案不解边界 |
| 输入顺序反转 | atomic/interface/core bytes equivalent |
| answers_reverse | manifestation 可变，core projection bytes equivalent |

invalid cases 的 expected error 只是 validator assertion，不进入被验证 input。banned semantic scan 必须先于 exact-schema scan，因此 `target` / `expected` 注入稳定返回 `banned_semantic_field`；其他错误码与优先级以主合同 5.1 为准。

两个 positive contention cases 还必须断言主合同 5.3 的非空 `RelationInterface.contentionFactKeys` / `invalidatedByFactKeys` 映射；未列入该映射的 interface provenance arrays 必须为空。`mutually_exclusive` 必须同时断言被覆盖 direct path 和包含该 direct witness 的 compound path conflicted。

`path_invalidating` 正例必须非真空验证 selective overlay：使用含两条 `conversion` witnesses 的 M02_INDEPENDENT，只让 participant set `f13-i / f13-s / f13-o / f13-r` 命中其中一条。被命中 witness 加入 fact/counter provenance；以 `m02-i-independent` 开头的另一条 witness 保持 `effective` 且 provenance 为空。只有 `conversion` path aggregate 变为 `conflicted`；direct paths、其他 compound paths、A01—A04 的全部 E4 witnesses 与 aggregates 都必须与 base projection byte-equivalent。

## 7. S01—S04 diagnostics

S01—S04 facts 必须从 PR #16 frozen pillars 通过 shared adapter 路径机械标准化为匿名 ChartFacts；fixture 不保存姓名、日期、时间、地点或历史目标标签。每个 diagnostic input 只含 candidate 与空 contention facts。

每个 diagnostic 记录实际：

- occurrence / role / origin 分布；
- nodeAvailability；
- raw/source-deduped relation count 与四项 diagnostics；
- 全部排序 atomic relation records 与 source-deduped representative relation keys；
- contributor counts、六 interface states 与 atomic provenance；
- direct/compound path states 与 witness counts；
- E1—E6、E4 witnesses、D1—D6、tensions/exclusion、`nearestNeighbor` 与 observed core/final state。

不得出现 `targetMechanism`，也不得断言 S01—S04 分别命中 A01—A04。上述字段不得以“实现可计算时”为由省略；临时确定性 evaluator 必须按 ADR-0013 Accepted 路由的本合同实际计算、序列化并由独立 validator byte-compare。诊断只证明 Route B 对真实 multiplicity 的透明度；它不证明人格效度。

### 7.1 E4 source-truth reconciliation traces

下表的 constituent states 同时是对应 interface/direct path state；所有 listed witness 都物理连续、base known 且无 contention overlay。present-known witness 即使不命中 strong/weak 也必须保留 provenance，并把自身 state 记为 `not_supported`；只有 absent 或物理不连续才没有 witness。

| case / mechanism | constituent states | concrete witness（object / origin） | base / overlay | strong gate | weak gate | final E4 |
| --- | --- | --- | --- | --- | --- | --- |
| F04 / A02 | `effective / effective / effective` | `f04-s → f04-o → f04-c → f04-s` / `a1 → a3 → a5 → a1` | `effective` / none | false：不是 `L/E/L` | false：首边不是 `limited` | `not_supported` |
| M01_ALIAS / A01 | `effective / effective` | `f13-s → f13-o → f13-r` / `d1 → d3 → d4` | `effective` / none | false：第二边不是 `limited` | false：不是 residual `L/L` | `not_supported` |
| S01 / A01 | `effective / effective` | 下列 4 条共享 output witnesses | 全部 `effective` / none | 全部 false：第二边为 `effective` | 全部 false：不是 residual `L/L` | 聚合 `not_supported` |

S01 的四条 concrete object/origin paths 精确为：

1. `day:day_anchor:0:甲 → day:hidden:1:丙 → day:hidden:2:戊` / `day-anchor:甲 → branch:day:寅 → branch:day:寅`；
2. `day:day_anchor:0:甲 → day:hidden:1:丙 → month:hidden:0:己` / `day-anchor:甲 → branch:day:寅 → branch:month:未`；
3. `day:day_anchor:0:甲 → month:hidden:1:丁 → day:hidden:2:戊` / `day-anchor:甲 → branch:month:未 → branch:day:寅`；
4. `day:day_anchor:0:甲 → month:hidden:1:丁 → month:hidden:0:己` / `day-anchor:甲 → branch:month:未 → branch:month:未`。

M01_ALIAS 与 S01 的实际 output→resource 都是 `effective` 且存在 witness；Issue #27 的 absent/no-witness 条件在这两份 accepted facts 上没有触发。若任一 future case 的 output→resource 确为 `absent` 或没有 concrete witness，A01 仍必须先过 absent gate并输出 `not_supported`，但不得为配合报告把当前事实改写成 absent。

## 8. Determinism / core equivalence

canonicalize 后排序：

普通字符串使用 locale-independent UTF-16 code-unit ordinal comparator `left === right ? 0 : left < right ? -1 : 1`。排序依次为：

1. candidateId；
2. fixed interface/path enum；
3. sourceDedupeKey；
4. canonical atomic relation key；
5. witnessKey；
6. factKey；
7. participantObjectKey。

至少验证一次普通 multiplicity 和一次带 contention 的输入顺序反转。四组 `answers_reverse` 与对应 positive fixture 比较时，必须排除 manifestation-only 输出，再对完整 core projection 做 byte comparison。

## 9. 本地 validator 门

临时 validator 只能位于系统临时目录，不提交仓库。它必须完成：

- v0.3 JSON 严格解析与重复 key 防护；
- exact top-level / nested schema allowlists；
- 16/32 inheritance bijection；
- v0.4 factSet canonical equivalence；
- occurrence、availability、closure、contributors、interfaces、paths 与 F01—F16/M01—M04 完整 expected projections 重新计算；
- 对每个 E4 concrete witness 独立重算 frozen strong/weak gate，再按 `conflicted > established > candidate > not_supported` 聚合；三例 trace 与上述 14/45 全量 reconciliation 必须精确通过；
- contention schema、participant、alias、endpoint、path 与 banned semantic 验证；
- F08 两变体、三种 contention basis、selective multi-witness `path_invalidating`、unknown-hour answered variant、order 与 answer equivalence assertions；
- S01—S04 shared-adapter facts、完整 provenance、nearest/core/final 对照；
- 16/16 fact-set inheritance、31/32 full-record inheritance 与 32/32 top-level outcome-label equality / preservation 分别核算，不得混称；
- reachability gate 必须记录任一机制不可达或 Owner 判定严重失衡时停止并另立 `AVAILABILITY_AND_INTERFACE_SEMANTICS_RESEARCH`；
- UTF-8 no BOM；
- Markdown relative link check；
- repository changed-path allowlist；
- v0.4 no diff；
- PR #16 / PR #20 remote head no modification。

此外运行 `npm.cmd ci`、`npm.cmd run check` 与 `git diff --check`。文档/治理变更不运行或触发 Vercel；E2E 不属于本 docs/research-only 用户流风险范围，必须在 PR 说明中记录未运行原因。
