# 结构谓词合同 v0.4

## 1. 适用层级

本文件把 v0.3 的八个自然语言谓词拆成规范化关系图公式。公式可以对 v0.4 抽象夹具执行；在 `CHART_FACT_VOCABULARY.md` 标记为 `definition_pending` 的字段被真实 ChartFacts 产出前，公式不得在运行时返回 `established`。

共同规则：

- 输入只允许 E1—E5 node/edge/path/relation 与 E6 候选聚合；
- 去重统一使用 `candidateId + originClusterKey + predicateId`；
- 同一月令链最多贡献一个独立来源簇；
- 任一必需字段 unknown → 最多 candidate；
- 支持与关键反证同真 → conflicted；
- 候选盘改变谓词真假或最近邻 → boundary_sensitive；
- 问题答案不参与谓词，只能在最终内容组装后标记显化补偿。

## 2. P01｜内部定标连续

- **原子输入：** E1 subject/input availability；E3 input→subject edge；E4 input..subject path；edge scope；外部 constraint/resource→subject edges。
- **成立：** U(subject) ∧ U(input) ∧ P(input..subject) ∧ internal scope ∧ 不存在主导性的外部直达路径。
- **反证：** 外部 constraint/resource→subject effective，且内部路径 limited/blocked。
- **排除：** subject 或 input absent；未知时柱能合理改变主路径。
- **降级：** scope、availability 或外部主导定义 unknown；只来自一个来源簇。
- **去重：** input 的月令藏干、相关透干与季节支持合为一簇。
- **时间：** 全候选同真才稳定；内部/外部主路径变化即 boundary_sensitive。
- **可支持内容键：** `A01.core.coordinate`；与 P02/P03 同时成立后才可支持 A01 核心。
- **禁止推出：** 反权威、固执、开放问题中实际行为、职业自主性。
- **blocker：** 当前事实没有 edge scope、node availability 或“主导路径”批准定义。

## 3. P02｜扩张强于外部裁剪

- **原子输入：** input→subject→output 生成路径；resource/constraint/pruning 节点与完成边；E5 调节关系。
- **成立：** 生成路径 established，且至少一个外部收束接口 limited/blocked；不存在同强的 established 完成路径。
- **反证：** output→resource/constraint 完成路径 established，且 gate 位于 completion stage。
- **排除：** 生成路径本身 absent/blocked。
- **降级：** pruning 只是“未观察”或时柱 unknown；阶段 unknown。
- **去重：** 同一生成链只计一次，不把 input、藏干和透干拆票。
- **时间：** 生成/完成相对状态跨盘变化为 boundary_sensitive。
- **可支持内容键：** `A01.tension.expansion`、`A01.crash.rewrite`。
- **禁止推出：** 创意多、拖延、不断重写真实项目、无法完成工作。
- **blocker：** 当前事实没有 pruning/完成边有效性与 stage。

## 4. P03｜可见表达与环境响应同强

- **原子输入：** E2 output visible；E1 output/constraint usable；E3 subject→output 与 external constraint/resource→subject effective；scope。
- **成立：** V(output) ∧ U(output) ∧ P(subject..output) ∧ 至少一条 external response edge established。
- **反证：** output 路径 established 但所有 external response edge blocked/absent。
- **排除：** 只有 output visible；或 constraint 只出现但未与 subject/output 建立有效边。
- **降级：** response edge/scope unknown；同源月令链同时提供 output 与 constraint。
- **去重：** 可见 output 与其关系边若同源只计一簇。
- **时间：** 任一候选从 visible/effective 变 hidden/blocked 即 boundary_sensitive。
- **可支持内容键：** `A02.core.response`；关系内容键继续为辅助候选。
- **禁止推出：** 外向、会读空气、在意评价、感染力或实际环境敏感。
- **blocker：** “环境响应”不是 ChartFact；结构代理到现代行为的映射未批准。

## 5. P04｜输出响应高于承载恢复

- **原子输入：** E1 subject/output/recovery availability；E4 subject..output 与 recovery..subject paths；E6 反证。
- **成立：** output usable 且输出路径 established，同时 recovery limited 或恢复路径 blocked；output 与 recovery 来自不同来源簇。
- **反证：** recovery usable 且恢复路径 established。
- **排除：** output limited/absent；或只有可见性没有容量差。
- **降级：** recovery unknown；只用 seasonalStrength 单项比较。
- **去重：** 月令容量与由月令直接派生的恢复节点只计一簇。
- **时间：** output/recovery 相对状态跨盘变化为 boundary_sensitive。
- **可支持内容键：** `A02.tension.overheat`、`A02.crash.feedback_as_power` 中仅结构张力部分。
- **禁止推出：** 精力、电量、睡眠、健康、实际恢复需求或持续输出体验。
- **blocker：** 当前事实与依赖没有 `recoveryCapacity`；需要 Owner 批准结构代理，或删除该谓词的核心权限。

## 6. P05｜压力被转成方法

