# 内容重建可执行合同 v0.4

## 状态

- `Research Candidate`
- `BLOCKED_PENDING_FACT_AND_PREDICATE_CONTRACT`
- `Not Human-Tested`
- `Docs and abstract fixtures only`
- 时间口径固定为 `civil_time_v1`

## 目的

本版响应 Issue #11，只关闭或显式暴露以下链路中的合同缺口：

```text
ChartFacts
→ EvidenceGraph E1—E6
→ DimensionStates D1—D6
→ structural predicates
→ archetype decision
→ approved content keys
```

v0.1—v0.3 已通过的产品方向、A01—A04 内容机制、四份内容母本与内容快照保持冻结。本版不重写它们，也不授权运行时代码、UI、真实生辰接入、部署或真人测试。

## 结论先行

规范化关系图到 E1—E6、D1—D6 和有限结构谓词可以写成确定性合同；当前运行时 `ChartFacts` 不能产生该规范化关系图所需的全部字段。下列缺口会直接改变四个正例或最近邻裁决：

1. 当前事实没有容量有效性与恢复容量；
2. 当前事实只能枚举原始合、冲、刑、害或十神关系，不能判断关系是否有效、是否转化、是否被阻断；
3. 当前事实没有链路阶段、内部/外部作用域和“生成前/完成后”的顺序；
4. “环境响应”“内部审查”“方法化”“意义”“价值”“恢复”不是原子命盘事实，尚缺从传统结构到项目现代翻译的批准映射；
5. A03 与 A04 的核心规则只覆盖两个核心维度；现有三维度硬门无法在不把已降级关系声明重新抬为核心的情况下通过；
6. A01—A04 的传统价值判断均缺可靠来源层级，当前只能标记 `pending_source`。

因此本版不能保留代码准入结论。

## 文件

- `CHART_FACT_VOCABULARY.md`：最小事实词表、来源、类型、缺失与时间候选表达；
- `EVIDENCE_GRAPH_CONTRACT.md`：ChartFacts 到 E1—E6 的唯一化步骤与去重；
- `DIMENSION_STATE_CONTRACT.md`：E1—E6 到 D1—D6 的门、排除与时间规则；
- `STRUCTURAL_PREDICATE_CONTRACT.md`：八个关键谓词的输入、反证、内容权限与 blocker；
- `TRADITIONAL_SOURCE_BOUNDARIES.md`：A01—A04“古人误会你了”的来源层级与禁止结论；
- `FIXTURE_SPEC.md`：32 个规范化图层夹具的职责与未关闭范围；
- `fixtures/archetype-fixtures.v0.2.json`：不预填维度、原型或规则结果的机器可读夹具。

## 版本关系

- v0.1 内容母本与 v0.3 内容快照继续作为冻结内容候选；
- v0.3 JSON 明确降为历史 interface fixture，不再承担 ChartFacts 规则有效性证明；
- v0.4 JSON 替代其作为 Issue #11 的当前夹具，但只验证规范化关系图层；
- `research/content-rebuild/v0.3/CODE_ENTRY_DECISION.md` 记录当前代码准入阻断。
