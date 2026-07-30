# 24 槽核心规则试验集台账 v0.2

**版本：** `CRX-0.2.0-draft`  
**状态：** Research Candidate / Process Test Only  
**当前审查覆盖：** MC-R-001—MC-R-020  
**继承台账：** `CORE_RULE_SLOT_LEDGER_v0.1.md`  
**真人测试：** NOT AUTHORIZED

## 1. 本版变化

- 新增 Batch 02 的五个证据家族与两个相关依赖簇；
- 完成 MC-R-011—020 的逐条裁决和 60 个抽象夹具；
- 识别三个“来源门关闭后才可评估”的锚点候选：012、014、018；
- 识别四个定义阻塞候选：013、016、017、020；
- 坚持 `pending_*` 不进入冻结槽，因此 A/B 层实际填槽仍为 0；
- C 层六个治理守门保持 provisional，不因 Batch 02 扩容。

## 2. 填槽原则

- 槽位不是为了凑满；没有合格规则时必须留空；
- `eligible_modifier` 不得冒充锚点；
- `pending_source` 和 `pending_definition` 只列为候选，不计入已填槽；
- 同一证据家族或 dependency cluster 不得占多个独立证据位置；
- 负荷、冲突、时间和显隐守门不得增加正向人格证据；
- 只有 40 条全部审查、来源门关闭、夹具和报告映射通过后，才可形成 `CRX-1.0.0-frozen` 候选。

## 3. A 层｜12 个锚点槽

| Slot | Dimension / direction | Frozen Rule ID | Candidate under review | Evidence family | Status | 说明 |
|---|---|---|---|---|---|---|
| A01 | D1 内部参照 | — | MC-R-017 | EF-REFERENCE-BOUNDARY | open / pending_definition | 外部约束弱缺失验证器未闭合；容量根气不得重复计数 |
| A02 | D1 可谈判边界 | — | MC-R-018 | EF-REFERENCE-BOUNDARY | open / pending_source | 结构合同可执行；正式版本/页码关闭后再评估 |
| A03 | D2 输入偏置 | — | MC-R-011 | EF-INPUT-OUTPUT-ROUTING | open | 011 仅为 modifier，不能单独成为 D2 锚点 |
| A04 | D2 输入—输出整合 | — | MC-R-012 | EF-INPUT-OUTPUT-ROUTING | open / pending_source | 与 014 属相关依赖簇；需要簇外第二家族 |
| A05 | D3 探索方向一 | — | — | — | open | Batch 02 禁止由食伤自动增加 D3 |
| A06 | D3 探索方向二 | — | — | — | open | 待后续启动/切换规则审查 |
| A07 | D4 公开有效输出 | — | MC-R-014 | EF-OUTPUT-CHANNEL | open / pending_source | 输出存在不等于外向、口才或创意；来源门未关 |
| A08 | D4 输出受过滤 | — | MC-R-013 | EF-INPUT-OUTPUT-ROUTING | open / pending_definition | 只可成为反向/过滤候选，关键输出与直接作用未闭合 |
| A09 | D5 现实转化方向一 | — | — | — | open | 待 Batch 03 资源与转化规则 |
| A10 | D5 现实转化方向二 | — | — | — | open | 待 Batch 03 资源与转化规则 |
| A11 | D6 恒载/恢复 | — | — | — | open | Batch 01 容量背景仍不足以成为锚点 |
| A12 | D6 脉冲/负荷 | — | MC-R-016 | EF-OUTPUT-LOAD | open / pending_definition | 负荷比较未闭合，且只作负向守门 |

## 4. B 层｜6 个反向/排除槽

| Slot | Dimension | Frozen Rule ID | Candidate under review | Status | 说明 |
|---|---|---|---|---|---|
| B01 | D1 | — | MC-R-020 | open / pending_definition | 官杀未解决必须先与 038 的解决白名单完成互斥审查 |
| B02 | D2 | — | — | open | 013 不再自动提高 D2，也不能充当 D2 反向槽 |
| B03 | D3 | — | — | open | 待完整审查 |
| B04 | D4 | — | MC-R-013 | open / pending_definition | 可作为输出过滤反向候选，但尚未释放 |
| B05 | D5 | — | — | open | 待 Batch 03 |
| B06 | D6 | — | MC-R-016 / MC-R-020 | open / pending_definition | 输出过载与多重约束负荷均需独立承载证据 |

## 5. C 层｜6 个情境/守门槽

