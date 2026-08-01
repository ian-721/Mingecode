# 原型夹具规范 v0.4

状态：`research_candidate`

## 1. 推导链

唯一活跃文件仍为 `fixtures/archetype-fixtures.v0.2.json`，内部 schema 升为 v0.4：

```text
seasonalStrength + occurrences + finite candidates
-> nodeAvailability
-> complete role-pair relation closure
-> relationEffectiveness
-> E1—E6 / D1—D6
-> tension + exclusion + near-neighbor
-> final state
-> CalibrationFork.manifestation
```

## 2. 输入

顶层继承 `civil_time_v1`。factSet 只允许：`precision`、`missingPositions`、`seasonalStrength`、`occurrences`、可选且有具体端点身份的 `branchContactFacts`。fixture input 只允许 `candidates[].candidateId/factSetRef` 与可选 manifestationAnswers。

输入递归禁止：

- `rawRelations`、`edges` 或任何手工关系路径；
- dimensionStates、coreArchetype、目标 archetype、supportRules、规则命中；
- nodeAvailability、relationEffectiveness、证据家族或预填维度；
- 人格语义、职业、自述或经历。

expected 是测试断言，不是输入。

## 3. 关系闭包机械门

每个候选 factSet 必须断言：

- raw relation 总数等于 `n * (n - 1) / 2`；
- `invalidRoleRelationCount=0`；
- `missingDeterministicRelationCount=0`；
- `duplicateRelationAfterSourceDedupeCount=0`；
- `unexpectedManuallySelectedRelationCount=0`；
- F05 关键三边严格为 subject→output generates、output→constraint controls、constraint→subject controls；
- F09 关键三边相同，input absent，A03 不读取 input→subject。

## 4. 八类

| 类型 | 必须证明 |
| --- | --- |
| positive | 完整闭包下目标核心 established |
| near_neighbor | 完整闭包下得到不同唯一机制，无固定回落 |
| single_family | 结构表面满足但来源簇不足，不授予核心 |
| capacity_failure | 关键端点/边 limited，最多 candidate |
| counterevidence | 通过新增合法 occurrence 自动产生完整反证闭包，输出 conflicted；不得插入/删除边 |
| time_stable | 两个合理候选同核 |
| time_changes_core | 两个候选核心不同，boundary_sensitive |
| answers_reverse | 只改 manifestation，核心与 positive 相同 |

四机制各八类，共 32。

四个 counterevidence profile 只改变原子 occurrence：F04 在 A01 结构加入 constraint；F08 为 A02 加入第二个独立 constraint 对象以触发同对象竞争；F12 为 A03 加入 usable input 使 output/input 两条中介同时成立；F16 为 A04 加入 constraint 形成 mixed 路由。所有新增边均由闭包自动生成，没有手工增删关系。

## 5. 核心顺序

1. 解引用 factSet，验证 civil_time_v1；
2. 计算 nodeAvailability；
3. 枚举全部 occurrence 对并生成矩阵闭包；
4. 四项闭包计数必须全 0；
5. 计算全部 relationEffectiveness 与竞争；
6. 生成 E/D、两维、两家族、两来源簇、同源张力；
7. 应用排除和全部成对最近邻；
8. 逐候选聚合并冻结核心；
9. 最后读取最多 3 个 manifestationAnswers。

## 6. 预期分布

每个机制依序为：

`established / established-neighbor / not_supported / candidate / conflicted / established / boundary_sensitive / established`

near_neighbor：A01→A04、A02→A04、A03→A04、A04→A03。answers_reverse 与对应 positive 的 node、closure、relations、dimensions、core 和 finalState 相同。
