# CRX-0.6｜候选机制与槽位台账

**版本：** `CRX-0.6.0-draft`  
**状态：** Research Candidate / Process Test Only  
**继承：** `CORE_RULE_SLOT_LEDGER_v0.5.md`  
**真人测试：** NOT AUTHORIZED

## 1. 本版变化

- `MC-R-008`与`013`完成定义，均转为`pending_source`；
- P01、P04、P08退出当前核心候选；
- P05只保留为辅助组合特质；
- 候选报告由8份收束为4份；
- 旧六维24槽继续停止机械填充；
- 当前只维护对象特定机制状态、反向状态和治理门。

## 2. 主机制候选

| ID | 机制 | Primary rules | Status | 对应报告 | 核心阻塞 |
|---|---|---|---|---|---|
| K01 | 输入经内部承接到达输出 | 012；011修饰 | open / pending_source | R01 | P0页码、簇外支持、5句报告修复 |
| K02 | 输出公开有效 | 014；009/010/015守门 | open / pending_source | R02 | P0页码、簇外支持、近邻区分 |
| K03 | 权限与共同标准可协商 | 018；019修饰 | open / pending_source | R03 | P0页码、与约束状态去重 |
| K04 | 多重约束已解决/未解决 | 020 / 038 | open / pending_source | R03 | P1页码、对象一致性、状态互斥回归 |
| K05 | 输出进入完成对象 | 026；024/025修饰 | open / pending_source | R04 | P0页码、输出端点去重 |
| K06 | 完成进入正式承诺 | 027；019/028修饰 | open / pending_source | R04 | P0页码、约束端点去重 |

没有任何K状态进入Frozen Rule ID。

## 3. 反向与内部守门候选

| ID | 机制 | Rule | Status | 作用 |
|---|---|---|---|---|
| X01 | 关键输出被直接过滤 | 013 | open / pending_source | 关闭同对象012/014；不增加D2 |
| X02 | 表达—正式标准未解决 | 023 | open / pending_source | 与024互斥；只作对象反向状态 |
| X03 | 容量闭路 | 007 | open / pending_source | 与039互斥；不写固执或没有出口 |
| G01 | 低容量下支持路由有效 | 008 | open / pending_source / gate_only | 允许其他路由继续审查；新增证据=0 |
| G02 | 容量开放综合门 | 039 | open / pending_source / composite_gate | 复用多家族；新增证据=0 |

## 4. 辅助与敏感性

### 辅助特质

```text
S-01 接缝桥接
required: at least two non-duplicate main mechanisms
new_evidence: 0
core_report: forbidden
```

### 治理门

| Gate | 内容 | 状态 |
|---|---|---|
| C01 | 可见不等于稳定 | provisional |
| C02 | 潜在不自动进入报告 | provisional |
| C03 | 时间与单点支撑敏感 | provisional |
| C04 | 家族/簇/端点/对象去重 | provisional |
| C05 | 单一家族不足以形成核心 | provisional |
| C06 | 候选盘改变核心则退出主样本 | provisional |

### 退出或降级

```text
P01 exploration core: retired
P04 maintenance core: retired
P08 long-horizon core: retired
P05 coordination core: retired; secondary only
D3 exploration dimension: removed from current model
```

关系、负荷、竞争与从格敏感性仍不进入核心槽。

## 5. 报告与机制映射

| Report | 主机制 | 次级修饰 | 当前状态 |
|---|---|---|---|
| R01 输入先行 | K01 | 011、015、G01 | F0 / claim repair required |
| R02 公开成稿 | K02 | 009、010、015 | F0 / external-family gate open |
| R03 权限协商 | K03 + K04 | 019、027、028 | F0 / dependency audit open |
| R04 完成承诺 | K05 + K06 | 024、025 | F0 / endpoint audit open |

四份报告均未达到F1。

## 6. 当前统计

```text
rules reviewed: 40 / 40
eligible_core: 0
eligible_modifier: 14
sensitivity_only: 12
pending_source: 14
pending_definition: 0
core_hard_excluded subset: 3

rule fixtures: 252
combination fixtures: 8
report candidates: 4
reports ready for F1: 0
real participants: 0
```

## 7. 下一次填槽前置条件

1. P0五条完成页码与逐句引文；
2. 013完成来源关闭并重跑012/014互斥；
3. 四份报告的五个风险声明完成删除或降级；
4. R01/R02、R02/R04、R03/R04近邻区分通过；
5. 每个主报告得到簇外独立支持或被合并；
6. 遮名体面度与正向强度审计通过；
7. 所有材料仍保持F0/F1边界，不接触真人。
