# 24 槽核心规则试验集台账 v0.3

**版本：** `CRX-0.3.0-draft`  
**状态：** Research Candidate / Process Test Only  
**当前审查覆盖：** MC-R-001—MC-R-030  
**继承台账：** `CORE_RULE_SLOT_LEDGER_v0.2.md`  
**真人测试：** NOT AUTHORIZED

## 1. 本版变化

- 完成 MC-R-021—030 的逐条裁决和 60 个抽象夹具；
- 新增 8 个证据家族、3 个依赖簇和对象特定资源范围；
- 识别五个来源待关闭候选：021、022、023、026、027；
- 识别三个修饰规则：024、025、028；
- 识别两个定义阻塞规则：029、030；
- 坚持 `pending_*` 不进入冻结槽；A/B 层仍无冻结填槽；
- 累计规则审查 30/40，抽象夹具 180 个。

## 2. 填槽原则

- 槽位不为对称而填满；
- `eligible_modifier` 不得占锚点；
- `pending_source`、`pending_definition` 只列候选；
- 桥接链不因连接多个已计端点成为额外独立家族；
- 同一压力、标准或资源对象必须执行家族/簇上限；
- 负荷与竞争只作守门或反向，不增加正向证据；
- 40 条全部审查、来源门关闭、夹具与报告映射通过后，才可讨论 `CRX-1.0.0-frozen`。

## 3. A 层｜12 个锚点槽

| Slot | Dimension / direction | Frozen Rule ID | Candidate under review | Family / cluster | Status | 说明 |
|---|---|---|---|---|---|---|
| A01 | D1 内部参照 | — | MC-R-017 | EF-REFERENCE-BOUNDARY | open / pending_definition | 030 成立时同一比劫事实不得再支持 017 |
| A02 | D1 可谈判边界 | — | MC-R-018 | EF-REFERENCE-BOUNDARY | open / pending_source | 仍需来源与簇外家族 |
| A03 | D2 输入偏置 | — | MC-R-011 | EF-INPUT-OUTPUT-ROUTING | open | 仅 modifier |
| A04 | D2 输入—输出整合 | — | MC-R-012 | EF-INPUT-OUTPUT-ROUTING | open / pending_source | 与 014/026 端点去重 |
| A05 | D3 探索方向一 | — | — | — | open | Batch 03 禁止由伤官/食伤自动增加 D3 |
| A06 | D3 探索方向二 | — | — | — | open | 待 Batch 04 关系/切换规则审查 |
| A07 | D4 公开有效输出 | — | MC-R-014 | EF-OUTPUT-CHANNEL | open / pending_source | 输出存在不等于表达天赋 |
| A08 | D4 压力响应/接口 | — | MC-R-021 / 022 / 023 | CL-PRESSURE-INTERFACE | open / pending_source | 同对象最多一态；023 为反向候选 |
| A09 | D5 输出进入完成接口 | — | MC-R-026 | EF-OUTPUT-RESOURCE-ROUTE | open / pending_source | 与 012/014/025 复用端点 |
| A10 | D5 完成进入正式承诺 | — | MC-R-027 | EF-RESOURCE-CONSTRAINT-ROUTE | open / pending_source | 与 019 约束端去重 |
| A11 | D6 恒载/恢复 | — | — | — | open | 容量背景仍不足以形成正向锚点 |
| A12 | D6 压力/负荷处理 | — | MC-R-021 / 029 | pressure/load families | open | 021 来源待关；029 仅反向且定义未闭合 |

## 4. B 层｜6 个反向/排除槽

| Slot | Dimension | Frozen Rule ID | Candidate under review | Status | 说明 |
|---|---|---|---|---|---|
| B01 | D1 | — | MC-R-020 / 023 / 030 | open | 多重约束、表达标准冲突、资源竞争分别待定义/来源 |
| B02 | D2 | — | MC-R-013 | open / pending_definition | 只作输入输出过滤，不自动定义 D2 |
| B03 | D3 | — | — | open | 待 Batch 04 |
| B04 | D4 | — | MC-R-013 / 023 | open | 输出过滤与标准接口冲突不得混写 |
| B05 | D5 | — | MC-R-029 / 030 | open / pending_definition | 资源过载和竞争必须对象特定 |
| B06 | D6 | — | MC-R-016 / 020 / 029 | open / pending_definition | 同一容量事实只保留一条具体负荷叙事 |

## 5. C 层｜6 个情境/守门槽

