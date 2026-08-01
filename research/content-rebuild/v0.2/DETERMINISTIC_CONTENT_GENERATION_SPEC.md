# 确定性内容生成规范 v0.1

## 1. 目标

未来运行时必须用确定性规则，从命盘事实生成结构机制、有限问题和内容块。大模型可以在离线内容生产中辅助措辞，但不得在运行时裁决人格。

## 2. 概念流程

```text
StableChartFacts
→ EvidenceGraph
→ DimensionStates
→ TensionCandidates
→ CoreMechanism
→ ModifierCandidates
→ CalibrationForks
→ CalibratedManifestation
→ ContentBlocks
```

## 3. 核心对象

```ts
CoreMechanism {
  id
  status
  dimensionStates[]
  supportingEvidenceFamilies[]
  counterEvidence[]
  centralTension
  falsifiableClaims[]
  timeStability
}

ModifierCandidate {
  id
  status
  evidenceFamilies[]
  allowedContentBlocks[]
}

CalibrationFork {
  id
  mechanismId
  manifestationA
  manifestationB
  allowedEffects[]
}
```

本文件只冻结语义，不授权创建类型或修改代码。

## 4. 生成步骤

### Step 1｜稳定命盘事实

产生所有合理候选盘。未知时柱不补造；边界候选必须保留。

### Step 2｜证据图

按 E1—E6 建立功能与关系，不生成任何人格文案。

### Step 3｜维度状态

对 D1—D6 分别输出状态与证据，允许 `mixed/unresolved`。

### Step 4｜结构张力

只保留能同时解释资源与代价的张力。例如：

- 内生定标强 ↔ 外部裁剪不足；
- 表达响应强 ↔ 承载恢复不足；
- 方法化压力强 ↔ 内部审查过载；
- 意义与价值并重 ↔ 过早验收。

单向优点不能成为核心机制。

### Step 5｜核心原型门

按 `ARCHETYPE_BOUNDARIES.md` 判断：

- 恰有一个 `established` 候选且最近邻边界清楚 → 输出核心原型；
- 两个候选共享核心张力但边界不清 → 输出双候选，不强行单选；
- 无候选通过 → 只输出结构特质；
- 候选盘改变核心方向 → `boundary_sensitive`。

### Step 6｜辅助特质

从 `candidate` 机制中选择最多 2—3 项，必须与核心原型不同层级，不得重复换词。

### Step 7｜校准问题

仅为真实 `CalibrationFork` 生成 0—3 道题。答案只更新显化与前台排序。

### Step 8｜内容块组装

固定内容职责：

1. 一句命盘入口；
2. 核心人格；
3. 内在矛盾；
4. 高光；
5. 翻车；
6. 关系表现；
7. 古今翻译；
8. 一句认领；
9. 最多两条可用建议；
10. 查看依据。

内容库必须由人工预先批准，运行时只做受限选择和组合，不自由生成整份报告。

## 5. 文案选择规则

- 核心文案只能绑定 `established` 机制；
- 保留语气文案绑定 `candidate`；
- `conflicted` 输出矛盾或双候选，不输出确定标签；
- 分享卡只允许核心原型、认领句、高光与翻车各一条；
- 命理术语只进入“查看依据”或古今翻译，不堆在首屏；
- 不展示人格分数、概率或伪精度。

## 6. 最小夹具

每个原型至少需要：

- 正例；
- 近邻错配；
- 单一证据不足；
- 容量不足使功能失效；
- 反证降级；
- 时间候选稳定；
- 时间候选改变核心；
- 问题答案相反但不得推翻核心。

S01 因时间边界敏感，不作为正式正例夹具。

## 7. 实现停止条件

出现以下任一项，停止进入代码：

- 需要用答题分数决定核心原型；
- 一个原型无法写出最近邻排除条件；
- 核心声明只有一个证据家族；
- 为了覆盖所有命盘而新增万能兜底人格；
- 内容库仍主要描述工作流程；
- 运行时需要大模型自由解释命盘；
- 四份母本的核心机制无法由同一证据合同复现。

## 8. 下一阶段门

进入代码前必须另行完成：

1. 为四个候选原型各建立抽象正例与近邻反例；
2. 将母本中的每条核心声明映射到 D1—D6 与 E1—E6；
3. 冻结首批规则 ID 与冲突裁决；
4. 生成不含真实人物的测试夹具；
5. 由产品负责人验收内容结果，而非只验规则通过。