- **原子输入：** constraint/input/subject/output availability；constraint→input→subject→output 路径；output→constraint 调节边；stage/scope。
- **成立：** 四节点 usable；整条加工路径 established；output→constraint 为 effective；不存在无中介的 constraint→subject 主导路径。
- **反证：** constraint→subject 直接边 established 且中介路径 blocked；或 constraint 与 output 仅同时出现但无边。
- **排除：** constraint absent/blocked，或 input/output 任一 absent。
- **降级：** 任一 edge limited/unknown；传统结构到“方法”的来源 pending。
- **去重：** 同一端点链及其月令来源只计一次；“见官杀+见食伤”不是两票。
- **时间：** 加工路径与直接路径跨盘互换为 boundary_sensitive。
- **可支持内容键：** `A03.core.method`。
- **禁止推出：** 谨慎、认真、建立步骤、验证习惯、质量高或实际抗压。
- **blocker：** 原始关系可枚举，但有效中介、调节方向与现代“方法化”映射均未批准。

## 7. P06｜持续建构伴随内部审查

- **原子输入：** subject/output/resource availability；生成/完成路径；constraint/check edge 的 internal scope 与 generation stage。
- **成立：** 生成和至少一条完成路径 established；subject/output usable；internal check edge 在 generation stage effective。
- **反证：** check edge 只在 completion stage；或生成阶段 check blocked。
- **排除：** 持续建构路径不存在；只有 constraint visible。
- **降级：** stage/scope unknown；resource 或 capacity limited。
- **去重：** 完成路径与 check edge 共用同一来源簇时不能充当两个独立家族。
- **时间：** stage/scope 或建构路径跨盘变化为 boundary_sensitive。
- **可支持内容键：** `A03.tension.review`、`A03.crash.infinite_review` 的结构候选。
- **禁止推出：** 内部评审、首版延迟、自我否决、可靠性或复盘行为。
- **blocker：** 静态 ChartFacts 没有 internal scope 或 generation stage；A03 还缺第三个可计核心维度。

## 8. P07｜意义与价值双重验收

- **原子输入：** input/subject/output/resource availability；input→subject→output→resource 完整路径；接口反证。
- **成立：** 四节点 usable，完整转换路径 established，且至少三独立家族/来源簇。
- **反证：** 任一接口 blocked/absent；只存在 resource 或只存在 input/output。
- **排除：** 需要职业、收入、审美或自述才能补齐路径。
- **降级：** 任一节点 limited；现代“意义/价值”翻译 pending_source。
- **去重：** 同一月令链出现 input 与 resource 时仍只一簇。
- **时间：** 完整链与 conversion gap 跨盘变化为 boundary_sensitive。
- **可支持内容键：** `A04.core.editor`。
- **禁止推出：** 审美、商业感、赚钱欲、意义感、是否值得投入的真实判断。
- **blocker：** 功能链可在规范化图上计算，但传统结构到“意义/价值”的映射没有来源；A04 缺第三个可计核心维度。

## 9. P08｜完成度门过早进入生成阶段

- **原子输入：** generation stage 节点；resource/constraint/check edge；edge stage；生成链与完成链。
- **成立：** 生成链 established，且来自 resource/constraint 的 effective check edge 明确标记为 generation stage；completion-stage 边不能替代。
- **反证：** check edge 只在 completion stage，或 generation stage check blocked。
- **排除：** 静态图没有可验证阶段顺序；只有 resource/constraint 可见。
- **降级：** edgeStage unknown 时不是 candidate，而是 `blocked`，因为“过早”无法定义。
- **去重：** 同一 check edge 不得同时标 generation 与 completion；若输入冲突则 conflicted。
- **时间：** 任一候选改变 edgeStage 或 check effectiveness 即 boundary_sensitive。
- **可支持内容键：** `A04.tension.early_gate`、`A04.crash.no_trial_period`。
- **禁止推出：** 完美主义、过早放弃想法、完成度要求、实际创作顺序。
- **blocker：** 当前静态事实无法产生阶段先后。这不是缺一个枚举值，而是缺一套理论定义；必须由 Owner 选择批准的结构代理或把 P08 移出核心。

## 10. 代码准入影响

| 谓词 | 规范化图层 | 当前 ChartFacts 层 | 是否影响正例/近邻 |
|---|---|---|---|
| P01 | 公式唯一 | blocked | A01 positive/near neighbor |
| P02 | 公式唯一 | blocked | A01 positive/near neighbor |
| P03 | 结构公式唯一 | 现代映射 blocked | A02 positive/near neighbor |
| P04 | recovery 未定义 | blocked | A02 positive |
| P05 | 图公式唯一 | 有效边与现代映射 blocked | A03 positive/near neighbor |
| P06 | stage/scope 未定义 | blocked | A03 positive |
| P07 | 图公式唯一 | 现代映射 pending_source | A04 positive/near neighbor |
| P08 | stage 未定义 | blocked | A04 positive |

所有八项都影响至少一个四原型正例或最近邻，不能列为“不影响裁决的 unresolved”。