| Slot | 守门主题 | Rule ID / protocol | Evidence family | Status | Batch 02 影响 |
|---|---|---|---|---|---|
| C01 | 显隐：可见不等于稳定 | MC-R-009 | EF-VISIBILITY-SUSTAINABILITY | provisional_candidate | 继续限制 014 的透而无根近失 |
| C02 | 潜在：藏干不自动入报告 | MC-R-010 | EF-VISIBILITY-SUSTAINABILITY | provisional_candidate | 对 015 提供更严格覆盖 |
| C03 | 时间/单点支撑敏感 | MC-R-003 | EF-CAPACITY-VULNERABILITY | sensitivity_candidate | Batch 02 所有根、通道、约束规则继续受其时间门约束 |
| C04 | 同家族/依赖簇去重 | family-and-cluster cap protocol | cross-family governance | provisional_candidate | 新增 `CL-INPUT-OUTPUT` 与 `CL-REFERENCE-CONSTRAINT` |
| C05 | 单一家族不足 | core gate protocol | cross-family governance | provisional_candidate | 012/014 或 018/019 不得仅靠同簇组合形成核心 |
| C06 | 候选盘改变核心 | time stability protocol | time governance | provisional_candidate | 任一端因边界改变核心状态即退出主样本 |

## 6. Batch 02 可复用修饰规则

| Rule ID | 用途 | 家族 | 使用上限 |
|---|---|---|---|
| MC-R-011 | 完整确认输出弱后的输入偏置修饰 | EF-INPUT-OUTPUT-ROUTING | 与 012/013 同对象只取一态；需簇外支持 |
| MC-R-015 | 输出潜在/条件可见修饰 | EF-OUTPUT-CHANNEL | 与 014 互斥；命中 010 时默认不写 |
| MC-R-019 | 单一约束可转成运行框架的修饰 | EF-CONSTRAINT-PROCESSING | 与 020 互斥；与 018 受依赖簇上限 |

## 7. 来源待关闭的锚点候选

| Rule ID | 候选槽 | 已通过 | 尚未通过 | 释放条件 |
|---|---|---|---|---|
| MC-R-012 | A04 | 连续链、互斥、反例、夹具 | 正式版本/页码；依赖簇独立性 | Source gate + 簇外第二家族 + 报告映射 |
| MC-R-014 | A07 | 有效输出、显隐、透根近失、夹具 | 正式版本/页码；与 012 的去重个案 | Source gate + 不重叠证据审计 |
| MC-R-018 | A02 | 双向有效、中介、混杂排除、夹具 | 正式版本/页码；与 019 的依赖审计 | Source gate + 簇外第二家族 |

`pending_source` 只表示材料结构接近可用，不等于已验证、已入槽或可生成人类报告。

## 8. 定义阻塞列表

| Rule ID | 阻塞原因 | 关闭条件 |
|---|---|---|
| MC-R-007 | 全局通道缺失未定义 | 输出、转化、约束通道验证器 + 与 039 互斥测试 |
| MC-R-008 | 支持链与负荷比较未定义 | 连续链合同 + 负荷/支持比较 + 家族上限 |
| MC-R-013 | 关键输出与直接过滤未闭合 | 替代输出扫描 + 作用位置/力量 + 扶身/财制排除 |
| MC-R-016 | 输出持续性与容量比较未闭合 | 分类阈值 + 收口/恢复检查 + 特殊结构排除 |
| MC-R-017 | 外部约束弱是全局否定命题 | 官杀/隐藏/承接缺失验证器 + 与 030 的资源竞争互斥 |
| MC-R-020 | 未解决状态缺完整解决白名单 | Batch 04 审查 038 + 食制/印化/合留/从一方白名单 |

## 9. 当前累计统计

```text
A anchor slots frozen:             0 / 12
B reverse/exclusion slots frozen:  0 / 6
C guard slots provisional:         6 / 6
rules fully reviewed:             20 / 40
rules eligible_core:               0
rules eligible_modifier:          10
rules sensitivity_only:            1
rules pending_source:               3
rules pending_definition:           6
rules excluded_m1b:                 0
abstract fixtures completed:      120
```

其中 `abstract fixtures completed` 为 Batch 01 的 60 个加 Batch 02 的 60 个；全部为虚构流程夹具。

## 10. 下一批目标

Batch 03 审查 `MC-R-021`—`MC-R-030`，重点判断：

- 食神制杀、伤官制杀、伤官见官与财通关能否形成可执行互斥链；
- 财星相关规则能否只描述现实转化/负荷，而不滑向财富和商业能力；
- 官印、财身、比劫争财是否与 Batch 02 的输入、约束、容量事实重复计数；
- 能否为 D4、D5、D6 提供来自 `CL-INPUT-OUTPUT` 和 `CL-REFERENCE-CONSTRAINT` 之外的独立家族；
- 030 是否会关闭或改写 017 的“内部参照”候选。
