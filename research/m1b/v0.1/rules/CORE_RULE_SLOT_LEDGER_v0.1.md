# 24 槽核心规则试验集台账 v0.1

**版本：** `CRX-0.1.0-draft`  
**状态：** Research Candidate / Process Test Only  
**当前审查覆盖：** MC-R-001—MC-R-010  
**真人测试：** NOT AUTHORIZED

## 1. 填槽原则

- 槽位不是为了凑满；没有合格规则时必须留空；
- `eligible_modifier` 不得冒充锚点；
- 同一证据家族不得占据多个“独立证据”位置；
- `sensitivity_only` 只进入守门，不进入原型正向证据；
- `pending_*` 不进入任何冻结槽；
- 只有 40 条全部审查后，才可形成 `CRX-1.0.0-frozen` 候选。

## 2. A 层｜12 个锚点槽

| Slot | Dimension / direction | Rule ID | Evidence family | Status | 说明 |
|---|---|---|---|---|---|
| A01 | D1 方向一 | — | — | open | Batch 01 无规则达到核心锚点门 |
| A02 | D1 方向二 | — | — | open | 待 Batch 02+ |
| A03 | D2 方向一 | — | — | open | 005 不得由显隐直接提升 D2 |
| A04 | D2 方向二 | — | — | open | 待 Batch 02+ |
| A05 | D3 方向一 | — | — | open | 待后续探索/启动规则 |
| A06 | D3 方向二 | — | — | open | 待后续探索/启动规则 |
| A07 | D4 方向一 | — | — | open | 待后续表达规则 |
| A08 | D4 方向二 | — | — | open | 待后续表达规则 |
| A09 | D5 方向一 | — | — | open | 待后续转化规则 |
| A10 | D5 方向二 | — | — | open | 待后续转化规则 |
| A11 | D6 恒载/恢复 | — | — | open | 001/002/006 仅容量背景，不能单独定 D6 |
| A12 | D6 脉冲/负荷 | — | — | open | 003 仅敏感性；007/008 尚待定义 |

## 3. B 层｜6 个反向/排除槽

| Slot | Dimension | Rule ID | Status | 说明 |
|---|---|---|---|---|
| B01 | D1 | — | open | 待完整审查 |
| B02 | D2 | — | open | 待完整审查 |
| B03 | D3 | — | open | 待完整审查 |
| B04 | D4 | — | open | 待完整审查 |
| B05 | D5 | — | open | 待完整审查 |
| B06 | D6 | — | open | MC-R-003 尚不能成为常规反向规则 |

## 4. C 层｜6 个情境/守门槽

| Slot | 守门主题 | Rule ID / protocol | Evidence family | Status | 说明 |
|---|---|---|---|---|---|
| C01 | 显隐：可见不等于稳定 | MC-R-009 | EF-VISIBILITY-SUSTAINABILITY | provisional_candidate | 允许进入抽象 dry run，不得生成核心证据 |
| C02 | 潜在：藏干不自动入报告 | MC-R-010 | EF-VISIBILITY-SUSTAINABILITY | provisional_candidate | 与 009 同家族；按功能分别守门，不作独立支持 |
| C03 | 时间/单点支撑敏感 | MC-R-003 | EF-CAPACITY-VULNERABILITY | sensitivity_candidate | 力量合同未完成；只进附录 dry run |
| C04 | 同家族去重 | family-cap protocol | cross-family governance | provisional_candidate | 001/002/006 同家族只计一次 |
| C05 | 单一家族不足 | core gate protocol | cross-family governance | provisional_candidate | 只有容量/显隐信号时不生成核心原型 |
| C06 | 候选盘改变核心 | time stability protocol | time governance | provisional_candidate | 改变核心即退出主样本 |

## 5. Batch 01 未入槽但可复用的修饰规则

| Rule ID | 用途 | 家族 | 使用上限 |
|---|---|---|---|
| MC-R-001 | 月令支持 + 有根的容量背景 | EF-CAPACITY-BASE | 每盘 1 个家族贡献 |
| MC-R-002 | 失令多根的恢复型子类 | EF-CAPACITY-BASE | 与 006 同时满足时 002 叙事优先 |
| MC-R-004 | 月令主题公开外显 | EF-MONTH-VISIBILITY | 每个功能 1 个显隐修饰 |
| MC-R-005 | 月令主题条件/私域可见 | EF-MONTH-VISIBILITY | 与 004 互斥；若 010 命中则默认不写 |
| MC-R-006 | 多点根的一般容量背景 | EF-CAPACITY-BASE | 被 001/002 更具体条件覆盖时不重复写 |

## 6. Blocked 列表

| Rule ID | 阻塞原因 | 关闭条件 |
|---|---|---|
| MC-R-007 | 全局通道缺失未定义 | 输出、转化、约束通道验证器 + 与 039 互斥测试 |
| MC-R-008 | 支持链与负荷比较未定义 | 连续链合同 + 负荷/支持比较 + 家族上限 |

## 7. 当前台账统计

```text
A anchor slots filled:              0 / 12
B reverse/exclusion slots filled:   0 / 6
C guard slots provisional:          6 / 6
rules fully reviewed:              10 / 40
rules eligible_core:                0
rules eligible_modifier:            7
rules sensitivity_only:             1
rules pending_definition:           2
```

`C` 层“provisional”只表示治理结构可继续 dry run，不表示所有守门已经 F1 冻结。

## 8. 下一批目标

Batch 02 审查 MC-R-011—MC-R-020，重点判断：

- 吸收与表达能否真正分离；
- 印、食伤、比劫、官杀的信号是否重复跨维度累计；
- 规则能否提供 D1、D2、D4、D6 的第一批真正锚点；
- `MC-R-020` 与后续解决规则的互斥是否可执行。
