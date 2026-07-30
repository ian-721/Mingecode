# CRX-0.7｜四份报告十声明单元映射 v0.7

**对象：** `REPORT_MASTER_REBUILD_v0.7.md`  
**状态：** F0.7 Traceability Pass / Not Human-Tested  
**规则：** `traceable_candidate` 仅表示可回指候选机制；不表示来源关闭或现代行为已验证。`advice_only` 不计人格证据。

## R01｜输入先行

| Claim | 摘要 | 类型 | Rule / gate | 状态 | 反向条件 |
|---|---|---|---|---|---|
| R01-C01 | 先确认背景、限制和关键概念 | neutral | 011/012 | `traceable_candidate` | 信息少时仍直接定稿 |
| R01-C02 | 关键信息不足时暂缓结论 | neutral | 011 | `modifier_only` | 无论资料多少都立即表态 |
| R01-C03 | 输入与输出有效时形成可回应版本 | resource | 012 | `traceable_candidate` | 只收集而不形成版本 |
| R01-C04 | 保留必要上下文且不只停在收集 | resource | 012 | `traceable_candidate` | 输出与输入没有连续关系 |
| R01-C05 | 输出弱或被过滤时继续补材料、首版延后 | cost | 011/013/015 | `traceable_reverse_or_modifier` | 输出路线有效且有首版门 |
| R01-C06 | 延迟表态可能被误解为无意见 | misunderstanding | 011 | `modifier_only` | 实际确实没有形成判断 |
| R01-C07 | 区分参与判断的信息与环境噪声 | neutral | 012 route gate | `traceable_candidate` | 不做筛选即输出 |
| R01-C08 | 材料充足时更易形成结构版 | condition | 012 + time gate | `traceable_candidate` | 高压缺背景时仍同样运行 |
| R01-C09 | 立即回答或缺背景会打断顺序 | limit | time/context gate | `gate_only` | 信息很少时也能稳定定稿 |
| R01-C10 | 设最低输入条件与首版截止点 | advice | advice only | `advice_only` | 不作为人格证据 |

## R02｜公开成稿

| Claim | 摘要 | 类型 | Rule / gate | 状态 | 反向条件 |
|---|---|---|---|---|---|
| R02-C01 | 判断成形后转成文字、样例、作品或反馈 | neutral | 014 | `traceable_candidate` | 长期只在内部加工 |
| R02-C02 | 让内容进入可观察、可回应状态 | resource | 014 | `traceable_candidate` | 输出不可见或无承接 |
| R02-C03 | 抽象讨论变成可指认对象 | resource | 014 | `traceable_candidate` | 仍停留在模糊共识 |
| R02-C04 | 他人可回应观点、形式或执行条件 | neutral | 014/024 | `traceable_candidate` | 版本只用于宣告，不接受回应 |
| R02-C05 | 可见但无承接时难持续补全 | cost | 009 | `modifier_only` | 输出有根且持续承接 |
| R02-C06 | 可见不等于稳定能力 | limit | 009 | `guard_only` | 014完整成立 |
| R02-C07 | 先把已成形判断放到外部再修订 | neutral | 014 | `traceable_candidate` | 不形成外部对象也能完成同一流程 |
| R02-C08 | 说明、展示或回应场景更易触发 | condition | 014 | `traceable_candidate` | 私密任务仍同样外化 |
| R02-C09 | 私密且无需回应时可能不触发 | limit | 010/015 | `modifier_only` | 输出无论情境都公开稳定 |
| R02-C10 | 标记草案、待确认与最终版 | advice | advice only | `advice_only` | 不作为人格证据 |

## R03｜权限协商

| Claim | 摘要 | 类型 | Rule / gate | 状态 | 反向条件 |
|---|---|---|---|---|---|
| R03-C01 | 进入合作前确认自决事项 | neutral | 018 | `traceable_candidate` | 权责模糊时也不需确认 |
| R03-C02 | 区分共同标准与角色责任 | neutral | 018/019 | `traceable_candidate` | 不区分标准来源即可执行 |
| R03-C03 | 保留判断同时接受共同约束 | resource | 018 | `traceable_candidate` | 只能完全服从或完全拒绝 |
| R03-C04 | 不在服从与拒绝间二选一 | resource | 018 | `traceable_candidate` | 两端无法同时有效 |
| R03-C05 | 多套标准无主次时按不同口径来回处理 | cost | 020 | `traceable_reverse_candidate` | 038有效形成主次 |
| R03-C06 | 主次形成后应关闭未解决状态 | limit/reverse | 038 | `state_gate` | 两端仍同对象争夺主导 |
| R03-C07 | 澄清可能被误解为难合作 | misunderstanding | 018 | `modifier_only` | 澄清实际用于回避责任 |
| R03-C08 | 接受共同目标不等于决定角色相同 | neutral | 018/019/027 | `composite_candidate` | 场景中建议、授权与责任本就一致 |
| R03-C09 | 职责稳定时更易协作，角色变化时重谈 | condition | 018/038 | `traceable_candidate` | 权责模糊时也很少澄清 |
| R03-C10 | 写出不可协商、可协商和重评条件 | advice | advice only | `advice_only` | 不作为人格证据 |

## R04｜完成承诺

| Claim | 摘要 | 类型 | Rule / gate | 状态 | 反向条件 |
|---|---|---|---|---|---|
| R04-C01 | 寻找明确完成对象 | neutral | 026 | `traceable_candidate` | 输出后不关心接收对象 |
| R04-C02 | 确认接收方、完成标准和后续责任 | neutral | 026/027 | `traceable_candidate` | 只进行一次性输出 |
| R04-C03 | 把版本推进成可使用成果 | resource | 026 | `traceable_candidate` | 表达后停止，不进入完成接口 |
| R04-C04 | 明确下一步承接与持续标准 | resource | 027 | `traceable_candidate` | 结果不形成后续责任接口 |
| R04-C05 | 缺接收对象或标准时停在可见、未完成状态 | cost | 026 reverse | `traceable_reverse_candidate` | 明确完成对象已成立 |
| R04-C06 | 责任主次不清时后续承诺不自动成立 | limit | 027 + 020/038 gate | `traceable_state_gate` | 主标准与承接角色已明确 |
| R04-C07 | 追问完成边界可能被误解为只看结果 | misunderstanding | 026/027 | `modifier_only` | 实际只在意结果而忽略接口 |
| R04-C08 | 需要知道成果如何接收、责任何时结束 | neutral | 026/027 | `traceable_candidate` | 完成后不区分责任边界 |
| R04-C09 | 目标与接收方明确时触发；纯探索时不宜早收口 | condition/limit | 026/027 gate | `traceable_candidate` | 无完成对象时仍强行定稿 |
| R04-C10 | 分开本轮完成与后续承诺 | advice | advice only | `advice_only` | 不作为人格证据 |

## 辅助特质 S-01

```text
claim: 澄清不同角色之间缺失的接口
required: 至少两个不重复主机制
rule_candidates: 018 + one_of(024,027,028)
new_evidence_contribution: 0
status: secondary_composite_only
```

## 总计

```text
reports: 4
claim_units: 40
traceable_or_modifier_or_gate_units: 36
advice_units: 4
unsupported_or_partial_units: 0
selected_source_page_gate_closed: no
independent_masked_review_completed: no
reports_ready_for_F1: 0
```

声明追踪门已从 v0.6 的5个待修项推进为0个未映射项；但所有机制仍是候选，且来源页码与独立遮名审查未完成，因此不能锁定为真人材料。
