# CRX-0.6｜P0 引文与页码登记表

**状态：** Chapter Located / Page Pending  
**规则：** 只有拿到可复核印本或扫描后才填写页码和逐句引文；搜索摘要、转载页和 OCR 片段不得被当作最终页码证据。

## 1. 登记表

| Register ID | Rule | Source edition | Chapter / topic anchor | Page | Quote | Text layer | Status |
|---|---|---|---|---|---|---|---|
| QP-012-01 | MC-R-012 | SR-006A | 论用神成败救应 | PENDING_SCAN | PENDING | L1 | chapter_located |
| QP-012-02 | MC-R-012 | SR-006A | 论用神变化 | PENDING_SCAN | PENDING | L1 | chapter_located |
| QP-012-03 | MC-R-012 | SR-006B | 论印绶、论食神相关评注 | PENDING_SCAN | PENDING | L1/L3 split | chapter_located |
| QP-014-01 | MC-R-014 | SR-006A | 论食神 | PENDING_SCAN | PENDING | L1 | chapter_located |
| QP-014-02 | MC-R-014 | SR-006A | 论伤官 | PENDING_SCAN | PENDING | L1 | chapter_located |
| QP-014-03 | MC-R-014 | SR-008/009A | 卷五论古人立印食官财名义；卷六食伤材料 | PENDING_SCAN | PENDING | L1 | chapter_located |
| QP-018-01 | MC-R-018 | SR-006A/B | 用神成败救应、官杀相关章节 | PENDING_SCAN | PENDING | L1/L3 split | chapter_located |
| QP-018-02 | MC-R-018 | SR-007A | 通关、官杀 | PENDING_SCAN | PENDING | L1/L2/L3 split | chapter_located |
| QP-026-01 | MC-R-026 | SR-006A/B | 食神、伤官、财 | PENDING_SCAN | PENDING | L1/L3 split | chapter_located |
| QP-026-02 | MC-R-026 | SR-007A | 源流、通关 | PENDING_SCAN | PENDING | L1/L2/L3 split | chapter_located |
| QP-027-01 | MC-R-027 | SR-006A/B | 财、正官 | PENDING_SCAN | PENDING | L1/L3 split | chapter_located |
| QP-027-02 | MC-R-027 | SR-007A | 源流、官杀 | PENDING_SCAN | PENDING | L1/L2/L3 split | chapter_located |
| QP-027-03 | MC-R-027 | SR-008A | 卷五正官及财官相关材料 | PENDING_SCAN | PENDING | L1 | chapter_located |

## 2. 逐条关闭条件

每条记录必须补齐：

```text
physical_or_scan_location
edition_identifier
volume_and_chapter
page_start
page_end
quote_text
text_layer
variant_notes
verified_by
verified_at
```

## 3. 当前判断

```text
registered_items: 13
chapter_located: 13
page_verified: 0
quote_transcribed: 0
source_gate_closed: no
```

本表的作用是防止将“已经知道在哪一章”误写成“已经完成页码校勘”。
