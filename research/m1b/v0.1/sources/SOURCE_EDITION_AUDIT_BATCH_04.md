# 来源版本审计｜Batch 04：MC-R-031—MC-R-040

**版本：** `SEA-B04-0.1.0`  
**状态：** Pending Edition Verification  
**范围：** SR-005、SR-006、SR-007、SR-008、SR-014 及其对 MC-R-031—040 的支持边界

## 1. 审计结论

本批传统材料可支持：合、冲、刑、害、透藏、官杀主次与制化、流通、从象等术语和条件化关系确实存在于传统解释系统中。它们不能直接证明现代人的合作能力、探索倾向、公私差异、内耗、隐性不匹配、复杂规范处理、持续做成事或环境适配。

本批风险高于前三批，原因是：

1. 031—036 大量依赖关系标签，容易把名义关系直接人格化；
2. SR-014 是近代整理并转引古籍，不能单独承担原典证明；
3. SR-007 混合古诀、原注与任氏评注，必须分层；
4. 040 的从格判定流派分歧和边界敏感性都很高；
5. 039 是项目综合门，不是传统文本直接给出的现代人格规则。

因此：

- 031—036、040 只进入敏感性或历史附录；
- 037 只作为显隐组合修饰；
- 038、039 只标记 `pending_source`；
- 035、036、040继续执行核心硬排除；
- 本批不能产生 `eligible_core`；
- 007、020虽关闭定义门，仍转入 `pending_source`，不能进入报告。

## 2. 来源对象状态

| Source ID | 登记对象 | Batch 04 可支持 | 当前不能支持 | 门状态 |
|---|---|---|---|---|
| SR-005 | 《渊海子平》数字定位文本 | 十神、透藏、从象及传统结构术语 | 公私人格、环境适配、统一从格判据；正式版本页码 | `edition_and_page_pending` |
| SR-006 | 《子平真诠评注》数字定位文本 | 月令、成败救应、官杀主次、流通需条件 | 把原文与民国评注合并；复杂规范处理或持续能力 | `edition_and_layer_pending` |
| SR-007 | 《滴天髓阐微》数字定位文本 | 冲的强弱结果、官杀可混/不可混、流通制化 | 把古诀/原注/任评合一；合冲刑害人格效度 | `edition_and_layer_pending` |
| SR-008 | 《三命通会》卷五数字定位文本 | 生克制化及刑冲破害等传统关系语言 | 害的现代机制、疾病灾祸、行为因果；OCR页码 | `page_pending` |
| SR-014 | 《命理探源》卷五数字定位文本 | 近代对合化、刑冲及古籍引文的整理 | 独立原典、统一合化判据、现代人格证据 | `transmission_and_page_pending` |

## 3. Rule → Source 追踪

| Rule ID | Source IDs | 当前可支持的传统关系 | 现代机制仍属项目假设 | 来源关闭前层级 |
|---|---|---|---|---|
| 031 | SR-007、SR-014 | 合化需得时得势、不能逢合即化 | 不同功能形成稳定协同接口 | sensitivity_only |
| 032 | SR-007、SR-014 | 合而不化、争合/牵制的流派线索 | 接口占用、责任未转化或决定延迟 | sensitivity_only |
| 033 | SR-007 | 冲的结果受两端力量与合解影响 | 重组、切换、探索启动 | sensitivity_only |
| 034 | SR-007 | 强弱悬殊时弱端可能受损/被拔 | 关键支持点在压力下被覆盖 | sensitivity_only |
| 035 | SR-007、SR-014 | 刑关系和重复条件的传统讨论 | 反复校验、内耗或处理成本 | sensitivity_only / core hard-excluded |
| 036 | SR-008、SR-014 | 害作为传统关系标签 | 隐性不匹配或需求消耗 | sensitivity_only / core hard-excluded |
| 037 | SR-005、SR-006 | 透藏显隐及功能需结合承接 | 公共动作与内部加工偏好不同 | modifier only |
| 038 | SR-007、SR-006 | 官杀同现有可混不可混，合留制化可形成主次 | 多套标准中稳定选择主轴 | pending_source |
| 039 | SR-007、SR-006 | 旺衰不能离开流通、制化和出口 | 容量开放、可持续完成或可靠性 | pending_source / composite gate |
| 040 | SR-005、SR-006 | 从象有严格纯势、无根助等条件传统 | 高度环境适配及环境变化风险 | sensitivity_only / core hard-excluded |

## 4. 争议日志边界

### DL-016｜合与合化

只支持以下治理判断：

- 见合不等于好；
- 见合不等于化；
- 合化需要条件；
- 合而不化与争合存在流派差异。

它不能证明031的“协同能力”或032的“决定延迟”。因此031/032不进入核心或用户报告。

### DL-005｜冲

只支持“冲的结果要看强弱与合解”，不能支持“冲的人爱动、爱变、爱探索”。033/034只保留对象稳定性状态。

### DL-017｜刑害

争议日志已认定现代行为映射证据弱。035、036继续核心硬排除，且本轮进一步取消用户声明释放。

### DL-009｜官杀混杂

可以支持020/038必须区分未解决与已解决，不能证明“复杂规范处理能力”。解决白名单是项目操作合同，不是传统共识。

### DL-004｜旺衰与流通

可以支持039不能只看身旺，仍不能证明“高能力、可靠、可持续做成事”。039只是跨簇综合门。

### DL-018｜从格

可以支持从象判定严格、破格条件重要和流派争议大；不能支持现代环境适配。040保持首轮核心硬排除。

## 5. 翻译样带边界

### T10｜从格

T10只用于删除真从必贵、破格必败、必须顺从等等级与宿命表达，并提醒环境适配是假设。它不能释放040进入首轮裁决。

Batch 04 没有为031—039新增可替代正式校勘的翻译样带；不得拿栏目文案或现代解释反向证明规则。

## 6. 页码与版本登记优先级

| Priority | Source | 需定位主题 | 必须分层 |
|---|---|---|---|
| P1 | SR-007 | 冲的强弱、官杀可混/不可混、合留制化、流通 | 古诀、原注、任氏评注 |
| P1 | SR-006 | 官杀主次、成败救应、流通与从象相关段落 | 沈氏原文 vs 民国评注 |
| P1 | SR-014 | 合化、争合、刑冲害及全部转引出处 | 袁氏整理 vs 被引原典 |
| P2 | SR-005 | 透藏、从象与严格破格条件 | 版本异文、卷章、页码 |
| P2 | SR-008 | 刑冲破害及生克制化总述 | 正文、卷次、OCR校勘 |

每条登记沿用：

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

## 7. 不可越界的引用

合格：

> 某传统版本在讨论冲、官杀混杂或从象时列出了强弱、制化、主次和破格条件；命格译码据此建立一个仍待验证、且不直接进入核心的人格材料状态。

不合格：

> 古籍证明六合的人会合作、相冲的人爱变化、刑多的人内耗、官杀有解的人会管理、从格的人适应力强。

## 8. Batch 04 来源门判断

```text
formal_editions_selected: no
page_register_complete: no
original_commentary_layers_separated: no
sr014_transmissions_traced: no
relationship_behavior_mapping_validated: no
core_release_allowed: no
modifier_process_tests_allowed: MC-R-037 only
pending_source_candidates: MC-R-038, MC-R-039
retro_pending_source: MC-R-007, MC-R-020
core_hard_excluded: MC-R-035, MC-R-036, MC-R-040
```
