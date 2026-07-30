# 来源版本审计｜Batch 03：MC-R-021—MC-R-030

**版本：** `SEA-B03-0.1.0`  
**状态：** Pending Edition Verification  
**范围：** SR-006、SR-007、SR-008、SR-009、SR-013 及其对 MC-R-021—030 的支持边界

## 1. 审计结论

本批传统来源可支持：食神/伤官与七杀的制约关系、伤官见官需看救应、财作为链路节点、财官与官印连续关系、财身承载和比劫与财之间的条件化关系。这些来源不能直接证明现代人的抗压方式、批评风格、成品能力、商业能力、责任感、制度适配或资源竞争行为。

当前仍缺：

- 统一选定的正式出版版本；
- 卷章与逐句页码；
- 原文、原注、后世评注和近代整理分栏；
- “制杀、通关、财身、官印、比劫夺财”等术语的版本异文；
- 现代行为机制的独立经验验证。

因此：

- 021、022、023、026、027 仅为 `pending_source`；
- 024、025、028 只允许进入修饰流程；
- 029、030 先由定义门阻塞；
- 本批不能产生 `eligible_core`；
- T02、T03、T12 只用于价值清理、禁语和反例设计，不替代正式原文校勘。

## 2. 来源对象状态

| Source ID | 登记对象 | Batch 03 可支持 | 当前不能支持 | 门状态 |
|---|---|---|---|---|
| SR-006 | 《子平真诠评注》数字定位文本 | 成败救应、伤官见官财解、财官/官印链路线索 | 合并原文与后世评注；现代落地/责任人格 | `edition_and_layer_pending` |
| SR-007 | 《滴天髓阐微》数字定位文本 | 流通、制化、官杀与财印关系需看条件 | 把古诀、原注、任评混为一体；人格成熟或制度能力 | `edition_and_layer_pending` |
| SR-008 | 《三命通会》卷五数字定位文本 | 财官印食伤杀等传统功能和制化总述 | 掌权、职位、领导、商业能力；OCR 未校勘 | `page_pending` |
| SR-009 | 《三命通会》卷六数字定位文本 | 食神、伤官、制杀、枭食、比劫与财的传统条件 | 英雄化、灾祸、破财、克妻、心理结论 | `page_pending` |
| SR-013 | 《命理探源》卷三数字定位文本 | 近代财身、强弱、承载与条件反例整理 | 古典共识、统一从格判据或现代效度 | `edition_and_page_pending` |

## 3. Rule → Source 追踪

| Rule ID | Source IDs | 当前可支持的传统关系 | 现代机制仍属项目假设 | 来源关闭前层级 |
|---|---|---|---|---|
| 021 | SR-008、SR-009 | 食神对七杀的条件化制约 | 用步骤/产出把压力变成可处理任务 | pending_source |
| 022 | SR-008、SR-009 | 伤官对七杀的条件化制约及与食神差异 | 通过质疑/重定义处理僵硬压力 | pending_source |
| 023 | SR-006、SR-007 | 伤官见官需两端有效且无救应 | 反馈与正式标准接口冲突 | pending_source |
| 024 | SR-006 | 财可作为伤官见官的条件化桥接线索 | 批评转成可交付结果后进入正式结构 | modifier only |
| 025 | SR-006、SR-007 | 财的根、透、来源、去向与承载需联看 | 主动注意交换/完成边界 | modifier only |
| 026 | SR-006、SR-007 | 食伤生财连续关系 | 输出转成成品、交换或现实反馈 | pending_source |
| 027 | SR-006、SR-007 | 财生官连续关系 | 结果进一步形成责任/规则承诺 | pending_source |
| 028 | SR-006、SR-007 | 官印相生连续关系 | 规则压力转成内部方法/秩序 | modifier only |
| 029 | SR-006、SR-013 | 财身承载与比印支持需条件比较 | 机会/责任对象超过恢复容量 | pending_definition |
| 030 | SR-009、SR-013 | 比劫与财关系需排除扶身、官护和食源 | 资源/权限边界发生竞争 | pending_definition |

## 4. 翻译样带的辅助边界

### T12｜食神制杀 / 伤官制杀

只用于提醒：两种输出处理风格须分开，且杀、食伤、承载、财印干扰均须有效；掌权、贵命、英雄、强者等级全部排除。它不证明“方法化抗压”或“重定义压力”真实存在。

### T02｜伤官见官

只用于提醒：一见即凶不可采用，财桥、印制、伤尽、官虚和位置会改变状态；灾祸、官非和反骨推断排除。它不替代 023/024 的对象与链路定义。

### T03｜比劫夺财

只用于提醒：必须有关键资源、直接竞争与保护不足；克妻、破财、兄弟不和全部排除。它不证明现代人的公平感或竞争行为。

## 5. 本批页码登记优先级

| Priority | Source | 需定位主题 | 必须分层 |
|---|---|---|---|
| P1 | SR-006 | 伤官见官、财解、财官、官印、成败救应 | 沈氏原文 vs 徐氏等评注 |
| P1 | SR-009 | 食神/伤官制杀、比劫与财、财印干扰 | 原卷正文 vs 后世事件化解释 |
| P1 | SR-007 | 流通、制化、官印、财身、伤官见官 | 古诀、原注、任氏评注 |
| P2 | SR-008 | 财官印食伤杀总述与制化条件 | 正文、卷次、OCR 校勘 |
| P2 | SR-013 | 财身、强弱、比劫与从象整理 | 明确标记近代整理和转引来源 |

登记字段沿用：

```text
source_id
title
author_or_attribution
editor_or_commentator
publisher
edition
publication_year
isbn_or_catalog_id
volume_chapter
page_start
page_end
quoted_text
text_layer
supports
does_not_support
verified_by
verified_at
scan_or_copy_location
```

## 6. 不可越界的引用

合格：

> 某正式版本在讨论制杀、伤官见官或财官链时同时列出承接、救应与反例；命格译码据此提出一个仍待验证的压力接口或现实转化假设。

不合格：

> 古籍证明食神制杀的人会掌权，食伤生财的人会赚钱，官印相生的人学历高，比劫争财的人守不住钱。

## 7. Batch 03 来源门判断

```text
formal_editions_selected: no
page_register_complete: no
original_commentary_layers_separated: no
translation_samples_used_as_primary_proof: no
modern_behavior_hypotheses_validated: no
core_release_allowed: no
modifier_process_tests_allowed: yes
pending_source_candidates: MC-R-021, MC-R-022, MC-R-023, MC-R-026, MC-R-027
```
