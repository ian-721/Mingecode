# 来源版本审计｜Batch 01：MC-R-001—MC-R-010

**版本：** `SEA-B01-0.1.0`  
**状态：** Pending Edition Verification  
**范围：** SR-005、SR-006、SR-007、SR-008、SR-009、SR-013 及其对 MC-R-001—010 的支持边界

## 1. 审计结论

M1-A 已经正确声明：传统材料只能证明“传统如何描述结构”，不能证明现代人格机制。Batch 01 的规则文本具有来源线索，但仍缺少统一选定的正式出版版本、卷章页码、原文/评注分栏和逐句引用位置。

因此：

- 本批可以继续做定义和虚构夹具测试；
- 本批可以产生 `eligible_modifier`；
- 本批不能产生 `eligible_core`；
- 任何报告声明都不得把现代机制写成古籍原意或既有事实；
- F1 Content Lock 前必须关闭正式版本与页码门。

## 2. 来源对象状态

| Source ID | 登记对象 | 当前可支持 | 当前不能支持 | Batch 01 门 |
|---|---|---|---|---|
| SR-005 | 《渊海子平》数字定位文本 | 十神、从象、传统断语的历史定位 | 现代人格机制、精确根气权重、统一版本页码 | `page_pending` |
| SR-006 | 《子平真诠评注》数字定位文本 | 月令、变化、救应与反单标签思路 | 把清代原文与民国评注混为一体；现代行为因果 | `edition_and_layer_pending` |
| SR-007 | 《滴天髓阐微》数字定位文本 | 旺衰、流通、冲与混杂需条件化的传统线索 | 古诀、原注、任氏评注未经分栏的单一权威结论 | `edition_and_layer_pending` |
| SR-008 | 《三命通会》卷五数字定位文本 | 十神、生克制化总述的传统语境 | OCR/版本未校勘前的精确引文；人格效度 | `page_pending` |
| SR-009 | 《三命通会》卷六数字定位文本 | 食神、伤官、枭神和制化条件的传统语境 | 去除事件化前直接用于用户报告 | `page_pending` |
| SR-013 | 《命理探源》卷三数字定位文本 | 近代流派对强弱、财身、印食的整理 | 古典共识或独立原典证明 | `edition_and_page_pending` |

## 3. Rule → Source 追踪

| Rule ID | Source IDs | 当前来源判断 | 来源关闭前允许层级 |
|---|---|---|---|
| MC-R-001 | SR-006、SR-007 | 可支持“容量判断需月令、根、流通与反例”；不能证明 D1/D6 行为 | modifier only |
| MC-R-002 | SR-006、SR-013 | 可支持得令/得地与条件化扶助；根的独立性为项目定义 | modifier only |
| MC-R-003 | SR-007 | 可支持“冲的结果不可一概而论”；力量阈值和现代波动机制未关闭 | sensitivity only |
| MC-R-004 | SR-006、SR-008 | 可支持月令与透干在传统结构中的重要性；外显行为为项目假设 | modifier only |
| MC-R-005 | SR-005、SR-006 | 可支持显隐差异线索；不能把藏而不透直接等同感受吸收 | modifier only |
| MC-R-006 | SR-007、SR-013 | 可支持根与承载的传统线索；“多恢复入口”为项目假设 | modifier only |
| MC-R-007 | SR-007、SR-009 | 可支持流通与出口的重要性；全局“通道缺失”尚无统一定义 | pending_definition |
| MC-R-008 | SR-006、SR-013 | 可支持扶助与链路条件化；“支持到达”和负荷比较未定义 | pending_definition |
| MC-R-009 | SR-006、SR-007 | 可支持有根/虚浮之区分；只准作声明强度守门 | modifier only |
| MC-R-010 | SR-005、SR-006 | 可支持显隐与潜在/外显区分；藏干强弱仍有流派差异 | modifier only |

## 4. 页码登记模板

每个被接受的正式版本必须单独登记：

```text
source_id:
title:
author_or_attribution:
editor_or_commentator:
publisher:
edition:
publication_year:
isbn_or_catalog_id:
volume_chapter:
page_start:
page_end:
quoted_text:
text_layer: original | original_note | later_commentary | modern_compilation
supports:
does_not_support:
verified_by:
verified_at:
scan_or_copy_location:
```

禁止只写书名和网页链接后声称“已校勘”。

## 5. 优先校勘顺序

1. SR-006：先分离沈孝瞻原文与后世评注；
2. SR-007：分离古诀、原注与任铁樵评注；
3. SR-008/009：确定《三命通会》采用版本、卷次和页码；
4. SR-005：确定《渊海子平》版本并标明文本传承问题；
5. SR-013：仅作为近代流派整理，不回升为古典原典。

## 6. 不可越界的引用格式

合格：

> 某正式版本的某卷某页将月令、透干与成败救应并置讨论；本项目据此提出“结构显隐需要条件化”的现代研究假设。

不合格：

> 古人早就证明，月令透干的人更外向。

## 7. Batch 01 冻结判断

```text
formal_editions_selected: no
page_register_complete: no
original_commentary_layers_separated: no
modern_behavior_hypotheses_validated: no
core_release_allowed: no
modifier_process_tests_allowed: yes
```
