# CRX-0.6｜40条规则合并状态登记

**版本：** `RR-CONSOLIDATED-0.6.0`  
**继承：** `CONSOLIDATED_RULE_REGISTRY_v0.5.md`  
**状态：** Research Candidate / Not Human-Tested

## 1. 本版变化

CRX-0.6只改变两条规则的定义状态；其余38条继承v0.5，不回写历史批次：

| Rule | v0.5 | v0.6 | 当前角色 | 用户报告释放 |
|---|---|---|---|---|
| MC-R-008 | `pending_definition` | `pending_source` | 低容量候选下的支持路由内部守门 | none |
| MC-R-013 | `pending_definition` | `pending_source` | 关键食神输出被直接过滤的反向候选 | none |

两条规则的定义已经通过12个虚构夹具完成流程验证，但正式页码、逐句来源和现代行为验证仍未关闭。

## 2. 当前40条状态

```text
eligible_core:        0
eligible_modifier:   14
sensitivity_only:    12
pending_source:      14
pending_definition:   0
excluded_m1b:         0
core_hard_excluded subset: 3
```

总和：

```text
14 + 12 + 14 = 40
```

核心硬排除子集继续为：

```text
MC-R-035
MC-R-036
MC-R-040
```

## 3. Pending Source 分组

### P0｜主机制来源门

```text
MC-R-012
MC-R-014
MC-R-018
MC-R-026
MC-R-027
```

已完成版本选择、文本层级分离和章节定位；页码与逐句引文仍待扫描核对。

### P1｜反向、压力与状态互斥

```text
MC-R-020
MC-R-021
MC-R-022
MC-R-023
MC-R-038
```

### P2｜综合与内部守门

```text
MC-R-007
MC-R-008
MC-R-013
MC-R-039
```

P2规则不得因结构复杂或作用范围广而被升级为核心人格证据。

## 4. 机制与报告角色

| Mechanism | Primary rules | 当前报告 |
|---|---|---|
| M-A1 输入先行 | 011 + 012；013为反向 | R01 |
| M-A2 公开成稿 | 014；009/010/015为显隐守门 | R02 |
| M-B1 权限—标准协商 | 018 + 020/038；019/027修饰 | R03 |
| M-C1 完成—承诺 | 026 + 027；024/025修饰 | R04 |

`MC-R-008`只允许打开其他机制的支持路由审查，不产生独立声明。`MC-R-013`只有来源关闭后才可能作为反向机制进入下一轮报告回归。

## 5. 夹具累计

```text
Batch 01—04 rule fixtures: 240
CRX-0.6 definition fixtures: 12
rule fixtures total: 252
combination fixtures: 8
real participants: 0
```

## 6. 升级禁令

以下仍不能把任何规则升级为`eligible_core`：

- 只有正式传统来源，没有现代行为证据；
- 同一依赖簇内多条规则共同满足；
- 修饰、桥接、综合门或关系标签被当成独立家族；
- 报告文字认领感强，但可否认行为和反例不足；
- 为保留旧六维、八原型或视觉资产而补写规则。
