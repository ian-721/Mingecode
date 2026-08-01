# 首批规则目录 v0.3

状态：`research_candidate`。规则 ID 保留；所有规则先执行 v0.4 role matrix 完整闭包，fixture 不得输入手工关系。

## A01

| ID | 类型 | 成立 | 反证/降级 | 权限 |
| --- | --- | --- | --- | --- |
| A01-R01 | support | D1 supply_continuous | limited 降 candidate；blocked 不支持 | 供能链骨架 |
| A01-R02 | support | D6 limited/blocked，上游 subject→output 有效 | D6 effective 排除 | 收束接口骨架 |
| A01-R03 | tension | A01 E4：subject→output 对 output→resource 受限 | 无共享 output 端点不支持 | 仅结构张力 |
| A01-R04 | exclusion | constraint 路由形成有效中介，或 D6 effective | unknown 降级 | 不输出 A01 established |

## A02

| ID | 类型 | 成立 | 反证/降级 | 权限 |
| --- | --- | --- | --- | --- |
| A02-R01 | support | D2 output_visible_asymmetric | output 非 visible 或非 usable 不支持 | 输出外显与主体容量不对称 |
| A02-R02 | support | D5 output_constraint_regulating | competition/feedback 排除或冲突 | 完整三边接口，不是单条关系 |
| A02-R03 | tension | subject→output limited、output→constraint effective、constraint→subject limited | 任一 unknown 降级 | 不允许环境/恢复行为 |
| A02-R04 | exclusion | D5 shared_endpoint_competition，或 D4 continuous | 固有 constraint→subject 的存在本身不排除 | 不输出 A02 established |

## A03

| ID | 类型 | 成立 | 反证/降级 | 权限 |
| --- | --- | --- | --- | --- |
| A03-R01 | support | D3 constraint_mediated_by_output；subject→output→constraint effective | mixed/input-mediated/direct_only/blocked 排除 | 约束由输出中介的骨架 |
| A03-R02 | support | D2 output_supported | output limited/unknown 降级 | S03 主体容量与输出通道；不读取 D1 |
| A03-R03 | tension | output→constraint 与 constraint→subject effective，共享 constraint 端点 | competition/unknown 降级 | output-control feedback 结构 |
| A03-R04 | exclusion | D3 mixed、input-mediated、direct_only 或 blocked | 候选不同为 boundary_sensitive | 不输出 A03 established |

## A04

| ID | 类型 | 成立 | 反证/降级 | 权限 |
| --- | --- | --- | --- | --- |
| A04-R01 | support | D4 conversion_continuous | 任一段 limited/blocked 不支持核心 | 完整转换链 |
| A04-R02 | support | D6 resource_interface_effective | limited/blocked 不支持 | 资源接口 |
| A04-R03 | tension | subject→output 与 output→resource effective，共享 output | 无共享端点不支持 | 转换交接张力 |
| A04-R04 | exclusion | D3 mixed/output-mediated，或 D6 limited/blocked | unknown 降级 | 不输出 A04 established |

## 共享守门

| ID | 必须满足 |
| --- | --- |
| G01 | role matrix 合法；完整对象对闭包；invalid/missing/duplicate/manual-selected 四项均 0 |
| G02 | 月令链和同对象派生按 originClusterKey 去重；至少两个来源簇 |
| G03 | 所有 civil_time_v1 候选盘同核，否则 boundary_sensitive |
| G04 | 两个维度、两个家族、一项 E4 张力、排除未命中、最近邻唯一 |

P06/P08 及方法化、质检、首版延迟、双验收、环境敏感、反馈耗电、重写问题只属于最多 3 道问题选择的 manifestation，不改变规则状态。
