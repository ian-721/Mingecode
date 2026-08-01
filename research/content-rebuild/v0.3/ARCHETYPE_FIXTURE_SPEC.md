# 原型夹具规范 v0.1

> **历史状态：interface fixture / superseded for Issue #11。** 本文件与 `fixtures/archetype-fixtures.v0.1.json` 直接预填维度、证据家族和规则预期，只能验证裁决接口，不能验证 ChartFacts 规则有效性。当前 32 个规范化图层夹具见 `../v0.4/FIXTURE_SPEC.md` 与 `../v0.4/fixtures/archetype-fixtures.v0.2.json`。

## 数量与边界

共 32 个历史抽象夹具：4 个原型 × 8 类。它们不含生日、地点、四柱或人物经历，但包含预填接口答案，因此不再承担当前通过门。

| 类型 | 目的 | 预期 |
|---|---|---|
| `positive` | 完整正例 | `established` |
| `near_neighbor` | 最近邻错配 | `not_established` |
| `single_family` | 单一证据不足 | `structure_only` |
| `capacity_failure` | 容量不足使功能失效 | `candidate` |
| `counterevidence` | 关键反证降级 | `conflicted` |
| `time_stable` | 候选盘稳定 | `established` |
| `time_changes_core` | 候选盘改变核心 | `boundary_sensitive` |
| `answers_reverse` | 回答相反但不推翻核心 | `established` |

## 统一断言

每个夹具必须断言：

1. G01 去重后独立证据家族数量；
2. G02 时间稳定状态；
3. 两条支持规则、张力规则和排除规则的状态；
4. 最近邻是否被正确排除；
5. 最终输出是否为核心、候选、冲突、结构特质或边界敏感；
6. 问题答案未参与证据家族和核心原型裁决；
7. 输出内容键只来自允许列表。

## 32 个夹具索引

| ID | 原型 | 类型 | 预期状态 |
|---|---|---|---|
| `A01-F01` | A01 | `positive` | `established` |
| `A01-F02` | A01 | `near_neighbor` | `not_established` |
| `A01-F03` | A01 | `single_family` | `structure_only` |
| `A01-F04` | A01 | `capacity_failure` | `candidate` |
| `A01-F05` | A01 | `counterevidence` | `conflicted` |
| `A01-F06` | A01 | `time_stable` | `established` |
| `A01-F07` | A01 | `time_changes_core` | `boundary_sensitive` |
| `A01-F08` | A01 | `answers_reverse` | `established` |
| `A02-F01` | A02 | `positive` | `established` |
| `A02-F02` | A02 | `near_neighbor` | `not_established` |
| `A02-F03` | A02 | `single_family` | `structure_only` |
| `A02-F04` | A02 | `capacity_failure` | `candidate` |
| `A02-F05` | A02 | `counterevidence` | `conflicted` |
| `A02-F06` | A02 | `time_stable` | `established` |
| `A02-F07` | A02 | `time_changes_core` | `boundary_sensitive` |
| `A02-F08` | A02 | `answers_reverse` | `established` |
| `A03-F01` | A03 | `positive` | `established` |
| `A03-F02` | A03 | `near_neighbor` | `not_established` |
| `A03-F03` | A03 | `single_family` | `structure_only` |
| `A03-F04` | A03 | `capacity_failure` | `candidate` |
| `A03-F05` | A03 | `counterevidence` | `conflicted` |
| `A03-F06` | A03 | `time_stable` | `established` |
| `A03-F07` | A03 | `time_changes_core` | `boundary_sensitive` |
| `A03-F08` | A03 | `answers_reverse` | `established` |
| `A04-F01` | A04 | `positive` | `established` |
| `A04-F02` | A04 | `near_neighbor` | `not_established` |
| `A04-F03` | A04 | `single_family` | `structure_only` |
| `A04-F04` | A04 | `capacity_failure` | `candidate` |
| `A04-F05` | A04 | `counterevidence` | `conflicted` |
| `A04-F06` | A04 | `time_stable` | `established` |
| `A04-F07` | A04 | `time_changes_core` | `boundary_sensitive` |
| `A04-F08` | A04 | `answers_reverse` | `established` |

## 历史通过门

- 以下只记录 v0.3 当时的接口预期，不是 Issue #11 的通过证据；
- 32/32 均具有唯一预期；
- 四个 `answers_reverse` 夹具的核心原型保持不变；
- 四个 `time_changes_core` 必须全部输出 `boundary_sensitive`；
- 四个 `single_family` 不得授予核心原型；
- 四个 `near_neighbor` 不得因固定优先级回落到目标原型；
- JSON 可被标准解析器读取，且明确 `containsRealPeople=false`、`containsBirthData=false`。
