# M1-B 规则级抽象夹具｜Batch 02：MC-R-011—MC-R-020

**夹具版本：** `RF-B02-0.1.0`  
**合同：** `RULE_DEFINITION_CONTRACT_v1.1-draft.md`  
**性质：** 虚构结构事实 / Process Test Only / Not Human-Tested  
**禁止：** 不对应真人生日、经历或反馈；不得描述为准确案例

## 1. 夹具口径

每条规则固定六类：Positive、Near miss、Exclusion、Counterevidence、Boundary、Family duplicate。`expected_trigger` 只表示材料流程应如何响应，不证明传统关系或现代机制有效。

## MC-R-011｜印有根透出且输出弱

| Fixture ID | 类型 | 抽象结构事实 | 预期裁决 |
|---|---|---|---|
| B02-R011-P | Positive | 有效输入路径到身；逐项检查后无有根透出、连续链或替代输出；时间稳定 | `conditional modifier`; 只记录 input-before-output 候选 |
| B02-R011-N | Near miss | 输入有效，但存在一条少量却连续到达外部的输出链 | 不触发 011；转审 012/014 |
| B02-R011-X | Exclusion | 印被有效财制完整关闭，或严格特殊结构候选 | 关闭规则 |
| B02-R011-C | Counterevidence | 输出路径有效且公开，实际不存在“输出弱” | 关闭 011；不得写延迟表达 |
| B02-R011-B | Boundary | 关键输入根位于不稳定时支，候选盘中一盘失效 | `sensitivity_only`; 主材料不触发 |
| B02-R011-D | Family duplicate | 013 已确认关键输出被直接过滤 | 013 具体状态优先；011 不重复计入 |

## MC-R-012｜印食并存且不直接冲突

| Fixture ID | 类型 | 抽象结构事实 | 预期裁决 |
|---|---|---|---|
| B02-R012-P | Positive | 有效输入→日主承接→有效输出连续；无完全过滤；时间稳定 | `pending_source anchor candidate` |
| B02-R012-N | Near miss | 输入与输出均存在，但中间承接节点无效 | 不触发；元素齐全不等于链成立 |
| B02-R012-X | Exclusion | 013 的关键输出过滤条件完整，或财破印使输入链断 | 关闭 012 |
| B02-R012-C | Counterevidence | 输入与输出同场景直接相战，无法形成连续路由 | `unresolved`; 不生成整合声明 |
| B02-R012-B | Boundary | 输出根随时辰候选变化，部分候选盘链断 | 只进敏感性附录 |
| B02-R012-D | Family duplicate | 014 使用同一食伤节点作为公开输出证据 | `CL-INPUT-OUTPUT` 正向贡献最多 1；014仅补显隐说明 |

## MC-R-013｜偏印有效制食

| Fixture ID | 类型 | 抽象结构事实 | 预期裁决 |
|---|---|---|---|
| B02-R013-P | Positive | 偏印和关键食神均有效；直接作用成立；无替代输出、无财制印、偏印非必要扶身 | 定义流程可命中，但保持 `pending_definition`，不释放报告 |
| B02-R013-N | Near miss | 偏印与食神同现，但位置/链路不足以发生直接作用 | 不触发 |
| B02-R013-X | Exclusion | 另有独立伤官出口，或偏印承担必要支持，或财有效制印 | 关闭 013 |
| B02-R013-C | Counterevidence | 食神有多个独立根且输出仍稳定可达 | 降级/关闭；不能写强过滤 |
| B02-R013-B | Boundary | 关键食神只在边界时支存在 | 敏感性；主材料不触发 |
| B02-R013-D | Family duplicate | 011 同时描述一般输出弱 | 013 若最终成立则覆盖 011；家族只计 1 |

## MC-R-014｜食伤有根透出且容量足

| Fixture ID | 类型 | 抽象结构事实 | 预期裁决 |
|---|---|---|---|
| B02-R014-P | Positive | 食伤有有效根并透出；承载 gate 通过；未被制尽；时间稳定 | `pending_source anchor candidate`; 只表示公开输出通道 |
| B02-R014-N | Near miss | 食伤透出但无根、无后续承接 | 不触发 014；交由 009 限制 |
| B02-R014-X | Exclusion | 输出被有效制尽，或承载不足且特殊结构未排除 | 关闭/阻塞 |
| B02-R014-C | Counterevidence | 关键输出受到 013 式直接过滤，实际不可达 | 关闭 014 的稳定输出声明 |
| B02-R014-B | Boundary | 唯一输出根位于不稳定时支 | 只进敏感性附录 |
| B02-R014-D | Family duplicate | 012 已用同一输出链支持输入输出整合 | 相关簇最多 1 份正向贡献；不得再加 D3 |

## MC-R-015｜食伤藏而不透

| Fixture ID | 类型 | 抽象结构事实 | 预期裁决 |
|---|---|---|---|
| B02-R015-P | Positive | 输出候选有效藏存；无透、无已审查引动；日主可生；时间稳定 | `modifier`; 只记 latent/conditional，不自动生成行为 |
| B02-R015-N | Near miss | 仅有名义藏干，已被完整关闭或日主无法形成输出路径 | 不触发 |
| B02-R015-X | Exclusion | 合会、透出或连续链已使输出公开有效 | 关闭 015；转审 014 |
| B02-R015-C | Counterevidence | 010 的无透无引条件完整，且无可定位激活情境 | 采用 010 更严格守门：不进入报告 |
| B02-R015-B | Boundary | 藏干只在不稳定时支候选中存在 | 敏感性；主材料不触发 |
| B02-R015-D | Family duplicate | 005 已对同一功能给出一般“藏而不透” | 只保留更具体输出显隐说明，不计第二家族 |

