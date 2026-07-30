# 来源版本审计｜Batch 02：MC-R-011—MC-R-020

**版本：** `SEA-B02-0.1.0`  
**状态：** Pending Edition Verification  
**范围：** SR-005、SR-006、SR-007、SR-008、SR-009、SR-013 及其对 MC-R-011—020 的支持边界

## 1. 审计结论

Batch 02 的传统来源可以支持“印、食伤、比劫、官杀在传统结构中存在生扶、输出、制约、混杂与救应等条件化关系”。它们不能直接证明现代人的吸收方式、表达习惯、主体边界、责任感或压力处理。

当前仍缺：

- 统一选定的正式出版版本；
- 卷章与逐句页码；
- 原文、原注、后世评注、近代整理分栏；
- 关键术语在不同版本中的异文记录；
- 现代机制的独立经验验证。

因此：

- 011、015、019 只允许进入修饰流程；
- 012、014、018 只标记为 `pending_source` 锚点候选；
- 013、016、017、020 先由定义门阻塞；
- 本批不能产生 `eligible_core`；
- 传统翻译样带 T04、T05、T06 只能帮助识别价值判断与禁语，不替代正式原文校勘。

## 2. 来源对象状态

| Source ID | 登记对象 | Batch 02 可支持 | 当前不能支持 | 门状态 |
|---|---|---|---|---|
| SR-005 | 《渊海子平》数字定位文本 | 印、食伤、比劫等传统功能关系与显隐线索 | 学习力、表达力、独立性；统一版本页码 | `edition_and_page_pending` |
| SR-006 | 《子平真诠评注》数字定位文本 | 月令、十神配置、成败救应与条件化制化线索 | 把沈孝瞻原文与后世评注合成单一原意；现代行为因果 | `edition_and_layer_pending` |
| SR-007 | 《滴天髓阐微》数字定位文本 | 流通、制化、官杀混杂需看条件的传统线索 | 把古诀、原注、任氏评注混为一体；人格成熟度 | `edition_and_layer_pending` |
| SR-008 | 《三命通会》卷五数字定位文本 | 官杀、责任、制化的传统语境 | 职位、道德、领导力或责任人格；OCR 未校勘引文 | `page_pending` |
| SR-009 | 《三命通会》卷六数字定位文本 | 食神、伤官、枭神、比劫和制化条件的传统语境 | 克子、福食、疾病等事件断语；现代心理结论 | `page_pending` |
| SR-013 | 《命理探源》卷三数字定位文本 | 近代对强弱、印食、财身和条件反例的整理 | 古典共识、独立原典证明或现代效度 | `edition_and_page_pending` |

## 3. Rule → Source 追踪

| Rule ID | Source IDs | 当前传统来源可支持 | 现代机制仍属项目假设 | 来源关闭前允许层级 |
|---|---|---|---|---|
| MC-R-011 | SR-005、SR-013 | 印的生扶/输入语义与食伤输出需条件联看 | “先吸收后输出”、延迟表达 | modifier only |
| MC-R-012 | SR-006、SR-013 | 印身食等连续关系、不能只数十神 | 输入经过内部加工后稳定转为表达 | pending_source |
| MC-R-013 | SR-009、SR-013 | 枭食关系具有条件性，存在财制、扶身和替代出口等反例 | 内审过滤创作/表达 | pending_definition |
| MC-R-014 | SR-005、SR-006 | 食伤作为输出功能、透根与制化需联看 | 观点较常成为作品、样例或反馈 | pending_source |
| MC-R-015 | SR-005、SR-006 | 藏透显隐线索 | 私域/熟悉情境更会表达 | modifier only |
| MC-R-016 | SR-006、SR-013 | 泄身、强弱与扶助需条件比较 | 输出速度高于恢复能力 | pending_definition |
| MC-R-017 | SR-005、SR-009 | 比劫与官杀的传统功能差异 | 内定标、自主、把修正视为控制 | pending_definition |
| MC-R-018 | SR-006、SR-007 | 比劫与官杀均有效时需看制化和承接，不可按数量平衡 | 可谈判边界、明确权限协作 | pending_source |
| MC-R-019 | SR-006、SR-008 | 单一官杀主导且有承接/制化的传统条件 | 把标准、职责转成运行框架 | modifier only |
| MC-R-020 | SR-007、SR-006 | 官杀同现不必然混杂；主次、合留和制化重要 | 多套标准导致持续自我审查 | pending_definition |

## 4. 传统翻译样带的辅助边界

### T04｜印旺

可用于提醒：印旺不能直接等于聪明、学历、依赖或母缘；是否能表达必须另看食伤与承载。它支持 011/012 的禁语和反例设计，不释放现代人格结论。

### T05｜枭印夺食

可用于提醒：必须证明食神是关键输出、偏印有效且没有财制/替代输出；疾病、子嗣、福气断语全部排除。它支持 013 的排除条件，不证明“内审部门”机制真实。

### T06｜官杀混杂

可用于提醒：官杀同现不等于混杂，必须两端有效且无解；婚恋、贞洁、贵贱和人格低等推断全部排除。它支持 020 的价值清理，不替代 019/020/038 的操作定义。

## 5. 本批需要的页码登记项

| Priority | Source | 需定位主题 | 需分层内容 |
|---|---|---|---|
| P1 | SR-006 | 印食关系、官杀单清/混杂、成败救应 | 原文 vs 后世评注 |
| P1 | SR-009 | 枭食条件、食伤功能、比劫与约束材料 | 原典卷文 vs 现代事件化解释 |
| P1 | SR-007 | 官杀混杂、制化、流通与两端力量 | 古诀、原注、任氏评注 |
| P2 | SR-005 | 印、食伤、比劫的传统功能与显隐 | 版本异文、卷章、页码 |
| P2 | SR-008 | 官杀总述、制化与承接 | 正文、卷次、OCR 校勘 |
| P3 | SR-013 | 近代强弱、印食与反例整理 | 明确标记为近代整理 |

每条登记仍须使用：

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

## 6. 不可越界的引用方式

合格：

> 某正式版本在讨论印食或官杀关系时同时列出承接、制化与反例；命格译码据此提出一个仍待验证的输入—输出或约束处理假设。

不合格：

> 古籍证明印旺的人更会学习，食伤旺的人更会表达，比劫官杀平衡的人更会合作。

## 7. Batch 02 来源门判断

```text
formal_editions_selected: no
page_register_complete: no
original_commentary_layers_separated: no
translation_samples_used_as_primary_proof: no
modern_behavior_hypotheses_validated: no
core_release_allowed: no
modifier_process_tests_allowed: yes
pending_source_anchor_candidates: MC-R-012, MC-R-014, MC-R-018
```
