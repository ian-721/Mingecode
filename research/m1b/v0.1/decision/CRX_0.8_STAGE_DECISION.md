# CRX-0.8｜选定版本逐页关闭、独立遮名评审与F1候选锁定阶段决定

**状态：** Completed as Evidence-Gated Draft Decision  
**F1内容锁：** NOT READY  
**F2操作锁：** NOT STARTED  
**真人测试：** NOT AUTHORIZED  
**业务开发：** NOT AUTHORIZED

## 1. 本阶段完成

- 对P0选定版本执行公开可访问页面的尽职搜索；
- 明确区分书目/目录、历史公版扫描、其他重排电子本和选定版本逐页证据；
- 将13项P0登记升级为v0.8，并保持选定版本页码0/13、逐句引文0/13；
- 生成独立遮名内容评审包；
- 冻结内部映射、随机顺序、危险近邻和预设合并门；
- 将旧六维错配逻辑改写为四机制错配规范；
- 组装F1内容锁候选包清单；
- 完成F1检查表并明确剩余硬门；
- 未改写CRX-0.7四份报告正文、声明映射或历史研究记录。

## 2. P0选定版本页码门

本轮核验到：

```text
edition_identity_verified: yes
chapter_anchor_verified: yes
historical_scan_witness_available: yes
public_selected_edition_full_pages_available: no
selected_edition_page_verified: 0 / 13
selected_edition_quote_transcribed: 0 / 13
variant_collation_complete: no
```

公开书目、Google Books元数据、图书商品页和历史扫描可以支持书目与章节交叉核对，但不能承担选定点校/汇校版本的精确页码和逐句文本层。

因此五条P0主机制规则继续为：

```text
MC-R-012: pending_source
MC-R-014: pending_source
MC-R-018: pending_source
MC-R-026: pending_source
MC-R-027: pending_source
```

本轮没有用其他版本页码代填，也没有把搜索摘要当作引文。

## 3. 独立遮名评审门

已完成：

```text
masked_packet_ready: yes
mapping_frozen: yes
review_sequences_frozen: yes
prestige_questions_frozen: yes
pairwise_merge_gates_frozen: yes
falsification_questions_frozen: yes
```

尚未完成：

```text
independent_reviewer_assigned: no
independent_reviewer_qualification_checked: no
independent_review_returned: no
pre_unblind_record_locked: no
merge_adjudication_completed: no
```

作者自审和CRX-0.7单审查者换序复核不能替代独立评审。

## 4. 四机制错配规范

旧六维模型已停止推进，因此错配不再使用六维距离。本轮固定四份报告的错配角色：

```text
R01本人：近邻R02，共享接口R03，远距R04
R02本人：近邻R04，共享接口R01，远距R03
R03本人：近邻R04，共享接口R01，远距R02
R04本人：近邻R02，共享接口R03，远距R01
```

所有未来四选一材料仍必须同版本、同长度、同版式、同正向强度，并隐藏内部名称。

若独立评审触发任何报告合并，错配规范、随机化、声明表和候选哈希全部失效，必须升版本重建。

## 5. F1候选包状态

已组装候选对象：

- 四份v0.7报告；
- 40声明单元映射；
- 关键互斥回归；
- 六组成对区分矩阵；
- 内部体面度审计；
- 独立评审包与内部裁决本；
- 巴纳姆/漂亮话控制草案；
- 四机制错配规范；
- 时间资格门；
- P0来源登记。

但没有生成正式`F1_FREEZE_MANIFEST.sha256`，因为报告可能因独立评审合并，来源说明也可能因逐页校勘发生语义变化。

## 6. F1检查结果

```text
report_structure_gate: pass
claim_traceability_gate: pass_as_candidate
interaction_definition_gate: pass
pairwise_definition_gate: pass
four_mechanism_decoy_spec: pass_as_candidate
selected_edition_source_gate: fail_open
independent_masked_review_gate: fail_not_executed
eligible_core: 0
F1_content_lock_ready: no
```

“候选包已组装”不等于“内容已锁定”。

## 7. M1-A归档门

该门独立于CRX研究进展，仍为：

```text
M1A_original_files_in_original_dir: 1 / 17
source_byte_sha256_complete: no
byte_identity_gate: open
PR_ready_for_merge: no
```

即使未来F1内容门通过，PR也不能在M1-A原始快照未补齐时Ready或Merge。

## 8. 下一工作单元

下一步不是继续内部润色，而是一个外部证据关闭单元：

> **CRX-0.8A｜选定版本页面补证与独立遮名评审回收**

只允许：

1. 取得13项对应的选定版本页面或受控阅览记录；
2. 转录最小必要引文、文本层和异文；
3. 将遮名评审包交给合格独立评审者；
4. 原样登记返回表后再揭盲；
5. 按预设门决定保留、合并或删除报告；
6. 若两道门均关闭，再生成F1候选冻结包和规范哈希。

不得在证据返回前继续通过增加修辞、增加原型或新增规则推进。

## 9. 明确禁止

- 不把公开搜索未找到页面解释为“来源大致够用”；
- 不以作者自审替代独立遮名评审；
- 不将评审包用于收集本人认领感；
- 不招募、不测试真人；
- 不接收真实出生资料；
- 不把四份机制称为正式人格；
- 不开始F2、F3、业务代码、排盘实现、数据库、API、部署或完整视觉系统；
- PR保持Draft，不Ready、不Merge。

## 10. 阶段门

```text
CRX_0_8_internal_work_completed: yes
public_selected_edition_access_attempt_completed: yes
selected_edition_page_gate_closed: no
independent_review_packet_ready: yes
independent_review_completed: no
four_mechanism_decoy_spec_ready: yes
F1_candidate_package_assembled: yes
F1_content_lock_ready: no
F2_operational_lock_ready: no
human_test_authorized: no
business_development_authorized: no
PR_ready_for_merge: no
```
