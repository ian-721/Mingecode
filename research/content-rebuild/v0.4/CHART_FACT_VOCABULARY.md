# ChartFacts 最小事实词表与 nodeAvailability

状态：`research_candidate`

## 1. 输入边界

规则层只消费本文件列出的原子事实。事实不得包含人格形容词、`DimensionState`、原型 ID、规则命中、职业、自述、经历或问题答案。

所有夹具与未来实现必须记录：

| 字段 | 类型 | 来源 | 缺失与候选表达 |
| --- | --- | --- | --- |
| `timeBasisVersion` | 固定字符串 `civil_time_v1` | 当前时间合同 | 不允许缺失 |
| `candidateId` | 非空字符串 | 候选盘生成器 | 每个合理候选盘一个 ID |
| `precision` | `exact / bounded` | 出生时间输入合同 | `bounded` 必须配有限候选盘 |
| `missingPositions` | 位置数组 | 候选盘生成器 | 未知时柱等明确列出，不得当作不存在 |
| `seasonalStrength[role]` | `旺 / 相 / 休 / 囚 / 死 / unknown` | 当前排盘库按月令与五行关系确定性计算 | 若月支未知则为 `unknown` |
| `occurrences` | 节点出现数组 | 当前排盘库确定性计算 | 未观察且相关位置完整才可判不存在 |
| `rawRelations` | 原始关系数组 | 当前排盘库确定性计算 | 端点或方向不足时保留 raw，不猜 effectiveness |

### 1.1 occurrence 原子字段

| 字段 | 类型 / 枚举 | 来源与约束 |
| --- | --- | --- |
| `role` | `subject / input / peer / output / resource / constraint` | 由日主与五行生克映射；对六类角色使用同一可用性公式 |
| `kind` | `day_anchor / visible / hidden` | 日干、天干、藏干位置 |
| `objectKey` | 非空字符串 | 指向一个具体干或藏干出现，不得复用于两个物理对象 |
| `originClusterKey` | 非空字符串 | 同源去重键；见 1.2 |
| `hiddenStemProportion` | `0..1` 或 `null` | `hidden` 必填；其余为 `null`。来自排盘库的固定藏干比例表 |
| `rootOccurrence` | 布尔值 | 该出现是否构成本角色的根；由当前排盘库确定性计算 |

当前代码已经具备或可直接导出的字段是：干支位置、日主、月令、透藏、五行生克、十神功能映射、合冲刑害端点、`civil_time_v1` 候选盘。`hiddenStemProportion` 与 `originClusterKey` 需要未来在隔离规则层显式标准化，但不需要新历法数据。不存在仍待补公式的 `recoveryCapacity`、`edgeStage` 或 `edgeScope` 字段；三者已被 Owner 排除。

### 1.2 来源簇

- 月支、该月支藏干、以及仅以该月支为根的相关透干共享一个 `originClusterKey`。
- 同一具体干支对象派生出的角色节点、十神别名和关系端点共享该对象的来源簇。
- 同一来源簇在一个角色的可用性中只取最高贡献，不相加；在证据家族与核心门中也只能计一次。
- 不同柱上的独立根或独立透干使用不同来源簇。

该规则明确阻止“月令 + 月令藏干 + 相关透干”被重复当作三票。

## 2. nodeAvailability 唯一化公式

输出仅允许：`usable / limited / absent / unknown`。

### 2.1 分值

对每个候选盘、每个功能角色独立执行：

1. 季节分 `S`：`旺=2，相=1，休=0，囚=-1，死=-2`。
2. 根分：每个去重后的 `originClusterKey` 取该簇最高根贡献：
   - `rootOccurrence=false`：0；
   - `rootOccurrence=true` 且 `hiddenStemProportion >= 0.50`：2；
   - `rootOccurrence=true` 且 `0.20 <= hiddenStemProportion < 0.50`：1；
   - `rootOccurrence=true` 且 `hiddenStemProportion < 0.20`：0。
   所有独立簇贡献之和封顶为 2，记为 `R`。
3. 可见分 `V`：存在 `day_anchor` 或 `visible` 时为 1；仅藏为 0。
4. `score = S + R + V`。

### 2.2 状态判定

按以下顺序判定，不允许原型专用阈值：

1. 若 `seasonalStrength=unknown`，或 `missingPositions` 中的未决位置可能新增该角色的首次出现或把其 `score` 跨过 2，则输出 `unknown`；但现有完整事实已经达到 `score >= 2` 时，新增事实不会降低状态，仍为 `usable`。
2. 若至少观察到一个该角色 occurrence 且 `score >= 2`，输出 `usable`。
3. 若至少观察到一个该角色 occurrence 且 `score < 2`，输出 `limited`。
4. 若相关位置完整且没有观察到该角色 occurrence，输出 `absent`。

`unknown` 表示资料不足以稳定判定；`absent` 表示有限候选盘中的相关位置已完整且没有该节点。两者不得互换。

### 2.3 候选盘聚合

- 先对每个 `candidateId` 单独计算。
- 所有合理候选给出同一已知状态时，聚合为该状态。
- 已知状态不同，或任一候选仍为 `unknown` 时，聚合为 `unknown`。
- 候选间已知状态不同必须同时在 E6 标记 `boundary_sensitive`；不得用多数票、固定优先级或问题答案消除边界。

## 3. 研究责任

上述权重、0.20 / 0.50 与 `score >= 2` 是 `project_assumption_minimum_v0.4`：它们是为了得到一致、可回归、对所有角色相同的最小确定性研究候选，不宣称是古籍原文或传统共识。未来纯函数实现仍须保持版本化；正式真人验证可提出新阈值，但不得用结果倒推 A01—A04，且任何修改都需新合同与完整回归。
