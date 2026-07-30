# CRX-0.7｜关键互斥与覆盖回归

**状态：** Definition Regression Pass / Not Human-Tested  
**范围：** `MC-R-012`、`013`、`014`；`MC-R-019`、`020`、`038`  
**说明：** 本文件只验证定义逻辑能否得到唯一、可追溯状态，不验证现代人格效度

## 1. 输入—输出三规则回归

### 1.1 对象状态

| State | 主规则 | 必要状态 | 报告作用 |
|---|---|---|---|
| `integrated_input_output` | 012 | 输入路径经日主承接后到达有效输出 | M-A1候选 |
| `key_output_filtered` | 013 | 关键食神输出被同对象偏印路径直接关闭，无替代出口/财解/必要扶身排除 | 反向候选；关闭同对象012/014 |
| `public_supported_output` | 014 | 输出有根、可达、公开且未被关闭 | M-A2候选；与012同簇上限 |
| `visible_unsustained` | 009 | 公开可见但无根或无承接 | 关闭014的稳定输出解释 |
| `latent_or_hidden` | 010/015 | 只在藏层或无引动 | 只作显隐守门，不生成公开输出 |

### 1.2 固定互斥

```text
012 integrated ↔ 013 key_output_filtered
013 key_output_filtered ↔ 014 public_supported（同一关键输出对象）
014 public_supported ↔ 015 latent_conditional（同一功能）
014 public_supported ↔ 009 visible_unsustained（同一功能）
```

### 1.3 允许共存但必须去重

```text
012 + 014
= 1份 CL-INPUT-OUTPUT 正向贡献
+ 1项公开显隐说明
≠ 2个独立人格家族
```

若012使用的输出端与014不是同一功能，必须在对象登记中明确不同 `function_object_id`；否则默认相关，不拆分计数。

### 1.4 回归用例

| Case | 输入条件 | 预期状态 | 禁止结果 |
|---|---|---|---|
| IO-01 | 输入连续到输出，输出公开有承接 | 012 + 014；簇贡献上限1 | 写成“既深度吸收又表达天赋”两份证据 |
| IO-02 | 输入连续到输出，但输出只在藏层稳定 | 012 + 015 | 同时释放公开输出 |
| IO-03 | 关键食神输出被同对象偏印直接关闭，无替代出口 | 013；关闭012/014同对象 | 既写顺畅整合又写强过滤 |
| IO-04 | 偏印出现，但食神非关键且有独立替代输出 | 013不触发；按替代输出重新审查012/014 | 见偏印食神即触发过滤 |
| IO-05 | 过滤与输出作用于不同对象 | 013不触发同对象互斥 | 把不同情境合并成全局过滤 |
| IO-06 | 输出透出但无根、无承接 | 009；关闭014 | 可见意向写成稳定能力 |
| IO-07 | 输出公开有承接，但输入路线不存在 | 014可成立，012不成立 | 用公开输出反推深度吸收 |
| IO-08 | 输入有效但完整扫描后输出弱 | 011修饰；012/014不成立 | 把输入偏置写成学习力或敏感度 |

### 1.5 回归结论

```text
same_object_exclusivity: pass
alternative_output_exception: pass
visibility_override: pass
cluster_cap: pass
report_release_logic: pass_as_definition
modern_behavior_validation: no
```

## 2. 约束混合三态回归

### 2.1 三态定义

| State | 主规则 | 判据 | 报告作用 |
|---|---|---|---|
| `single_integrated` | 019 | 一类约束主导，另一端不存在、虚浮或明确从属，有承接 | 修饰，不独立成核心 |
| `mixed_unresolved` | 020 | 官杀两端均有效、作用同一对象、无主次且无解决路径 | M-B1反向状态候选 |
| `mixed_resolved` | 038 | 原本两端有效，经有效合留、直接制化、稳定从属或对象分离形成可审查结果 | M-B1解决状态候选 |

### 2.2 解决白名单

只有以下状态可以关闭同对象020：

```text
effective_retention
一端被有效合留，另一端形成稳定主导

direct_control
食制、印化或其他已审查路径直接处理其中一端

stable_subordination
一端仍存在但稳定从属于主导标准

scope_separation
两端实际作用于不同对象或情境；只关闭全局混杂，不增加正向证据
```

### 2.3 回归用例

| Case | 输入条件 | 预期状态 | 禁止结果 |
|---|---|---|---|
| RC-01 | 仅一类约束有效并有承接 | 019 | 同时触发020/038 |
| RC-02 | 两端有效、同对象、无主次、无解 | 020 | 因“看起来平衡”改判038 |
| RC-03 | 两端有效，同对象，有稳定合留/制化 | 038；关闭020 | 已解决与未解决并存 |
| RC-04 | 两端分属不同对象 | 关闭020；记录scope separation，不增加038正向证据 | 把情境分离写成成熟整合能力 |
| RC-05 | 解决只在岁运或边界候选中出现 | sensitivity only；020/038均不释放 | 用临时时间状态定义核心人格 |
| RC-06 | 名义有制化但路径无效或无承接 | 020仍可能成立 | 名义符号即判“已解决” |
| RC-07 | 两端有效但一端稳定从属 | 038或019，按是否仍属混合对象裁决；只能取一态 | 研究者按喜欢的报告临场选状态 |
| RC-08 | 合理时间候选改变主次 | sensitivity only | 强压成单一报告 |

### 2.4 回归结论

```text
019_020_038_mutual_exclusion: pass
resolution_whitelist: pass
scope_separation_zero_evidence: pass
time_instability_exit: pass
report_release_logic: pass_as_definition
modern_behavior_validation: no
```

## 3. 版本影响

本轮没有改变40条规则的状态，也没有把任何规则升级为`eligible_core`。回归通过只表示：在相同对象、相同时间口径和相同依赖簇合同下，系统能够避免同时输出互相矛盾的机制状态。
