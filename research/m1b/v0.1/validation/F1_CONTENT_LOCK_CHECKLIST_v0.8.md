# CRX-0.8｜F1 内容锁检查表

**状态：** Evaluated / NOT READY  
**用途：** 只判断内容材料是否具备锁定条件；不进入 F2、F3 或真人测试

## 1. 报告结构与追踪

| Gate | 结果 | 证据 |
|---|---|---|
| 4份报告均为六区块 | PASS | `REPORT_MASTER_REBUILD_v0.7.md` |
| 320—380紧凑字符 | PASS | 339—360 |
| 同组长度差≤8% | PASS | 6.19% |
| 每份10个声明单元 | PASS | 40/40 |
| 未映射/部分映射声明为0 | PASS as candidate | `REPORT_CLAIM_MAP_v0.7.md` |
| 至少一个适用条件与反向条件 | PASS | 四份均有 |
| 显式宿命、财富、职位、性别价值词为0 | PASS | v0.7自动审计 |
| 旧八原型标题不进入清洁版 | PASS in candidate | 独立包只显示A/B/C/D |

## 2. 规则与互斥

| Gate | 结果 | 说明 |
|---|---|---|
| 40条规则定义悬空为0 | PASS | `pending_definition=0` |
| 012/013同对象互斥 | PASS as definition | 不代表行为效度 |
| 013/014同关键输出互斥 | PASS as definition | 替代输出必须扫描 |
| 012+014簇贡献上限1 | PASS as definition | 不拆成吸收+表达两证据 |
| 019/020/038同对象三态互斥 | PASS as definition | scope separation新增0证据 |
| 关系、显隐、桥接、综合门新增证据为0 | PASS | CRX-0.5—0.7协议 |
| `eligible_core`至少1 | FAIL / not required for draft research, required before validated system claim | 当前仍为0 |

## 3. 来源门

| Gate | 结果 | 说明 |
|---|---|---|
| 正式版本候选已选 | PASS | 5组版本 |
| 原文/原注/后世评注/近代整理已分层 | PASS | L1—L5合同 |
| 章节锚点已登记 | PASS | 13/13 |
| 历史公版扫描已交叉核验 | PASS as witness | 不替代选定版本 |
| 选定版本精确页码 | FAIL | 0/13 |
| 选定版本逐句引文 | FAIL | 0/13 |
| 关键异文登记 | FAIL | incomplete |
| 来源关闭被误写为行为验证 | PASS | 明确禁止 |

## 4. 区分度与体面度

| Gate | 结果 | 说明 |
|---|---|---|
| 六组成对定义矩阵 | PASS | 对象与流程位置已写明 |
| R01/R02危险近邻定义差异 | PASS as definition | 独立评审待执行 |
| R02/R04危险近邻定义差异 | PASS as definition | 独立评审待执行 |
| 单作者两轮换序遮名审计 | PROVISIONAL PASS | 不能替代独立审查 |
| 独立遮名评审包 | PASS | v0.8已生成 |
| 独立评审者资格确认 | FAIL / not executed | 未分配 |
| 独立近邻区分结果 | FAIL / not executed | 未返回 |
| 独立体面度赢家检查 | FAIL / not executed | 未返回 |
| 必要时报告合并 | PENDING | 等独立评审 |

## 5. 控制与错配

| Gate | 结果 | 说明 |
|---|---|---|
| 巴纳姆控制草案 | PASS as F0 | 尚未内容锁 |
| 通用漂亮话控制草案 | PASS as F0 | 尚未内容锁 |
| 四机制错配三类角色 | PASS as candidate | `DECOY_SELECTION_SPEC_v0.8.md` |
| 近邻错配算法针对四报告 | PASS as candidate | 固定本人报告对应的近邻/共享接口/远距角色 |
| 报告合并时算法自动失效 | PASS | 必须升版本并重建 |
| 同版本、同质量约束 | PASS as policy | 未来执行 |
| 真实错配池 | NOT APPLICABLE / prohibited now | 尚无真人报告 |

## 6. 归档与版本

| Gate | 结果 | 说明 |
|---|---|---|
| M1-A历史包17/17入库 | FAIL | 1/17 |
| 源对象字节哈希 | FAIL | 未完成 |
| F1候选包清单 | PASS | v0.8已生成 |
| 正式F1冻结哈希 | NOT GENERATED | 正确保持空缺 |
| PR可Ready/Merge | FAIL | 归档门未关 |

## 7. 总裁决

```text
report_structure_gate: pass
claim_traceability_gate: pass_as_candidate
interaction_definition_gate: pass
selected_edition_source_gate: fail_open
independent_masked_review_gate: fail_not_executed
decoy_algorithm_four_mechanism_update: pass_as_candidate
M1A_archive_gate: fail_open
F1_content_lock_ready: no
F2_operational_lock_ready: no
human_test_authorized: no
PR_ready_for_merge: no
```

## 8. 最小剩余条件

在不新增业务范围的前提下，F1只剩两类外部证据工作：

1. 关闭13项选定版本页码、引文与文本层；
2. 完成至少一次合格独立遮名评审，并按预设合并门裁决。

若独立评审触发报告合并，则需重建报告、声明映射、错配角色和候选清单后再次评审。

M1-A 17/17归档门另行阻止 PR Ready/Merge。任何一项未完成，都不得用“研究材料已经很多”替代。
