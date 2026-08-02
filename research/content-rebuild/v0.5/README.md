# 内容重建 v0.5：真实 occurrence multiplicity 合同候选

状态：`research_candidate / proposed`

本目录承接 [ADR-0013（Proposed）](../../../docs/DECISIONS/ADR-0013-real-occurrence-multiplicity.md)，只定义 content-rebuild 静态研究线的 relation interface 与显式 contention。它不是代码实现、H5 `/test` 变更、PR #16 同步或部署授权。

## 继承与替代

v0.5 显式继承 [`../v0.4/`](../v0.4/README.md) 未被本目录替代的全部内容，包括：

- atomic `ChartFacts`、occurrence 字段和 `civil_time_v1`；
- nodeAvailability 公式与阈值；
- role relation matrix、`n * (n - 1) / 2` closure、canonical relation keys 与四项 diagnostics；
- E1—E6、D1—D6、候选聚合、排除与六组最近邻公式；
- manifestation answers 只能选择显化内容，不能改变核心；
- 研究候选、隐私、确定性运行、无 LLM 裁决与无 Production 边界。

v0.5 只替代：

1. v0.4 以共享 atomic endpoint 的 cardinality 自动推断 competition；
2. D/E4/nearest 直接聚合数量不定的 atomic paths；
3. F08 仅凭第二个 constraint occurrence 形成 conflicted 的输入语义；
4. v0.4 诊断材料中 S01—S04 分别追逐 A01—A04 旧目标标签的要求；v0.5 只记录匿名实际 diagnostics，不要求或断言分别命中任何机制。

`research/content-rebuild/v0.4/**` 是冻结历史，不修改。

## 执行链

```text
atomic ChartFacts
→ nodeAvailability
→ complete role-pair atomic closure
→ source-deduped InterfaceContributor groups
→ six RelationInterfaces
→ direct / compound interface paths + atomic witnesses
→ E1—E6 / D1—D6 / nearest-neighbour
→ core mechanism or honest non-established state
→ optional manifestation selection
```

## 文件

- [`REAL_OCCURRENCE_MULTIPLICITY_CONTRACT.md`](REAL_OCCURRENCE_MULTIPLICITY_CONTRACT.md)：类型、状态、contention validator、路径、E/D 与聚合合同。
- [`FIXTURE_SPEC.md`](FIXTURE_SPEC.md)：v0.5 fixture schema、F08 迁移、反例、诊断与验证门。
- [`fixtures/archetype-fixtures.v0.3.json`](fixtures/archetype-fixtures.v0.3.json)：从 v0.4 派生并由本地 validator 验证的候选 fixture。

## 代码边界

本目录只有合同候选。ADR-0013 仍为 Proposed，Issue #22 也只授权 research/contract；不得据此修改 `lib/content-rebuild/**`、app、components、data、tests、依赖、配置、CI、workflow、Vercel 或 PR #16。
