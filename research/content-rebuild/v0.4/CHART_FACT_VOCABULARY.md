# ChartFacts 最小事实词表 v0.4

## 1. 词表边界

`ChartFacts` 只保存可追溯到排盘输入、锁定依赖或确定性规范化步骤的原子事实。它不得包含人格形容词、`DimensionState`、A01—A04、规则命中、职业、自述经历或答题结果。

每个字段都必须带候选盘作用域。禁止先把多个候选盘压成一个“看起来最像”的盘。

## 2. 通用值与候选表达

```text
Known<T>   = { state: "known", value: T, sourceKey, originClusterKey }
Unknown    = { state: "unknown", reason, sourceKey?, originClusterKey? }
FactValue  = Known<T> | Unknown

CandidateFactSet = {
  candidateId,
  convention,
  timeConventionVersion: "civil_time_v1",
  facts
}

ChartFactSet = {
  candidates: CandidateFactSet[1..16],
  precision: "exact" | "approximate" | "unknown"
}
```

允许的 `Unknown.reason`：`unknown_hour`、`boundary_variant`、`not_computed`、`definition_pending`、`source_pending`。未知不等于缺席；候选盘之间不同也不等于任一值错误。

## 3. 当前代码已经具备

| 字段 | 来源 | 类型/枚举 | 缺失表达 | 时间候选表达 |
|---|---|---|---|---|
| `timeConventionVersion` | `lib/types.ts` | 固定 `civil_time_v1` | 不允许缺失 | 整组固定 |
| `candidateId` / `key` | `lib/astro.ts` 四柱去重键 | string | 不允许缺失 | 每候选一项 |
| `convention` | `lib/types.ts` | `civil/zi_hour_day_rollover/hour_boundary/solar_term_boundary/approximate_time/unknown_time` | 不允许缺失 | 每候选一项 |
| `pillars.year/month/day` | `computeFourPillars` | `{stem, branch}` | 不允许缺失 | 每候选独立 |
| `pillars.hour` | `computeFourPillars` + time precision | `{stem, branch} | null` | unknown time 为 `null` | 每候选独立 |
| `dayMaster` | `pillars.day.stem` 的无损别名 | 十天干 | 日柱有效时不缺失 | 每候选独立 |
| `monthBranch` | `pillars.month.branch` 的无损别名 | 十二地支 | 月柱有效时不缺失 | 每候选独立 |
| `visibleStems[]` | `deriveChartFacts` | `{position: year/month/hour, stem, tenRelation}` | 未知时柱不生成 hour 项 | 每候选独立 |
| `hiddenStems[]` | `deriveChartFacts` | `{position, branch, stem, tenRelation, isMain}` | 未知时柱不生成 hour 项 | 每候选独立 |
| `candidateCount` | `lib/astro.ts` | integer 1..16 | 0 为 calculation failure | 整组统计 |
| `inputPrecision` | `BirthInput.timePrecision` | `exact/approximate/unknown` | 不允许缺失 | 整组固定 |

当前 `ChartResolution.timeStability` 是旧 H5 cue 是否跨盘变化的汇总，不能直接当作本内容模型的核心稳定性。v0.4 必须在每个候选盘完成 E/D/谓词裁决后再聚合。

## 4. 当前依赖可确定性计算、但当前 `ChartFacts` 未保存

锁定依赖 `@4n6h4x0r/stem-branch@0.8.0` 已提供下列纯计算。把它们加入未来事实层仍需独立实现授权，但不需要新依赖。

| 字段 | 依赖函数/常量 | 类型/枚举 | 缺失规则 |
|---|---|---|---|
| `stemElement` / `branchElement` | `STEM_ELEMENT` / `BRANCH_ELEMENT` | 金木水火土 | 原对象 unknown 时 unknown |
| `stemPolarity` / `branchPolarity` | 同名函数 | 阴/阳 | 原对象 unknown 时 unknown |
| `hiddenStemProportion` | `getHiddenStems` | 0..1 rational | 未知支为 unknown；不得自行补时柱 |
| `seasonalStrength` | `getStrength(element, monthBranch)` | 旺/相/休/囚/死 | 月支 unknown 时 unknown |
| `tenRelation` | `getTenRelation` | 比肩/劫财/食神/伤官/偏财/正财/七杀/正官/偏印/正印 | 任一干 unknown 时 unknown |
| `rawBranchRelation` | `isHarmony/isClash/isPunishment/isHarm/isDestruction/isThreeHarmony/isSeasonalUnion` | 关系种类 + endpoints | 任一端 unknown 时 unknown |
| `rawStemRelation` | `isStemCombination/isStemClash` | 关系种类 + endpoints | 任一端 unknown 时 unknown |
| `rootOccurrence` | 日主五行与各藏干五行的等值匹配 | `{position, hiddenIndex, proportion}` | 未知支只标 unknown |

这里的 `raw*Relation` 只表示组合在枚举表中出现，不表示合化成功、冲刑实际生效、功能变强或人格结论。`seasonalStrength` 也只是库定义的五级关系，不能自动等同整体容量。

## 5. 未来扩展且尚未实现

| 字段 | 所需来源/定义 | 类型 | 当前状态 | 缺失时处理 |
|---|---|---|---|---|
| `sourceKey` | 每个原子事实的候选内唯一地址 | string | 未实现 | 对应证据不得计数 |
| `originClusterKey` | 同源链去重；月令、月令藏干及由其直接派生的透干归一簇 | string | 未实现 | G01 失败 |
| `nodeAvailability` | 季节、根、透藏、负荷的批准组合规则 | `usable/limited/absent/unknown` | `definition_pending` | 相关 E1/D/谓词最多 candidate |
| `relationEffectiveness` | 原始关系的适用、成化、阻断和竞争规则 | `effective/limited/blocked/unknown` | `definition_pending` | E3—E5 不得 established |
| `edgeStage` | 关系作用于输入、生成、输出或完成阶段的规则 | `input/generation/output/completion/unknown` | `definition_pending` | P06/P08 blocked |
| `edgeScope` | 内部链还是外部接口的结构定义 | `internal/external/mixed/unknown` | `definition_pending` | P01/P03/P06 blocked |
| `recoveryCapacity` | 只能由批准的结构代理计算，不能由生活自述填入 | `usable/limited/unknown` | `definition_pending` | P04 blocked |
| `counterFact` | 与某结构公式相反的原子节点/边，不是人格反例 | typed relation fact | 部分可枚举、未规范化 | 无反证记录不得 established |

`nodeAvailability`、`relationEffectiveness` 和 `recoveryCapacity` 是规范化事实，不得由人工针对 A01—A04 预标；未来实现必须从上节原始字段通过同一公开公式产生。

## 6. 明确禁止进入事实词表

- 内部定标、表达过热、方法化压力、内部审查、意义价值验收、过早验收；
- D1—D6 任一状态；
- A01—A04 或旧 `SignatureId`；
- `supportRules`、规则命中或内容键；
- 职业、关系经历、自我评价、题目选择；
- 纳音、神煞、紫微斗数、奇门、六爻、星盘或未经 ADR 批准的新体系。
