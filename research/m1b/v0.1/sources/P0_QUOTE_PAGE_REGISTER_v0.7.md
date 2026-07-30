# CRX-0.7｜P0 引文与页码登记表 v0.7

**继承：** `P0_QUOTE_PAGE_REGISTER_v0.6.md`  
**状态：** Historical Scan Cross-check Added / Selected-edition Page Pending  
**规则：** 历史扫描见证、现代选定版本页码和现代行为验证必须分开记录

## 1. 更新后的13项登记

| Register ID | Rule | 选定来源层 | 历史扫描交叉核验 | 选定版本页码 | 逐句引文 | 当前状态 |
|---|---|---|---|---|---|---|
| QP-012-01 | 012 | SR-006A / L1 | WIT-ZP-01：PDF 27，书内19，论用神成败救应 | PENDING_SELECTED_EDITION_SCAN | PENDING | `historical_L1_witness_verified` |
| QP-012-02 | 012 | SR-006A / L1 | WIT-ZP-01：PDF 30，书内22，论用神变化 | PENDING_SELECTED_EDITION_SCAN | PENDING | `historical_L1_witness_verified` |
| QP-012-03 | 012 | SR-006B / L1+L3 | 原文层可由书内19、22、63、65交叉核对；徐氏评注层未核 | PENDING_SELECTED_EDITION_SCAN | PENDING | `historical_witness_layer_partial` |
| QP-014-01 | 014 | SR-006A / L1 | WIT-ZP-01：书内65，论食神及取运段落 | PENDING_SELECTED_EDITION_SCAN | PENDING | `historical_L1_witness_verified` |
| QP-014-02 | 014 | SR-006A / L1 | WIT-ZP-01：PDF 81，书内73，论伤官 | PENDING_SELECTED_EDITION_SCAN | PENDING | `historical_L1_witness_verified` |
| QP-014-03 | 014 | SR-008/009A / L1 | WIT-SMT-01：第9—12册覆盖卷五、卷六；未逐页 | PENDING_SELECTED_EDITION_SCAN | PENDING | `scan_object_identified_page_pending` |
| QP-018-01 | 018 | SR-006A/B / L1+L3 | 原文层可由书内19、52、58交叉核对；评注层未核 | PENDING_SELECTED_EDITION_SCAN | PENDING | `historical_witness_layer_partial` |
| QP-018-02 | 018 | SR-007A / L1+L2+L3 | WIT-DTS-01 已定位源流、通关、官杀章节；未逐页 | PENDING_SELECTED_EDITION_SCAN | PENDING | `scan_object_identified_page_pending` |
| QP-026-01 | 026 | SR-006A/B / L1+L3 | 原文层可由书内59、62、65、73、76交叉核对；评注层未核 | PENDING_SELECTED_EDITION_SCAN | PENDING | `historical_witness_layer_partial` |
| QP-026-02 | 026 | SR-007A / L1+L2+L3 | WIT-DTS-01 已定位源流、通关章节；未逐页 | PENDING_SELECTED_EDITION_SCAN | PENDING | `scan_object_identified_page_pending` |
| QP-027-01 | 027 | SR-006A/B / L1+L3 | 原文层可由书内52、58、59、62交叉核对；评注层未核 | PENDING_SELECTED_EDITION_SCAN | PENDING | `historical_witness_layer_partial` |
| QP-027-02 | 027 | SR-007A / L1+L2+L3 | WIT-DTS-01 已定位源流、通关、官杀章节；未逐页 | PENDING_SELECTED_EDITION_SCAN | PENDING | `scan_object_identified_page_pending` |
| QP-027-03 | 027 | SR-008A / L1 | WIT-SMT-01：第9、10册为卷五上、下；未逐页 | PENDING_SELECTED_EDITION_SCAN | PENDING | `scan_object_identified_page_pending` |

## 2. 为什么仍不填写 Quote

本轮没有把扫描页上较长古文整段转录进研究包，原因不是文本不存在，而是关闭登记项还要求：

```text
selected_edition_identifier
selected_edition_page_start/end
exact_text_layer
variant_notes
verbatim_check_against_scan
second_pass_verification
```

在这些字段齐备前，只记录章节名、页码位置和语义锚点；不使用网页摘要、OCR 自动结果或二手转载替代逐句核对。

## 3. 当前统计

```text
registered_items: 13
historical_L1_witness_verified: 4
historical_witness_layer_partial: 4
scan_object_identified_page_pending: 5
selected_modern_edition_page_verified: 0
verbatim_quote_transcribed: 0
source_gate_closed: no
```

## 4. 规则状态影响

```text
MC-R-012: pending_source
MC-R-014: pending_source
MC-R-018: pending_source
MC-R-026: pending_source
MC-R-027: pending_source
```

历史扫描交叉核验降低了“章节定位错误或二手材料误引”的风险，但没有满足 `candidate_after_source` 的全部释放条件，也不产生任何现代人格证据。
