# 原型夹具规范 v0.4

## 1. 作用层级

当前夹具位于允许的“规范化关系节点与边”层：

```text
resolved factSet
→ E1—E6
→ D1—D6
→ P01—P08
→ decision/content keys
```

它们不预填维度、原型、规则结果或证据家族。`input.candidates[].factSet` 必须先解引用到同文件 `factSets` 中的中性 node/edge/relation 原子图。这个层级能验证去重、容量失败、反证、候选盘聚合和答题隔离，但不能证明当前运行时能从四柱产生 `availability/effective/stage/scope`；该缺口继续是 code-entry blocker。

为保持抽象 JSON 紧凑，`factSets.*.*.originKey` 表示一个合成原子来源，同时充当该夹具的 `originClusterKey`；真实实现必须分别保存 `sourceKey` 与 `originClusterKey`，不得复用该简写。

## 2. 禁止输入

任一 fixture 的 `input` 递归对象不得出现：

- `dimensionStates`；
- `coreArchetype`；
- `archetype` 或目标机制提示；
- `supportRules`；
- 规则命中状态；
- 人格语义标签。

允许 `manifestationAnswers`，但核心裁决器必须在读取答案前完成。答案只进入 content manifestation 阶段。

## 3. 八类夹具与本版真实预期

| 类型 | 规范化图层预期 |
|---|---|
| `positive` | 图公式完整；A01/A02 可 established；A03/A04 因第三核心维度缺失只能 candidate |
| `near_neighbor` | 输入实际支持另一个机制；不得按 fixture 顺序或固定优先级回落 |
| `single_family` | 同源去重后只剩一个 `originKey`，输出 structure_only |
| `capacity_failure` | 必需节点 limited，最多 candidate |
| `counterevidence` | 支持链与关键反证同时成立，输出 conflicted |
| `time_stable` | 两候选盘同一决策；A03/A04 仍保持 candidate |
| `time_changes_core` | 候选盘机制不同，输出 boundary_sensitive |
| `answers_reverse` | 与相应 positive 的核心/候选状态完全一致，只记录 manifestation 补偿 |

## 4. 32 个索引

| ID | 覆盖机制 | 类型 | 预期 |
|---|---|---|---|
| CF-001..CF-008 | A01 | 顺序为八类 | established / A04 candidate / structure_only / candidate / conflicted / established / boundary_sensitive / established |
| CF-009..CF-016 | A02 | 顺序为八类 | established / A04 candidate / structure_only / candidate / conflicted / established / boundary_sensitive / established |
| CF-017..CF-024 | A03 | 顺序为八类 | candidate / A04 candidate / structure_only / candidate / conflicted / candidate / boundary_sensitive / candidate |
| CF-025..CF-032 | A04 | 顺序为八类 | candidate / A03 candidate / structure_only / candidate / conflicted / candidate / boundary_sensitive / candidate |

这里的 A03/A04 positive 未获核心不是降低测试门，而是夹具把当前三维度矛盾如实暴露。把预期改成 established 会重新把 Owner 已降级的关系声明计入核心。

## 5. 唯一裁决顺序

1. 解引用 factSet；
2. 验证 time convention 与候选数；
3. G01 按 `originKey` 去重；
4. 每候选独立生成 E/D/P；
5. 应用排除与反证；
6. 检查至少两家族、两来源簇、三个可计核心维度；
7. 多候选盘聚合；
8. 最近邻无唯一优胜时双候选，不使用固定顺序；
9. 冻结核心结果；
10. 最后读取 `manifestationAnswers`，只添加 `manifestation_compensated`。

## 6. 通过与阻断

机器可验证：

- JSON 标准解析；
- 数量 32；
- 每个覆盖机制恰有八类；
- 禁用输入键和人格语义为 0；
- `single_family` 4/4 无核心；
- `time_changes_core` 4/4 为 boundary_sensitive；
- `answers_reverse` 4/4 与 positive 的决策一致；
- `near_neighbor` 4/4 不回落至其覆盖机制。

仍未通过 Issue #11 完整验收：

- 夹具从规范化图开始，不是从当前运行时四柱字段开始；
- A03/A04 positive 无法通过三维度核心门；
- P01—P08 的关键规范化字段尚无批准的 ChartFacts 生成公式。
