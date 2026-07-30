# CRX-0.5｜候选机制槽位台账

**版本：** `CRX-0.5.0-draft`  
**状态：** Candidate Convergence / Not Frozen  
**继承：** `CORE_RULE_SLOT_LEDGER_v0.4.md`  
**真人测试：** NOT AUTHORIZED

## 1. 为什么不继续机械填原24槽

原24槽按六维各两个锚点、六个反向和六个守门设计。40/40审查后，六维独立性门未通过，尤其D3没有可释放家族，D2/D4/D5端点高度重叠，D6只有守门。

因此本版不把`pending_source`塞进原24槽，而先建立“八个对象特定候选机制状态 + 六个治理/容量门”。这是一张收束表，不是冻结规则集。

## 2. 八个候选机制状态

| Candidate ID | 机制状态 | Rule ID | Cluster | 当前状态 | 主要阻塞 |
|---|---|---|---|---|---|
| K01 | 输入经内部承接到达输出 | MC-R-012 | CL-INPUT-OUTPUT | pending_source | 正式来源、与014/026端点去重、现代行为验证 |
| K02 | 输出公开有效 | MC-R-014 | CL-INPUT-OUTPUT | pending_source | 正式来源；不得等同外向/口才 |
| K03 | 方法化压力响应 | MC-R-021 | CL-PRESSURE-INTERFACE | pending_source | 正式来源、与022主型判据、簇外支持 |
| K04 | 重定义压力响应 | MC-R-022 | CL-PRESSURE-INTERFACE | pending_source | 正式来源、与021行为区分、删除D1自动映射 |
| K05 | 可谈判边界 | MC-R-018 | CL-REFERENCE-CONSTRAINT | pending_source | 正式来源、簇外支持、020/038回归 |
| K06 | 多重约束状态 | MC-R-020 / 038 | CL-REFERENCE-CONSTRAINT | pending_source pair | 未解决/已解决来源、对象一致性、用户声明边界 |
| K07 | 输出进入完成接口 | MC-R-026 | CL-REALITY-CONVERSION | pending_source | 正式来源、与012/014/025端点去重 |
| K08 | 完成进入正式承诺 | MC-R-027 | CL-REALITY-CONVERSION | pending_source | 正式来源、与019/038约束端去重 |

### 候选机制上限

- K01与K02若共享同一输出链，只计一个主机制贡献；
- K03与K04对同一压力对象只能取一个主型；
- K05与K06共享约束对象时只计一个主机制簇；
- K07与K08若为同一资源链，可形成连续叙事但不自动成为两个独立人格家族；
- 任一核心原型仍须由至少两个不同主簇共同支持。

## 3. 反向/关闭状态

| Reverse ID | 状态 | Rule ID | 当前资格 | 作用 |
|---|---|---|---|---|
| R01 | 关键输出被直接过滤 | MC-R-013 | pending_definition | 关闭K01/K02对应关键输出；需替代输出扫描 |
| R02 | 表达—正式标准未解决 | MC-R-023 | pending_source | 与024互斥；对象特定接口冲突 |
| R03 | 多重约束未解决 | MC-R-020 | pending_source | 与038互斥；不直接人格化 |
| R04 | 容量闭路 | MC-R-007 | pending_source composite gate | 与039互斥；只作全局关闭状态 |
| R05 | 输出/资源负荷候选 | MC-R-016 / 029 | sensitivity_only | 只限制报告强度，不占反向人格槽 |
| R06 | 对象资源竞争 | MC-R-030 | sensitivity_only | 关闭同对象资源正向释放，不生成边界人格 |

R05、R06不再作为核心反向规则；它们只保留在敏感性与报告释放门。

## 4. 六个治理与修饰门

| Gate ID | 主题 | Rule/Protocol | 作用 |
|---|---|---|---|
| G01 | 容量基础 | 001/002/006及家族上限 | 只证明主链有最低承接背景 |
| G02 | 支持到达 | 008 | 尚待定义；确认名义支持是否真的到达 |
| G03 | 显隐与声明强度 | 004/005/009/010/015/037 | 调整公开、条件可见或不释放；新增0证据 |
| G04 | 时间与单点稳定性 | 003 + time protocol | 候选盘改变核心即退出主样本 |
| G05 | 家族/簇/对象去重 | cross-batch cap protocol | 同一底层事实最多一份正向贡献 |
| G06 | 容量开放/闭路总门 | 007/039 | 综合检查；新增0证据 |

## 5. 原24槽处理

| 原槽类型 | 原数量 | CRX-0.5处理 |
|---|---:|---|
| A锚点 | 12 | 不冻结；由K01—K08替代为对象特定候选状态 |
| B反向 | 6 | 不冻结；R01—R04保留候选，R05/R06降为敏感性 |
| C守门 | 6 | 重组为G01—G06，仍为治理层 |

```text
original_24_slots_frozen: 0
candidate_mechanism_states: 8
candidate_reverse_states: 4
sensitivity_close_states: 2
governance_gates: 6
```

## 6. 报告候选映射

| 原型 | 可映射机制 | 当前结论 |
|---|---|---|
| P01 | 无 | Hold |
| P02 | K01的输入侧 + 011 modifier | Hold/Narrow；不足以形成核心 |
| P03 | K01/K02 + K03/K04或R02 | Conditional Candidate |
| P04 | 无正向主机制 | Hold |
| P05 | K05 + K07/K08 + 024/028 modifier | Secondary Composite Only |
| P06 | K05/K06 | Conditional Candidate；仍需簇外第二家族 |
| P07 | K07/K08 | Conditional Candidate；仍需簇外第二家族 |
| P08 | 无 | Hold |

## 7. 第一次收束判断

```text
mechanism_candidates_ready_for_source_work: 8
mechanism_candidates_ready_for_content_lock: 0
reports_conditionally_traceable: P03, P06, P07
reports_partially_traceable: P02, P05
reports_without_core_mechanism: P01, P04, P08
F1_content_lock_allowed: no
```
