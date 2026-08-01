# 原型夹具规范 v0.4

状态：`research_candidate`

## 1. 推导层级

唯一活跃夹具 `fixtures/archetype-fixtures.v0.2.json` 从原子 ChartFacts 开始；文件名沿用以避免破坏既有索引，内部 `schemaVersion` 已升为 v0.3：

```text
seasonalStrength + occurrences + rawRelations + finite candidates
-> nodeAvailability
-> relationEffectiveness
-> E1—E6
-> D1—D6
-> core tension + exclusion + near-neighbor
-> final state
-> CalibrationFork.manifestation
```

`expected` 是测试断言，不是规则输入。实现必须在读取 `expected` 或 `manifestationAnswers` 前完成核心裁决。

## 2. 输入合同

顶层 `timeConventionVersion=civil_time_v1` 由全部 factSet 继承。每个 `factSet` 只允许：`precision`、`missingPositions`、`seasonalStrength`、`occurrences`、`rawRelations`；`candidateId` 位于 fixture 候选包装层。字段含义完全服从 v0.4 的两个公式。

fixture `input` 只允许：

- `candidates[].candidateId` 与 `factSetRef`；
- 可选 `manifestationAnswers`，且其数据路径只能进入 manifestation。

fixture `input` 递归禁止：`dimensionStates`、`coreArchetype`、目标 `archetype`、`supportRules`、任何规则命中状态、人格语义标签，以及预填的 availability/effectiveness/evidence/dimension 结果。

## 3. 八类夹具

| 类型 | 必须证明 |
| --- | --- |
| `positive` | 从原子事实唯一得到目标核心 established |
| `near_neighbor` | 实际得到不同机制；不得按 fixture 顺序或固定优先级回落 |
| `single_family` | 结构表面满足，但同源去重后不足两家族或两来源簇，不授予核心 |
| `capacity_failure` | 必需节点/边受限导致核心门失败 |
| `counterevidence` | 支持与明确排除同候选并存，输出 conflicted |
| `time_stable` | 两个合理候选盘得到相同核心 established |
| `time_changes_core` | 两个合理候选盘核心不同，输出 boundary_sensitive |
| `answers_reverse` | 反向答案只改变 manifestation，不改变 positive 的核心 |

每个 A01—A04 恰有上述八类，共 32 个。

## 4. 核心判定顺序

1. 解引用每个 factSet；验证 `civil_time_v1`。
2. 按来源簇计算 nodeAvailability。
3. 从 raw relation 计算 relationEffectiveness 和中介链。
4. 生成 E1—E6 与 D1—D6。
5. 要求至少两个结构维度、两个证据家族、两个不同来源簇和一项同源张力。
6. 应用明确排除与所有成对最近邻边界；不设优先级。
7. 逐候选盘完成核心，再执行时间聚合。
8. 冻结 `coreMechanism` 和 `finalState`。
9. 最后读取最多 3 个问题答案，只选择已批准 manifestation 权限。

## 5. 预期分布

每个机制的八类顺序均为：

`established / established-neighbor / not_supported / candidate / conflicted / established / boundary_sensitive / established`

四个 `near_neighbor` 分别得到：A01→A04、A02→A04、A03→A04、A04→A03。四个 `answers_reverse` 与本机制 positive 的核心、维度和最终状态完全一致，只有 `manifestationVariant` 不同。

## 6. 机械通过条件

- 标准 JSON 解析成功；
- 总数 32，每机制/类型分布为 4×8；
- 禁止输入键递归扫描为 0；
- 32/32 从原子输入得到唯一预期；
- single_family 4/4 不授予核心；
- time_changes_core 4/4 为 boundary_sensitive；
- answers_reverse 4/4 核心与 positive 相同；
- near_neighbor 4/4 得到非目标机制，且无固定优先级；
- positive、反证和容量失败各 4/4 满足预期。
