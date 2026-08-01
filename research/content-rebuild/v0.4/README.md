# 内容重建 v0.4：静态结构合同

状态：`research_candidate`

本目录关闭 Issue #11 在静态 `ChartFacts` 到核心内容裁决之间的可执行合同。v0.1—v0.3 已通过的四份内容母本、内容快照与产品方向保持冻结；v0.4 只收紧命盘权限、问题校准权限、证据与夹具。

## Owner 决策边界

- 静态命盘只证明结构骨架，不证明具体行为。
- `recoveryCapacity`、`edgeStage`、`edgeScope` 不是可由静态 `ChartFacts` 推出的事实，不再进入规则合同。
- P06「持续建构伴随内部审查」与 P08「完成度门过早进入生成阶段」退出核心命盘谓词、证据计数和最近邻裁决，仅可作为 `CalibrationFork.manifestation` 候选。
- 问题最多 3 道，只校准现实显化；问题答案永不进入核心证据、维度、张力、排除或原型裁决。
- 四个机制的传统来源继续是 `pending_source`；“古人误会你了”属于 `project_inference / modern_reinterpretation_candidate`，不是传统共识。

## 可执行链

```text
atomic ChartFacts
  -> nodeAvailability
  -> relationEffectiveness
  -> E1—E6
  -> D1—D6
  -> core predicates + tension + exclusion + near-neighbor boundary
  -> core mechanism or non-established state
  -> optional CalibrationFork.manifestation (0—3 answers; cannot change core)
```

## 文件

- `CHART_FACT_VOCABULARY.md`：允许输入的原子事实，以及 `nodeAvailability` 的唯一化公式。
- `EVIDENCE_GRAPH_CONTRACT.md`：关系标准化、`relationEffectiveness` 与 E1—E6。
- `DIMENSION_STATE_CONTRACT.md`：D1—D6、两维成立门与候选盘聚合。
- `STRUCTURAL_PREDICATE_CONTRACT.md`：静态核心谓词、显化权限、排除与最近邻。
- `TRADITIONAL_SOURCE_BOUNDARIES.md`：传统来源层级和当前 `pending_source` 边界。
- `FIXTURE_SPEC.md`：32 个活跃夹具的输入、推导和断言合同。
- `fixtures/archetype-fixtures.json`：唯一活跃夹具数据。

## 代码准入

本目录是研究候选，不是运行时代码授权。只有当两项标准化公式唯一、32/32 夹具通过、P06/P08 不参与核心、四个正例和最近邻均唯一、答案与核心隔离，且未解决项不影响裁决时，v0.3 `CODE_ENTRY_DECISION.md` 才可记录：

`CONDITIONAL_PASS_FOR_ISOLATED_PURE_FUNCTION_IMPLEMENTATION`

该结论只允许后续另行申请一个隔离、无 I/O 的纯函数实现；不授权修改当前运行时、页面、题库、部署或产品状态。
