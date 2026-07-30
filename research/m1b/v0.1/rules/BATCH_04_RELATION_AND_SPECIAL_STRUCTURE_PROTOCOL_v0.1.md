# Batch 04｜关系状态、解决白名单与全局路由协议 v0.1

**状态：** F0 Draft / Process Test Only  
**适用规则：** `MC-R-031`—`MC-R-040`  
**跨批次对象：** `MC-R-007`、`MC-R-020`  
**合同：** `RULE_DEFINITION_CONTRACT_v1.3-draft.md`

## 1. 目的

Batch 04 的十条规则大多不是十个独立人格信号，而是：

- 对已有功能节点的关系修饰；
- 同一对象的互斥状态；
- 只适合敏感性附录的弱解释；
- 跨多个已计家族的综合门；
- 应从首轮核心裁决中硬排除的特殊结构。

本协议防止：

- 把六合写成合作力；
- 把冲写成行动力或爱变化；
- 把刑害写成内耗、疾病或隐性伤害；
- 把透藏差异写成“双面人格”；
- 把官杀“已解决”与“未解决”同时触发；
- 把容量、输出、资源、约束重复拼成“高能力者”；
- 因从格叙事更完整而覆盖普通规则。

## 2. 关系规则总门

每条关系规则必须经过：

```text
G1 两端有效
G2 对象范围一致
G3 力量分类稳定
G4 更具体链路扫描
G5 竞争关系扫描
G6 时间稳定性
G7 家族/簇去重
```

任一门失败，关系标签不进入报告。

## 3. 合关系互斥

```text
C1 redirected_or_stable_interface (031)
C2 binding_without_redirection    (032)
C3 contested_or_broken
C0 ineffective
```

同一 `relation_scope_id` 只能保留一个状态。

| 组合 | 裁决 |
|---|---|
| 031 + 032 | 互斥；有稳定转向用031，无转向但占用用032 |
| 031 + 强冲破合 | 关系降为 contested，不触发031 |
| 032 + 明确合局/引化 | 关闭032 |
| 031/032 + 更具体的024或038 | 使用更具体链路，关系只作背景 |
| 任一端时间不稳定 | sensitivity appendix only |

## 4. 冲关系互斥

```text
K1 comparable_activation  (033)
K2 dominant_displacement  (034)
K3 indeterminate
K0 mitigated/ineffective
```

| 组合 | 裁决 |
|---|---|
| 033 + 034 | 同一对象互斥 |
| 033 + 更具体接口冲突 | 采用023/020等对象机制 |
| 034 + MC-R-003 | 若作用于唯一关键根，003优先 |
| 034 + MC-R-029/030 | 采用具体负荷/竞争原因，不重复写“冲” |
| 力量分类跨时间变化 | 不进入主分析 |

033不能占D3槽；034不能占D6槽。

## 5. 刑害最小解释原则

### 035

只有在重复刑标签、有效功能和稳定时间同时成立时才保留附录记录。即便成立：

```text
user_claim = none
dimension_effect = none
core_eligibility = hard_excluded
```

### 036

“害”必须排在所有更具体机制之后。若没有可观察的受影响功能，则视为零解释增量并忽略。

```text
user_claim = none
dimension_effect = none
core_eligibility = hard_excluded
```

## 6. 透藏组合协议

037只消费既有状态，不创造新状态：

```text
public_state  <- 004/014/019/025 等
hidden_state  <- 005/015 等
closing_gates <- 009/010
```

允许：

- 对两个已确认、不同功能和不同情境的状态做组合说明；
- 在报告审计中标记“公开动作/内部准备不同”。

禁止：

- 将037计为第二个D2或D4家族；
- 使用“外冷内热、双面、表里不一、隐藏天才”；
- 在没有具体情境时生成声明。

## 7. 020/038 互斥协议

```text
RC-C1 single_integrated  -> 019
RC-C2 mixed_unresolved   -> 020
RC-C3 mixed_resolved     -> 038
RC-C0 unknown
```

### 038 解决白名单

```text
effective_retention
direct_control
stable_subordination
scope_separation
```

- `scope_separation` 只证明两套约束不在同一对象混杂；关闭020，但不增加038正向证据；
- 其余三类必须形成稳定主次；
- 名义合制、岁运暂时解决、报告导向选主次全部失败。

### 后续状态

020 与 038 的定义互斥现在可执行；二者都转入来源门，不进入真人材料。

## 8. 007/039 开放—闭路协议

### 路由类

```text
support/input
output
pressure handling
resource/completion
constraint/commitment
load/conflict/competition gates
```

### 状态

| 状态 | 规则 | 说明 |
|---|---|---|
| closed_capacity | 007 | 容量存在，但所有输出/转化/约束路由都未成立 |
| open_integrated_capacity | 039 | 容量存在，至少两类不同路由有效且互不关闭 |
| overloaded_or_conflicted | 016/020/023/029/030 | 路由存在但负荷或冲突未解 |
| unknown | 无 | 扫描不完整 |

039只是一道“可释放既有具体声明”的综合门，不得被当作独立证据或人格赞美。007和039同一结构互斥。

## 9. 从格隔离协议

040必须在普通容量、支持、路由和异质功能扫描完成后最后检查。

```text
ordinary_rules_first: yes
follow_structure_override: forbidden
human_report_release: none
core_eligibility: hard_excluded
```

只有多流派、独立审查和全部时间候选一致时，未来才可讨论是否保留在MVP附录。

## 10. 依赖上限

| Cluster | 上限 |
|---|---|
| CL-RELATION-STATE | 0份独立正向人格证据 |
| CL-VISIBILITY-STATE | 0份新增证据；只组合 |
| EF-CONSTRAINT-MIX-RESOLUTION | 同对象只取020或038一态 |
| CL-CAPACITY-ROUTE-SYSTEM | 0份新增证据；只作综合门 |
| CL-FOLLOW-STRUCTURE | 核心硬排除 |

## 11. 跨批次回归清单

Batch 04 后必须重跑：

1. 003 与 034 的唯一根冲突优先级；
2. 004/005/009/010/014/015 与 037 的显隐去重；
3. 019/020/038 三态互斥；
4. 007/039 与所有路线、负荷、竞争门；
5. 024 与 031/038 的更具体解决优先级；
6. 029/030 与 034 的对象特定原因优先级；
7. 040 不得覆盖任何普通规则。

## 12. 当前结论

```text
relation_rules_core_released: no
hard_exclusions_enforced: 035,036,040
020_definition_block_closed: yes
007_definition_block_closed: yes
formal_source_gate_closed: no
human_test_authorized: no
```
