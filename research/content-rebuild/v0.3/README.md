# 命格译码｜内容重建 v0.3

## 状态

- `Research Candidate`
- `Not Human-Tested`
- `Docs only`
- 不授权修改现有 H5、题库、结果页、依赖或部署
- Issue #11 最新 Owner 决策后，v0.4 已关闭静态事实与谓词合同；代码准入结论为 `CONDITIONAL_PASS_FOR_ISOLATED_PURE_FUNCTION_IMPLEMENTATION`

## 本阶段目的

把 v0.2 已冻结的四个候选原型，从内容方向推进为可执行、可反驳、可测试的规则工程合同。

固定链路：

```text
稳定命盘事实
→ E1—E6 证据图
→ D1—D6 维度状态
→ 结构张力候选
→ 规则命中与反证
→ 核心原型 / 双候选 / 结构特质 / 暂不定稿
→ 0—3 道显化校准
→ 人工批准内容块组合
```

## 交付物

- `RULE_SCHEMA.md`：规则对象、证据、反证和输出语义；
- `RULE_CATALOG_V0.1.md`：20 条首批规则；
- `CONFLICT_RESOLUTION.md`：唯一冲突与降级顺序；
- `CLAIM_RULE_TRACE_MATRIX.md`：核心声明到规则、维度与证据家族的映射；
- `ARCHETYPE_FIXTURE_SPEC.md`：32 个抽象夹具的设计与验收；
- `fixtures/archetype-fixtures.v0.1.json`：无人物、无生日的机器可读夹具；
- `EXPECTED_CONTENT_SNAPSHOTS.md`：四份预期用户内容快照；
- `CODE_ENTRY_DECISION.md`：下一步是否具备窄范围代码方案准入条件。

## v0.4 替代说明

`../v0.4/` 承担当前 ChartFacts→EvidenceGraph→Dimensions 合同与新 32 个夹具。v0.3 原 JSON 保留为历史 interface fixture，不得再用来证明真实命盘事实能产生维度或原型。

## 核心边界

1. 命盘负责核心人格；问题只校准显化。
2. 核心原型至少命中两条原型支持规则、核心张力规则和全部共享守门。
3. 同一事实不得跨证据家族重复计票；核心至少需要两个不同来源簇。
4. 任一关键反证足以把 `established` 降为 `candidate/conflicted`。
5. 四个原型不是全集；未通过门时必须允许不贴标签。
6. 运行时不得用大模型自由解释命盘。
7. 本阶段不使用真实出生资料，不把四份母本直接变成硬编码正例。
8. P06/P08 与现实行为只属于问题校准，不进入核心裁决。
