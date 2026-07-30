# CRX-0.8｜P0 引文与页码登记表

**状态：** Historical witness crosschecked / Selected edition pages unavailable  
**继承：** `P0_QUOTE_PAGE_REGISTER_v0.7.md`  
**规则：** `historical_witness_*` 不得被改写成 `selected_edition_page_verified`

## 1. 登记表

| Register ID | Rule | Selected source | Chapter / topic anchor | Historical witness | Selected page | Selected quote | Layer | Status |
|---|---|---|---|---|---|---|---|---|
| QP-012-01 | 012 | SR-006A | 论用神成败救应 | L1 chapter witness checked | PENDING_SELECTED_PAGE | PENDING | L1 | `blocked_external_page` |
| QP-012-02 | 012 | SR-006A | 论用神变化 | L1 chapter witness checked | PENDING_SELECTED_PAGE | PENDING | L1 | `blocked_external_page` |
| QP-012-03 | 012 | SR-006B | 论印绶、论食神相关评注 | historical/secondary layer partially checked | PENDING_SELECTED_PAGE | PENDING | L1/L3 split | `blocked_external_page` |
| QP-014-01 | 014 | SR-006A | 论食神 | L1 chapter witness checked | PENDING_SELECTED_PAGE | PENDING | L1 | `blocked_external_page` |
| QP-014-02 | 014 | SR-006A | 论伤官 | L1 chapter witness checked | PENDING_SELECTED_PAGE | PENDING | L1 | `blocked_external_page` |
| QP-014-03 | 014 | SR-008/009A | 卷五十神名义、卷六食伤材料 | scan object identified; exact pages pending | PENDING_SELECTED_PAGE | PENDING | L1 | `blocked_external_page` |
| QP-018-01 | 018 | SR-006A/B | 用神成败救应、官杀 | historical/secondary layer partially checked | PENDING_SELECTED_PAGE | PENDING | L1/L3 split | `blocked_external_page` |
| QP-018-02 | 018 | SR-007A | 通关、官杀 | 1947 scan object identified; exact section pages pending | PENDING_SELECTED_PAGE | PENDING | L1/L2/L3 split | `blocked_external_page` |
| QP-026-01 | 026 | SR-006A/B | 食神、伤官、财 | historical/secondary layer partially checked | PENDING_SELECTED_PAGE | PENDING | L1/L3 split | `blocked_external_page` |
| QP-026-02 | 026 | SR-007A | 源流、通关 | 1947 scan object identified; exact section pages pending | PENDING_SELECTED_PAGE | PENDING | L1/L2/L3 split | `blocked_external_page` |
| QP-027-01 | 027 | SR-006A/B | 财、正官 | historical/secondary layer partially checked | PENDING_SELECTED_PAGE | PENDING | L1/L3 split | `blocked_external_page` |
| QP-027-02 | 027 | SR-007A | 源流、官杀 | 1947 scan object identified; exact section pages pending | PENDING_SELECTED_PAGE | PENDING | L1/L2/L3 split | `blocked_external_page` |
| QP-027-03 | 027 | SR-008/009A | 卷五正官及财官材料 | scan object identified; exact pages pending | PENDING_SELECTED_PAGE | PENDING | L1 | `blocked_external_page` |

## 2. 证据等级

```text
L0 bibliography_only
L1 historical_scan_witness
L2 selected_edition_page
L3 selected_edition_quote_and_layer
L4 variant_collated
```

F1 来源门要求每项至少达到 L3；涉及原文与后世评注差异者还需达到 L4。

## 3. 当前计数

```text
registered_items: 13
historical_witness_checked_or_identified: 13
selected_edition_page_verified: 0
selected_edition_quote_transcribed: 0
variant_collated: 0
blocked_external_page: 13
source_gate_closed: no
```

## 4. 填写纪律

获得页面后，每条必须补齐：

```text
physical_or_scan_location
edition_identifier
volume_and_chapter
printed_page_start
printed_page_end
digital_image_or_pdf_page
quote_text
text_layer
variant_notes
verified_by
verified_at
```

- 印刷页码与 PDF 页序必须分开记录；
- 引文只截取足以证明结构关系的最小上下文；
- 原典、原注、后世评注和近代整理必须分别登记；
- 不得根据相邻版本推算页码；
- 不得因报告已经写好而只挑支持性句子，必须同时登记限制与反例。

## 5. 当前裁决

所有 13 项继续保持开放。该状态阻止 P0 规则进入核心候选和 F1 内容锁，但不否定已经完成的定义与虚构夹具研究。
