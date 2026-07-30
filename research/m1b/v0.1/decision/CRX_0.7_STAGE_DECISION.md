# CRX-0.7｜P0扫描交叉核验、声明修复与四报告区分回归阶段决定

**状态：** Completed as Draft Research Decision  
**真人测试：** NOT AUTHORIZED  
**业务开发：** NOT AUTHORIZED  
**完整视觉系统：** NOT AUTHORIZED

## 1. 本阶段完成

- 为P0五条规则找到并核验公版历史扫描见证；
- 在《子平真诠》扫描本中定位10个相关章节页；
- 确认《三命通会》卷五、卷六分册扫描和《滴天髓阐微》1947扫描对象；
- 更新13项P0页码/引文登记，明确区分历史见证与现代选定版本；
- 重跑012/013/014及019/020/038互斥、覆盖和依赖簇上限；
- 修复CRX-0.6识别的5个无充分依据声明；
- 重建四份v0.7报告并完成40个声明单元映射；
- 建立6组成对近邻区分矩阵；
- 执行两轮单审查者遮名体面度/职业声望审计；
- 更新报告等质审计与机制内容门台账；
- 未回写M1-A原始包、旧规则批次或旧报告母本。

## 2. P0来源门裁决

### 已推进

```text
public_historical_scan_objects_identified: yes
Ziping_chapter_pages_manually_checked: 10
historical_L1_witness_verified: 4 / 13
historical_witness_layer_partial: 4 / 13
scan_object_identified_page_pending: 5 / 13
```

### 仍未关闭

```text
selected_modern_edition_page_verified: 0 / 13
verbatim_quote_transcribed: 0 / 13
variant_collation: incomplete
modern_behavior_validation: no
```

历史扫描证明目标章节和条件化讨论确实存在，降低了二手摘要误引风险；但它不能替代CRX-0.6指定现代点校/评注版本的精确页码，也不能把传统结构关系变成现代人格证据。

因此：

```text
MC-R-012: pending_source
MC-R-014: pending_source
MC-R-018: pending_source
MC-R-026: pending_source
MC-R-027: pending_source
eligible_core: 0
```

## 3. 关键互斥回归裁决

### 输入—输出状态

```text
012 integrated ↔ 013 key output filtered
013 filtered ↔ 014 public supported（同一关键输出）
012 + 014允许共存，但CL-INPUT-OUTPUT正向贡献上限为1
009关闭“可见即稳定”
010/015只作潜在/显隐守门
```

### 约束混合状态

```text
019 single integrated
020 mixed unresolved
038 mixed resolved
```

三态对同一对象互斥；对象分离只关闭全局混杂，不增加“成熟整合”正向证据；依赖岁运或时间边界的解决只进入敏感性。

定义回归通过不等于现代人格效度通过。

## 4. 四份报告修订结果

```text
R01 输入先行
R02 公开成稿
R03 权限协商
R04 完成承诺
```

自动结构结果：

```text
compact_lengths: 339, 344, 349, 360
length_spread: 6.19%
six_section_structure: pass
claim_units: 40
traceable_or_modifier_or_gate: 36
advice_only: 4
unsupported_or_partial: 0
```

CRX-0.6的5个风险句已被删除或改为对象特定的路线/状态表达，不再使用“过度负责、通过外部证明自己、迟迟不愿承诺、主动增加义务”等无规则推论。

## 5. 成对区分裁决

六组定义级差异均已写明；最近邻仍为：

```text
R01 ↔ R02
形成首版前的输入顺序 vs 判断成形后的公开外化

R02 ↔ R04
可观察输出 vs 被接收的完成对象与后续责任接口
```

当前没有立即合并，但这是材料层决定，不是用户区分结果。独立遮名审查若仍无法稳定指出这两个差异，必须合并或删除，禁止通过增加形容词保留数量。

## 6. 体面度与声望裁决

单审查者两轮换序遮名审计未发现稳定的单一“最好人格”，但仍存在：

```text
R01: 认真/严谨联想
R02: 表达/产出联想
R03: 成熟/协作联想
R04: 交付/责任联想
```

这些残余风险不能由起草者自行关闭。独立人工遮名横向审查仍为F1硬门；该审查是材料评审，不是正式真人盲测。

## 7. 当前规则与报告状态

```text
eligible_core:        0
eligible_modifier:   14
sensitivity_only:    12
pending_source:      14
pending_definition:   0

reports: 4
reports_with_unmapped_claims: 0
reports_ready_for_F1: 0 / 4
```

报告追踪完整只表示“每句话不再自由发挥”，不表示规则或报告已验证。

## 8. M1-A归档门仍未关闭

```text
M1A_original_files_in_original_dir: 1 / 17
source_byte_sha256_complete: no
byte_identity_gate: open
PR_ready_for_merge: no
```

CRX研究材料变多不能替代M1-A不可变历史快照门。

## 9. 下一阶段建议

下一工作单元：

> **CRX-0.8｜选定版本逐页关闭、独立遮名内容评审与F1候选锁定**

顺序：

1. 取得CRX-0.6选定版本的可复核页面，关闭13项页码、逐句文本层和异文；
2. 对R01—R04执行独立遮名体面度与近邻区分评审；
3. R01/R02、R02/R04若失败，先合并再重建声明映射；
4. 将通过的报告、声明表、互斥协议、控制文本和错配算法组成F1候选包；
5. 重新计算UTF-8/LF规范哈希；
6. 只输出是否达到F1内容锁条件，不进入F2和真人测试。

## 10. 明确禁止

- 不招募、不测试真人；
- 不接收真实出生资料；
- 不把四份报告称为正式人格；
- 不把公版扫描交叉核验称为选定版本页码已关闭；
- 不把单审查者遮名审计称为独立盲审；
- 不恢复P01、P04、P08或新增第41条规则补数量；
- 不开始业务代码、排盘实现、数据库、API、部署或完整视觉系统；
- PR保持Draft，不Ready、不Merge。

## 11. 阶段门

```text
CRX_0_7_completed: yes
public_scan_crosscheck_completed: yes
selected_edition_page_gate_closed: no
interaction_definition_regression: pass
report_claim_traceability: pass_as_candidate
pairwise_definition_matrix: pass
single_reviewer_masked_audit: provisional_pass
independent_masked_review: pending
F1_content_lock_ready: no
F2_operational_lock_ready: no
human_test_authorized: no
business_development_authorized: no
PR_ready_for_merge: no
```
