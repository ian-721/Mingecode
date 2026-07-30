# CRX-0.7｜机制候选与内容门台账

**状态：** Research Candidate / F1 Not Ready  
**继承：** `CORE_RULE_SLOT_LEDGER_v0.6.md`  
**真人测试：** NOT AUTHORIZED

## 1. 本版变化

- P0公版扫描交叉核验完成第一轮；选定版本精确页码仍未关闭；
- 012/013/014与019/020/038完成跨状态回归；
- 四份报告的五个无充分依据声明已修复；
- 40个声明单元实现0个未映射项；
- 建立六组成对区分矩阵与单审查者遮名体面度审计；
- 未改变任何规则为`eligible_core`；
- 未恢复P01、P04、P08，未把P05升级为核心。

## 2. 四个主机制候选

| Mechanism | Report | 主规则 | 反向/状态规则 | 修饰与守门 | 当前资格 |
|---|---|---|---|---|---|
| M-A1 输入先行 | R01 | 012 | 013；011为输入偏置 | 008、009、010、015、时间门 | `candidate_after_source_and_review` |
| M-A2 公开成稿 | R02 | 014 | 013；009关闭稳定可见 | 010、015、024、显隐门 | `candidate_after_source_and_review` |
| M-B1 权限—标准协商 | R03 | 018 | 020未解决 / 038已解决 | 019、027、对象与时间门 | `candidate_after_source_and_review` |
| M-C1 完成—承诺 | R04 | 026、027 | 路由未成立；020/038约束主次门 | 024、025、028、资源/时间门 | `candidate_after_source_and_review` |

`candidate_after_source_and_review`不等于核心规则或正式人格，只表示定义、反例、声明映射和对象边界已经可以继续审查。

## 3. 规则状态保持

```text
eligible_core:        0
eligible_modifier:   14
sensitivity_only:    12
pending_source:      14
pending_definition:   0
```

本轮没有因公版扫描中找到章节而改变`pending_source`状态。

## 4. 来源门

### P0历史见证交叉核验

```text
historical_L1_witness_verified: 4 / 13
historical_witness_layer_partial: 4 / 13
scan_object_identified_page_pending: 5 / 13
```

### 选定现代版本门

```text
selected_edition_page_verified: 0 / 13
verbatim_quote_transcribed: 0 / 13
variant_collation: incomplete
source_gate_closed: no
```

历史见证只降低章节误定位风险；不替代选定版本页码，也不验证现代行为。

## 5. 报告内容门

```text
reports: 4
six_section_structure: pass
compact_length_range: 339—360
length_spread: 6.19%
claim_units: 40
traceable_or_modifier_or_gate: 36
advice_only: 4
unsupported_or_partial: 0
pairwise_definition_pairs: 6 / 6
single_reviewer_masked_audit: provisional_pass
independent_masked_review: pending
reports_ready_for_F1: 0 / 4
```

## 6. 最近邻风险

| Pair | 区分轴 | 当前风险 | 失败处理 |
|---|---|---|---|
| R01/R02 | 首版形成前 vs 判断成形后公开 | high | 独立审查仍混淆则合并 |
| R02/R04 | 可见版本 vs 完成/接收接口 | high | 独立审查仍混淆则合并 |
| R03/R04 | 决定权/标准 vs 完成对象/责任终点 | medium | 删除抽象责任词，保留对象动作 |
| 其余三组 | 输入、输出、权限、完成位置不同 | lower but untested | 继续保留明确反向条件 |

风险等级只是材料优先级，不是统计结果。

## 7. 辅助特质

```text
S-01 接缝桥接
required: 至少两个不重复主机制
new_evidence: 0
core_report_allowed: no
standalone_decoy_allowed: no
```

## 8. 已退出当前核心的原型

```text
P01 先手试路人
P04 稳态维护者
P08 慢变量养成者
```

它们继续保留在M1-A历史快照和审查记录中，但不得恢复为报告，只因需要数量、传播感或视觉素材。

## 9. F1内容锁门

四份报告只有同时满足下列条件才能进入F1候选：

1. P0选定版本页码与文本层级关闭；
2. 012/014/018/026/027来源登记完成；
3. 独立遮名审查未发现稳定体面度赢家；
4. 独立审查能准确说出R01/R02、R02/R04的对象差异；
5. 任何需要合并的近邻已先合并；
6. 报告、声明映射、控制文本和错配协议重新生成统一哈希。

## 10. 当前门状态

```text
CRX_0_7_definition_work_complete: yes
source_page_gate_closed: no
claim_traceability_gate: pass_as_candidate
independent_prestige_gate: open
mechanism_discrimination_gate: open_pending_independent_review
F1_content_lock_ready: no
F2_operational_lock_ready: no
human_test_authorized: no
PR_ready_for_merge: no
```
