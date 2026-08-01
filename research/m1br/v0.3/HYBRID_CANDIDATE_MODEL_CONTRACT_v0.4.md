# M1-BR-R2｜命盘起题 + 轻问答校准实现合同 v0.4

**状态：Accepted**  
**适用对象：Draft PR #5，`feat/m1br-h5-demo`**  
**模型版本：`m1br-hybrid-r2-0.1`**  
**研究性质：Not Human-Tested / 非预测、非诊断**

## 1. 替代与退役

本合同替代 `BACKSTAGE_SIGNATURE_IMPLEMENTATION_CONTRACT_v0.1.md` 中从命盘独立裁决四签名三态的部分。

以下对象退役：

```text
Capacity
ChartFacts.capacity
ChartFacts.uncertaintyCount
SignatureLevel
SignatureAssessment
SignatureCandidate
routeComplete
stableAcrossCharts
evidenceClusters
```

不得用新名字保留相同算法。原 S09—S17 签名成立／关闭夹具退役，不得修改预期后继续冒充同一合同。

## 2. 固定流程

```text
稳定命盘事实
→ 只决定先问哪些主题，不给人格加分
→ 默认 4 题、最多 6 题
→ 回答独立裁决现实主路线／情境副路线
→ 命盘事实只作为文化解释背景
```

四个 `SignatureId` 仅为题库路由键：

| Route | 现实问题 |
|---|---|
| `SIG-A1` | 开始前更常先补输入条件，还是直接推进 |
| `SIG-A2` | 判断成形后更常先公开可见，还是继续内收 |
| `SIG-B1` | 多标准情境中是否先厘清决定权和标准 |
| `SIG-C1` | 已有输出后是否先厘清完成、接收与后续责任 |

## 3. Cue 合同

五类 cue：

```text
input / output / peer / authority / completion
```

每个候选盘只判断：

```text
年／月／时天干观察到 family → visible
未透干但年／月／日／时支藏干观察到 → hidden
均未观察到 → not_observed
```

日主自身不计入 visible。未知时柱时，不生成虚构时柱。

多盘聚合：

```text
全 visible                         → stable_visible
无 visible 且全 hidden             → stable_hidden
visible / hidden / not_observed 不同 → variant
完整时柱且全未观察                  → not_observed
未知时柱且三柱未观察                → unknown
```

## 4. 命盘起题

```ts
const ROUTE_CUES = {
  "SIG-A1": ["input", "output"],
  "SIG-A2": ["output"],
  "SIG-B1": ["peer", "authority"],
  "SIG-C1": ["output", "completion"],
}
```

每个 `stable_visible / stable_hidden` cue 只给对应路线的 `promptMatch +1`。其他状态为 `+0`。

排序固定为：

1. `promptMatch` 降序；
2. `stable_visible` cue 数降序；
3. `SIG-A1 → SIG-A2 → SIG-B1 → SIG-C1`。

四条路线全部保留。`primaryRoute` 只代表第一起题主题，不进入回答计分。

## 5. 问题路由

继续使用十二个题槽：六个无序路线 pair，每个 pair 两题。

设起题顺序为 `[R1, R2, R3, R4]`：

```text
Q1：R1 vs R2，第 1 题
Q2：R3 vs R4，第 1 题

Q3：
  两题都有胜者 → 两个胜者的第一道未使用题
  只有一个 pair 无胜者 → 该 pair 第 2 题
  两个 pair 都无胜者 → R1 vs R2 第 2 题

Q4：当前第一名 vs 第二名的第一道未使用题
```

Q4—Q6 选题器：

1. 路线按当前分数降序，再按 `routeOrder`；
2. 优先枚举涉及第一名的 pair；
3. 选择第一道未使用题；
4. 第一名相关 pair 用尽后按同一顺序枚举全局 pair；
5. 同一题槽不得重复，运行时不得生成新题。

四题后任一条件成立才问 Q5：

- 第一名并列；
- 最高分只有 1；
- `uncertain >= 2`；
- 某一 pair 的两道直接比较各支持一条路线，且两条路线的情境集合互有独有值。

