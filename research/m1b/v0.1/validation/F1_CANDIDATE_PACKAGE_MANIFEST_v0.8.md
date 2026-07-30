# CRX-0.8｜F1 内容锁候选包清单

**状态：** Candidate assembled / NOT LOCKED  
**内容锚点：** `docs/m1a-candidate-v0.1-ingest@aa4e7058efffb247878e3648462ec1cb1d0d7f78`  
**说明：** 下列对象只是待审候选；来源页码门与独立遮名评审未关闭，不生成正式 F1 冻结哈希

## 1. 候选内容对象

| 类别 | 文件 | Git blob SHA | 当前状态 |
|---|---|---|---|
| 报告母本 | `reports/REPORT_MASTER_REBUILD_v0.7.md` | `091c2fdb416d7dc68e18bffae3736329ec1036c6` | 4份F0.7候选；40声明已映射 |
| 声明映射 | `reports/REPORT_CLAIM_MAP_v0.7.md` | `7fc4a3921c13c39d5408bfd59d243e4c6df5cb40` | traceability pass as candidate |
| 互斥回归 | `rules/INTERACTION_REGRESSION_v0.7.md` | `5dbb24bc9eb9083978acb985d0d6f9439eb08348` | definition regression pass |
| 近邻矩阵 | `reports/PAIRWISE_DISCRIMINATION_MATRIX_v0.7.md` | `c53a69f7e1fc89560bce647965b7140eb2b8f6aa` | independent review pending |
| 内部体面度审计 | `reports/PRESTIGE_AND_TONE_MASKED_AUDIT_v0.7.md` | `ec18f1d4b6a625215df190fb1e36c830fe245404` | provisional internal pass only |
| 预注册与控制 | `validation/PREREGISTRATION_AND_CONTROLS_v1.0.md` | `d74ceb9d83f81410fc1ad7158f1c9f4093789bfb` | F0 draft |
| 错配规范 | `reports/DECOY_AND_CLAIM_SPEC_v1.0.md` | `8e75180938fc5deed050ba358599915427e546d7` | needs four-mechanism update before F1 |
| 时间资格 | `time/TIME_AND_SAMPLE_SPEC_v1.0.md` | `a0fe42d917cefe7548c9b28ba331ee94950fb5d6` | candidate operational input; F2 not started |
| 独立评审包 | `validation/INDEPENDENT_MASKED_REVIEW_PACKET_v0.8.md` | pending current-branch blob | packet ready; review not executed |
| 内部裁决本 | `validation/INDEPENDENT_MASKED_REVIEW_CODEBOOK_v0.8.md` | pending current-branch blob | mapping frozen; keep from reviewer |
| 来源页码登记 | `sources/P0_QUOTE_PAGE_REGISTER_v0.8.md` | pending current-branch blob | 0/13 selected pages verified |

## 2. F1 候选包拟包含内容

F1 若未来通过，内容锁只包含：

```text
四份或经合并后的报告清洁版
报告十声明单元映射
012/013/014与019/020/038互斥协议
近邻区分与合并门
巴纳姆控制与通用漂亮话控制
错配选择算法
明确不支持条件
来源版本/页码/文本层登记
内容版本说明与统一SHA-256
```

以下不属于 F1 内容锁：

```text
参与者招募
真实出生资料
问卷开放
随机化正式分配
数据保留执行
F3真人测试授权
业务代码或产品实现
```

## 3. 当前阻塞

### 来源侧

```text
selected_edition_page_verified: 0 / 13
selected_edition_quote_transcribed: 0 / 13
variant_collation: incomplete
```

### 内容独立评审侧

```text
masked_packet_ready: yes
mapping_frozen: yes
independent_reviewer_assigned: no
independent_review_completed: no
nearest_pair_merge_gate_adjudicated: no
```

### 规则与报告身份

```text
eligible_core: 0
reports_are_research_candidates: yes
modern_behavior_validation: no
```

## 4. 哈希策略

当前不生成 `F1_FREEZE_MANIFEST.sha256`，原因是：

- 独立评审可能要求 R01/R02 或 R02/R04 合并；
- 来源逐页核验可能改变引文层或限制说明；
- 错配规范仍沿用旧六维表述，需要按四机制重写；
- 任何语义变化都会使当前哈希失去冻结意义。

本文件中的 Git blob SHA 只用于标识候选输入对象，不等同 F1 冻结哈希。

## 5. 当前裁决

```text
F1_candidate_package_assembled: yes
F1_candidate_package_complete: no
F1_content_lock_generated: no
F2_operational_lock_started: no
human_test_authorized: no
```
