# 首批规则目录 v0.2

状态：`research_candidate`。规则 ID 保留以维持追踪稳定；语义已按 Issue #11 收敛为静态结构。所有规则共同使用 v0.4 公式、来源簇去重、候选盘聚合和 `RULE_SCHEMA.md` 两维核心门。

## A01

| ID | 类型 | 成立 | 反证 / 降级 | 权限 |
| --- | --- | --- | --- | --- |
| A01-R01 | support | C01；D1 supply_continuous | 路径 limited 降 candidate；blocked/unknown 不支持 | 内部供能链连续的骨架句 |
| A01-R02 | support | C02；D6 limited/blocked，上游链 effective | D6 effective 排除；上游 limited 降级 | 外部收束接口相对弱的骨架句 |
| A01-R03 | tension | A01 形态 E4 established | 无共享具体端点/来源簇不支持 | 只允许结构张力；重写/重开地图需问题 |
| A01-R04 | exclusion | D3 mediated 时由最近邻边界干净排除 A01；direct_only/mixed 与 A01 支持并存时为 counterevidence；D6 effective 指向 A04 | unknown 产生 candidate/boundary | 不输出 A01 established |

## A02

| ID | 类型 | 成立 | 反证 / 降级 | 权限 |
| --- | --- | --- | --- | --- |
| A02-R01 | support | C03；D2 output_visible_asymmetric | output 非 visible 或 subject/output 状态未知不支持 | 输出外显与主体容量不对称 |
| A02-R02 | support | D5 output_constraint_coupled | 接触 limited 降级；uncoupled 不支持 | 只允许 output—constraint 结构接口 |
| A02-R03 | tension | A02 形态 E4 established | 无共享 output 端点来源簇不支持 | 不允许环境/反馈/恢复行为 |
| A02-R04 | exclusion | direct constraint→subject raw contact 同时出现，或 D4 continuous | limited 接触仍与支持形成 conflicted；unknown 降级 | 不输出 A02 established |

## A03

| ID | 类型 | 成立 | 反证 / 降级 | 权限 |
| --- | --- | --- | --- | --- |
| A03-R01 | support | C04；D3 constraint_mediated | direct_only/mixed/blocked 排除；链 limited 降级 | 约束经中介链处理 |
| A03-R02 | support | C01；D1 supply_continuous | supply limited/blocked 不支持核心 | 只允许供能链骨架，不允许 P06 |
| A03-R03 | tension | A03 形态 E4 established | constraint→input 与 input→subject 不共享具体 input 端点不支持 | 只允许结构交接张力 |
| A03-R04 | exclusion | D3 direct_only、mixed 或 constraint_blocked | 候选间不同为 boundary_sensitive | 不输出 A03 established |

## A04

| ID | 类型 | 成立 | 反证 / 降级 | 权限 |
| --- | --- | --- | --- | --- |
| A04-R01 | support | C05；D4 conversion_continuous | 任一段 limited 降 candidate；blocked 不支持 | 完整转换链骨架 |
| A04-R02 | support | D6 resource_interface_effective | limited/blocked 不支持核心 | 只允许资源接口有效，不允许 P08 |
| A04-R03 | tension | A04 形态 E4 established | 两转换边不共享具体 output 端点不支持 | 只允许转换交接张力 |
| A04-R04 | exclusion | direct constraint→subject effective，或 D6 limited/blocked | unknown 降级；候选变化为 boundary_sensitive | 不输出 A04 established |

## 共享守门

| ID | 必须满足 |
| --- | --- |
| G01 | 月令链和同一对象派生事实按 `originClusterKey` 去重；至少两个不同来源簇 |
| G02 | 所有合理 `civil_time_v1` 候选盘保持同一核心，否则 boundary_sensitive |
| G03 | 排除未命中，且 v0.4 全部成对最近邻边界可执行；不使用固定优先级 |
| G04 | 至少两个不可重复维度、两个独立证据家族、一项同源 E4 张力 |

## Manifestation-only 表达

P06「持续建构伴随内部审查」和 P08「完成度门过早进入生成阶段」没有核心规则 ID。方法化、内部质检、首版延迟、意义价值双验收、过早淘汰灵感、环境敏感、反馈耗电、重写问题等均只由最多 3 道问题选择人工批准 manifestation 块，不能改变上述 20 条规则的状态。