五题后任一条件成立才问 Q6：

- 第一名并列；
- 首二只差 1 且未直接比较；
- 上述 mixed 候选仍有任一路线不足 2 次支持；
- `uncertain >= 3`。

六题后必须停止。

## 6. 计分与裁决

```text
left / right → 对应路线 +1
uncertain    → 全部 +0
命盘 cue     → 全部 +0
```

不使用负分、权重、百分比或人格分数。

现实主路线：

```text
最高分 >= 2
且独自领先
且与最终第二名完成过直接比较
且 uncertain < 3
→ primaryRealityRoute

否则 → null
```

`mixed` 必须同时满足：

- 恰有两条路线各至少 2 次支持；
- 两路线的 `contextTag` 集合互有至少一个独有值；
- 对应 pair 的两道题均已使用，且直接比较为 1:1；
- 不要求总分相等。

裁决顺序：

```text
mixed 成立                          → mixed
否则 uncertain >= 3                → unresolved
否则主路线等于 chart primaryRoute   → aligned
否则主路线已确定                    → adapted
否则                               → unresolved
```

前台不得把 `aligned / adapted` 解释为命盘预测正确或用户改变命运。

## 7. 结果与隐私

```ts
type HybridVerdict = {
  modelVersion: "m1br-hybrid-r2-0.1"
  timeConventionVersion: "civil_time_v1"
  chartPrompt: {
    primaryRoute: SignatureId
    routeOrder: SignatureId[]
    cues: ChartCue[]
    uncertaintyFlags: string[]
  }
  calibration: {
    questionIds: string[]
    questionsUsed: 4 | 5 | 6
    routeSupport: Partial<Record<SignatureId, number>>
    uncertainCount: number
  }
  reality: {
    primaryRoute: SignatureId | null
    secondaryRoute: SignatureId | null
  }
  relationship: "aligned" | "adapted" | "mixed" | "unresolved"
}
```

`routeSupport` 只在内存与测试中使用，不进入 UI、分享卡、URL、日志或持久化。修改生辰或重新开始必须清空 cue、题目、答案和 verdict。

## 8. 时间稳定性

- 未知时柱：`insufficient`；
- 聚合 cue 出现 `variant`：`boundary_sensitive`；
- 其他情况：`stable`。

多个 instant 或多个候选盘本身不构成 `boundary_sensitive`。

## 9. 固定夹具

| ID | 预期 |
|---|---|
| R2-C01 | output 跨盘 stable_visible；A2 先于仅 0 分路线；不产生回答票 |
| R2-C02 | input + output 稳定；completion variant；A1 优先 |
| R2-C03 | unknown hour 且三柱未见 authority → `unknown` |
| R2-C04 | 四路线同分 → 固定顺序 |
| R2-Q01 | 四题后 2/1/1/0 且首二已直接比较 → 四题结束 |
| R2-Q02 | 四题后 1/1/1/1 → Q5 |
| R2-Q03 | 四题中 2 个 uncertain → Q5 |
| R2-Q04 | 五题后首二差 1 且未直接比较 → Q6 |
| R2-Q05 | 六题后最高分不足 2 → unresolved |
| R2-Q06 | 两路线各至少 2 次、情境互异、直接 pair 1:1 → mixed |
| R2-Q07 | 现实主路线等于起题路线 → aligned |
| R2-Q08 | 现实主路线不同 → adapted |
| R2-Q09 | 只改变起题顺序，答案计分不变 |
| R2-Q10 | 相同输入与回答产生完全相同题序和 verdict |
| R2-S01 | 分享白名单不含出生资料、cue、routeSupport、答案或内部 ID |
| R2-S02 | 修改生辰清空 cue、题目、答案和 verdict |

时间与隐私原夹具继续保留。

## 10. 边界与停止条件

不改页面结构、视觉、依赖、排盘库、`civil_time_v1`、城市数据、分享边界、部署或基础设施；不新增题槽、路线、人格维度、传统体系或外部服务。

出现需要超过六题、命盘加权、第十三题、第五路线、心理量表、大模型、持久化、依赖、部署或页面结构变化时立即停止。