## MC-R-016｜输出负荷超过承载

| Fixture ID | 类型 | 抽象结构事实 | 预期裁决 |
|---|---|---|---|
| B02-R016-P | Positive | 输出持续有效；容量/恢复不足候选；无财链收口、无比印补充；特殊结构已排除 | 流程命中负荷守门，但仍 `pending_definition` |
| B02-R016-N | Near miss | 输出有效，但有稳定恢复或收口路径 | 不触发过载 |
| B02-R016-X | Exclusion | 严格从儿/从食伤候选未完成排除，或输出只是一时出现 | 阻塞，不作主裁决 |
| B02-R016-C | Counterevidence | 多轮抽象状态显示输出后恢复稳定且容量 gate 充足 | 关闭 016 |
| B02-R016-B | Boundary | 容量根或输出节点随时辰候选变化 | 敏感性；若核心节律改变则退出主样本 |
| B02-R016-D | Family duplicate | 014 同时确认输出通道存在 | 014保留 1 份正向证据；016仅作负向守门 |

## MC-R-017｜比劫有根且外部约束弱

| Fixture ID | 类型 | 抽象结构事实 | 预期裁决 |
|---|---|---|---|
| B02-R017-P | Positive | 自我参照事实有效；完整检查官杀及隐藏路径后约束弱；无资源竞争改写 | 流程候选，但保持 `pending_definition` |
| B02-R017-N | Near miss | 比劫只是数量出现，根与承载无效 | 不触发 |
| B02-R017-X | Exclusion | 官杀有根且有有效承接，形成双向作用 | 关闭 017；转审 018/019 |
| B02-R017-C | Counterevidence | 财负荷使比劫主要表现为资源竞争 | 关闭/转交后续 030；不得写内定标 |
| B02-R017-B | Boundary | 比劫唯一有效根位于不稳定时支 | 敏感性；主材料不触发 |
| B02-R017-D | Family duplicate | 001/002/006 已使用相同根气作为容量背景 | 容量只作 gate，不得再算第二份 D1 证据 |

## MC-R-018｜比劫与官杀双向有效

| Fixture ID | 类型 | 抽象结构事实 | 预期裁决 |
|---|---|---|---|
| B02-R018-P | Positive | 自我参照与外部约束均有效；中介路径成立；无混杂失序或直接相战 | `pending_source anchor candidate` |
| B02-R018-N | Near miss | 两端名义同现，但一方虚浮或不能作用 | 不触发 |
| B02-R018-X | Exclusion | 比劫被制尽、官杀混杂无解，或同场景直接冲突无中介 | 关闭 018 |
| B02-R018-C | Counterevidence | 结构只允许一方长期主导，所谓“双向”来自数量相近 | 不触发；平衡不能按数量判断 |
| B02-R018-B | Boundary | 一端有效性依赖时支边界 | 敏感性；核心变化则退出主样本 |
| B02-R018-D | Family duplicate | 019 使用同一官杀路径说明约束整合 | 受 `CL-REFERENCE-CONSTRAINT` 上限；不能仅凭 018+019 定核心 |

## MC-R-019｜单清官杀且有承接

| Fixture ID | 类型 | 抽象结构事实 | 预期裁决 |
|---|---|---|---|
| B02-R019-P | Positive | 官或杀一类有效主导；另一端无效/从属；有印、食制或容量承接 | `modifier`; 记录 single_integrated |
| B02-R019-N | Near miss | 官杀透出但无根、无承接，只是可见标签 | 不触发 |
| B02-R019-X | Exclusion | 两类官杀均有效且无主次，或约束过重无制 | 关闭 019；转审 020 |
| B02-R019-C | Counterevidence | 约束只能形成压力，不能转成职责/行动链 | 不释放“运行框架”声明 |
| B02-R019-B | Boundary | 主导约束的根位于不稳定时支 | 敏感性；主材料不触发 |
| B02-R019-D | Family duplicate | 018 已使用同一官杀路径参与可谈判边界 | 依赖簇默认只计 1 份正向贡献 |

## MC-R-020｜官杀混杂且无解

| Fixture ID | 类型 | 抽象结构事实 | 预期裁决 |
|---|---|---|---|
| B02-R020-P | Positive | 官与杀分别有效、都作用、无主次；解决白名单逐项不成立；时间稳定 | 流程候选，但保持 `pending_definition` |
| B02-R020-N | Near miss | 官杀同现，但一方虚浮或只为残余 | 不触发混杂 |
| B02-R020-X | Exclusion | 有效食制、印化、合留、从一方或明确主次存在 | 关闭 020；转审 038/其他解决规则 |
| B02-R020-C | Counterevidence | 两套标准分别作用于不同情境，实际并不冲突 | 输出情境分化，不写“持续冲突” |
| B02-R020-B | Boundary | 一端只在不稳定时支或节气候选中有效 | 敏感性；不得进入反向槽 |
| B02-R020-D | Family duplicate | 多处官杀信号重复出现，但仍是同一未解决约束簇 | 只计 1 个 `EF-CONSTRAINT-PROCESSING` 反向候选 |

## 2. 夹具统计

```text
rules_covered: 10
fixtures_per_rule: 6
fixtures_total: 60
real_person_records: 0
human_feedback_records: 0
core_rules_validated: 0
```

## 3. 当前 dry-run 结论

- 60 个夹具均能映射到预先规定的触发、关闭、敏感性或去重动作；
- `MC-R-013`、`016`、`017`、`020` 的 Positive 夹具只能证明待定义流程入口，不能释放报告；
- `MC-R-012`、`014`、`018` 的 Positive 夹具只形成来源待关闭的锚点候选；
- 任何夹具都不能替代正式版本校勘、真人盲测或现代行为验证。
