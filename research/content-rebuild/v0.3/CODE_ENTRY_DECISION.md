# 代码准入判断 v0.3

## 结论

**`CONDITIONAL_PASS_FOR_ISOLATED_PURE_FUNCTION_IMPLEMENTATION`**

Issue #11 的静态合同门已由 v0.4 关闭：nodeAvailability 和 relationEffectiveness 有唯一公式；32/32 活跃夹具从非人格原子事实得到唯一预期；P06/P08 与所有现实行为退出核心；四个正例和最近邻可裁决；问题答案不改变核心。

这不是实现授权。它只表示后续可另行申请一个隔离、无 I/O、无用户数据、无运行时接线的纯函数方案；当前授权仍禁止修改 `lib/`、`app/`、`components/`、`data/`、题库、页面、依赖、CI、部署或持久化。

## 已关闭的门

| 门 | 证据 |
| --- | --- |
| nodeAvailability 唯一 | v0.4 `CHART_FACT_VOCABULARY.md` 对六类角色统一使用季节、根、藏干比例、可见性、unknown 和来源簇去重 |
| relationEffectiveness 唯一 | v0.4 `EVIDENCE_GRAPH_CONTRACT.md` 定义端点、方向、中介、竞争、阻断、raw-only 与候选聚合 |
| E1—E6 / D1—D6 唯一 | v0.4 证据与维度合同只读取上述规范化结果 |
| 核心不依赖 P06/P08 | v0.4 谓词合同将二者标为 `manifestation_only` |
| 四正例与最近邻可裁决 | 活跃 JSON 的 A01—A04 positive 为 established；四个 near_neighbor 均得到另一个明确机制 |
| 32/32 非人格输入 | factSet 只含季节、occurrence、raw relation 和有限候选；禁止键扫描为 0 |
| 答案不决定核心 | 四个 answers_reverse 与各自 positive 核心、维度、最终状态一致 |

## 项目假设与未决责任

- nodeAvailability 的分值和阈值是 `project_assumption_minimum_v0.4`，不是传统共识；未来须版本化并接受真人验证。
- A01—A04 的传统来源保持 `pending_source`；“古人误会你了”是 `project_inference / modern_reinterpretation_candidate`。这不影响隔离纯函数的静态裁决，但正式对外前必须关闭。
- 同一内容块若混有命盘骨架和现实行为，未来组装器必须有句段/批准子块权限过滤；在此之前不得宣称行为由命盘单独证明。

以上未决项不改变四个正例、最近邻、时间边界或问题隔离，因此不构成本次代码准入 blocker。

## 后续申请的硬边界

后续若申请实现，只能复现已版本化的 v0.4 纯函数和活跃夹具，不得：接真实生日、修改现有 H5、引入人格自由生成、让答题进入核心、增加原型/维度/字段、改变 `civil_time_v1`，或把条件通过解释为 Ready、Merge、部署或真人测试授权。
