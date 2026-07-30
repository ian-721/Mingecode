# CRX-0.6｜四份报告十声明单元映射

**状态：** F0 Audit / Not Human-Tested  
**规则：** `traceable_candidate` 仅表示能回指候选机制，不表示来源或现代行为已验证；`advice_only` 不计人格证据。

## R01｜输入先行

| Claim | 摘要 | 类型 | Rule / gate | 状态 | 反向条件 |
|---|---|---|---|---|---|
| R01-C01 | 先确认背景、限制和关键概念 | neutral | 011/012 | traceable_candidate | 信息少时仍直接定稿 |
| R01-C02 | 关键信息不足时暂缓结论 | neutral | 011 | modifier_only | 无论资料多少都立即表态 |
| R01-C03 | 输入与输出有效时形成可回应版本 | resource | 012 | traceable_candidate | 只收集而不形成版本 |
| R01-C04 | 保留上下文且不只停在收集 | resource | 012 | traceable_candidate | 输出与输入没有连续关系 |
| R01-C05 | 输入持续增加会推迟交付 | cost | 011/015 | modifier_only | 有固定首版门且能按时输出 |
| R01-C06 | 把暂定版视为不够负责 | cost | Mingecode hypothesis | unsupported_for_F1 | 能轻松区分草案与定稿 |
| R01-C07 | 延迟表态可能被误解为无意见 | misunderstanding | 011 | modifier_only | 实际确实没有形成判断 |
| R01-C08 | 区分参与判断的信息与噪声 | neutral | 012 | traceable_candidate | 不做筛选即输出 |
| R01-C09 | 材料充足时更易形成结构版 | condition | 012 + time gate | traceable_candidate | 高压、缺背景时仍同样运行 |
| R01-C10 | 设置最低输入条件和首版截止点 | advice | advice_only | advice_only | 不作为人格证据 |

### R01 决定

`R01-C06` 目前没有独立规则依据，F1 前必须删除、改为建议，或找到不重复的对象机制。

## R02｜公开成稿

| Claim | 摘要 | 类型 | Rule / gate | 状态 | 反向条件 |
|---|---|---|---|---|---|
| R02-C01 | 判断形成后转成文字、样例或反馈 | neutral | 014 | traceable_candidate | 长期只在内部加工 |
| R02-C02 | 让内容进入可观察、可回应状态 | resource | 014 | traceable_candidate | 输出不可见或无承接 |
| R02-C03 | 抽象讨论变成具体对象 | resource | 014 | traceable_candidate | 仍停留在口头模糊共识 |
| R02-C04 | 通过版本接受具体修改 | resource | 014/024 | traceable_candidate | 版本只用于宣告而非回应 |
| R02-C05 | 可见但无承接时难持续补全 | cost | 009 | modifier_only | 输出有根且持续承接 |
| R02-C06 | 可见不等于稳定能力 | limit | 009 | guard | 不适用：014完整成立 |
| R02-C07 | 通过外部对象检验是否说清 | neutral | 014 | hypothesis_candidate | 不需要外部反馈也能完成判断 |
| R02-C08 | 说明、展示、反馈场景更易触发 | condition | 014 | traceable_candidate | 完全私密任务仍同样外化 |
| R02-C09 | 私密且无需回应时可能不触发 | limit | 015/010 | modifier_only | 输出无论情境都公开稳定 |
| R02-C10 | 标记草案/待确认/最终版 | advice | advice_only | advice_only | 不作为人格证据 |

### R02 决定

R02具备最完整的单一机制追踪，但仍只来自 `CL-INPUT-OUTPUT`。在获得簇外支持前不能成为核心报告。

## R03｜权限协商

| Claim | 摘要 | 类型 | Rule / gate | 状态 | 反向条件 |
|---|---|---|---|---|---|
| R03-C01 | 进入合作前确认自决事项 | neutral | 018 | traceable_candidate | 权责模糊时也不需确认 |
| R03-C02 | 区分共同标准与角色责任 | neutral | 018/019 | traceable_candidate | 不区分标准来源即可执行 |
| R03-C03 | 保留判断同时接受共同约束 | resource | 018 | traceable_candidate | 只能完全服从或完全拒绝 |
| R03-C04 | 不在服从/拒绝之间二选一 | resource | 018 | traceable_candidate | 两端无法同时有效 |
| R03-C05 | 多套标准无主次时反复比较 | cost | 020 | traceable_candidate | 038有效解决并形成主次 |
| R03-C06 | 迟疑承诺或反复确认决定权 | cost | 020 + Mingecode hypothesis | partial_trace | 能稳定选主标准并执行 |
| R03-C07 | 澄清可能被理解成难合作 | misunderstanding | 018 | modifier_only | 澄清实际用于回避责任 |
| R03-C08 | 区分建议、授权与最终责任 | neutral | 018/019/027 | composite_candidate | 三者在场景中本就一致 |
| R03-C09 | 职责稳定时更易协作 | condition | 018/038 | traceable_candidate | 角色变化时仍不需重谈 |
| R03-C10 | 写出不可协商、可协商和重评条件 | advice | advice_only | advice_only | 不作为人格证据 |

### R03 决定

R03可保留为M-B主报告候选；C06、C08仍需避免将多个相关约束事实拆成多份证据。

## R04｜完成承诺

| Claim | 摘要 | 类型 | Rule / gate | 状态 | 反向条件 |
|---|---|---|---|---|---|
| R04-C01 | 寻找明确完成对象 | neutral | 026 | traceable_candidate | 输出后不关心接收对象 |
| R04-C02 | 确认接收方、完成标准和后续责任 | neutral | 026/027 | traceable_candidate | 只进行一次性输出 |
| R04-C03 | 把版本推进成可使用成果 | resource | 026 | traceable_candidate | 表达后停止，不进入完成接口 |
| R04-C04 | 明确下一步承接与持续标准 | resource | 027 | traceable_candidate | 结果不形成后续承诺 |
| R04-C05 | 结果出现后增加更多义务 | cost | 027 | hypothesis_candidate | 能把成果与责任扩张分开 |
| R04-C06 | 一次性交付延长成持续承诺 | cost | 027 | hypothesis_candidate | 明确拒绝后续接口 |
| R04-C07 | 追问完成边界可能被误解为只看结果 | misunderstanding | 026/027 | modifier_only | 实际只在意结果而忽略接口 |
| R04-C08 | 目标与接收方明确时更易触发 | condition | 026/027 | traceable_candidate | 无完成对象时也强行收口 |
| R04-C09 | 纯探索或责任不清时暂缓完成 | limit | 026/027 reverse | traceable_candidate | 开放阶段仍持续强行定稿 |
| R04-C10 | 分开本轮完成与后续承诺 | advice | advice_only | advice_only | 不作为人格证据 |

### R04 决定

R04的C05/C06属于规则到行为的候选推论，不可被包装成责任感或可靠性；来源与反例门关闭前仍为F0。

## 辅助特质 S-01

```text
claim: 主动澄清不同角色之间缺失的接口
required: 至少两个不重复主机制
rule_candidates: 018 + one_of(024,027,028)
new_evidence_contribution: 0
status: secondary_composite_only
```

## 总计

```text
reports: 4
claim_units: 40
traceable_or_modifier_units: 31
advice_units: 4
unsupported_or_partial_units_requiring_revision: 5
reports_ready_for_F1: 0
```

F1前必须重点处理：R01-C06、R02-C07、R03-C06、R04-C05、R04-C06。