| Slot | 守门主题 | Rule ID / protocol | Status | Batch 03 影响 |
|---|---|---|---|---|
| C01 | 可见不等于稳定 | MC-R-009 | provisional_candidate | 限制 025 的财透无根与输出端近失 |
| C02 | 潜在不自动入报告 | MC-R-010 | provisional_candidate | 继续关闭无引动潜在节点 |
| C03 | 时间/单点支撑敏感 | MC-R-003 | sensitivity_candidate | 所有输出、压力、财、官、印关键节点受时间门约束 |
| C04 | 家族/依赖簇去重 | family-cluster-object cap protocol | provisional_candidate | 新增三个簇和对象范围 |
| C05 | 单一家族不足 | core gate protocol | provisional_candidate | 桥接链与多节点链不能自成多家族 |
| C06 | 候选盘改变核心 | time stability protocol | provisional_candidate | 核心机制变化即退出主样本 |

## 6. Batch 03 可复用修饰规则

| Rule ID | 用途 | 上限 |
|---|---|---|
| MC-R-024 | 财桥解决表达—标准接口的组合叙事 | 与 026+027 同链时不增加证据 |
| MC-R-025 | 资源/完成节点公开且有承接 | 与 026/027 同节点只作显隐说明 |
| MC-R-028 | 约束经印进入内部支持的桥接叙事 | 与 019、011/012 共享端点时不增加家族 |

## 7. 来源待关闭候选

| Rule ID | 候选槽/用途 | 已通过 | 尚未通过 | 释放条件 |
|---|---|---|---|---|
| 021 | A08/A12 压力方法化候选 | 对象、直接制约、互斥、夹具 | 正式版本/页码、簇外家族 | Source gate + 簇外证据 + 报告映射 |
| 022 | A08 压力重定义候选 | 对象、直接制约、子型裁决、夹具 | 正式版本/页码、行为区分 | Source gate + 与 021 主型判据 |
| 023 | B01/B04 未解决接口 | 同对象、救应白名单、夹具 | 正式版本/页码 | Source gate + 024 互斥回归 |
| 026 | A09 输出→完成 | 连续链、对象、竞争/负荷关闭 | 正式版本/页码、端点独立性 | Source gate + 簇外家族 |
| 027 | A10 完成→承诺 | 连续链、约束排除、夹具 | 正式版本/页码、与 019 去重 | Source gate + 簇外家族 |

`pending_source` 不等于已入槽或可用于真人报告。

## 8. 定义阻塞列表

| Rule ID | 阻塞原因 | 关闭条件 |
|---|---|---|
| 007 | 全局通道缺失 | 输出、转化、约束验证器 + 与 039 互斥 |
| 008 | 支持与负荷比较 | 连续链 + 负荷/支持分类 + 家族上限 |
| 013 | 关键输出/直接过滤 | 替代输出扫描 + 作用力量 + 扶身/财制排除 |
| 016 | 输出负荷比较 | 持续/恢复分类 + 收口检查 + 特殊结构排除 |
| 017 | 外部约束弱 | 官杀/隐藏/承接缺失验证器 + 030 优先级 |
| 020 | 混杂未解决 | Batch 04 审查 038 + 完整解决白名单 |
| 029 | 资源负荷超过容量 | 对象计数、持续/恢复分类、严格从财排除 |
| 030 | 对象特定资源竞争 | 直接竞争检测、图内保护白名单、图外情境分离 |

## 9. 当前累计统计

```text
A anchor slots frozen:             0 / 12
B reverse/exclusion slots frozen:  0 / 6
C guard slots provisional:         6 / 6
rules fully reviewed:             30 / 40
rules eligible_core:               0
rules eligible_modifier:          13
rules sensitivity_only:            1
rules pending_source:               8
rules pending_definition:           8
rules excluded_m1b:                 0
abstract fixtures completed:      180
```

## 10. 下一批目标

Batch 04 审查 `MC-R-031`—`MC-R-040`，重点：

- 六合、合而不化、势均之冲与强弱悬殊之冲能否形成稳定关系状态；
- 035、036、040 继续执行核心硬排除；
- 037 刑是否只能作细节；
- 038 是否能关闭 020 的“混杂未解决”定义阻塞；
- 039 是否能与 007 的闭路状态形成互斥；
- 关系类规则是否全部受力量、对象、时间和来源门约束；
- 完成 40/40 审查后，进行跨批次回归与 24 槽第一次候选收束。
