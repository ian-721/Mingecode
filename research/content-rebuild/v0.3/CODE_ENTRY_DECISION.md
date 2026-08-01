# 代码准入判断 v0.4

## 结论

**`CONDITIONAL_PASS_FOR_ISOLATED_PURE_FUNCTION_IMPLEMENTATION`**

Owner Review 将上一候选恢复为 `BLOCKED_PENDING_RAW_RELATION_AND_A03_TRACEABILITY`。本修订只有在完整关系闭包、A02 三边、S03→A03 trace 和 32/32 回归全部机械通过后才恢复上述条件结论；相关门现已全部关闭。

这不是实现授权，只表示后续可另行申请一个隔离、无 I/O、无运行时接线的纯函数方案。当前仍禁止修改 lib/app/components/data、题库、页面、依赖、CI、部署或持久化。

## 已关闭的复审门

| 门 | 关闭证据 |
| --- | --- |
| role-pair matrix | v0.4 `ROLE_RELATION_MATRIX.md` 冻结生成循环、控制循环、同类与 peer/self 展开 |
| raw relation 完整闭包 | fixture input 删除 rawRelations；evaluator 对全部 occurrence 对生成 `n(n-1)/2` 条边 |
| 四项闭包错误 | invalid=0、missing=0、duplicate after source dedupe=0、unexpected manual=0，16/16 profiles |
| A02 方向与固有直接边 | F05 自动生成 subject→output、output→constraint、constraint→subject；D5 共同比较三边，直接边不自动排除 |
| A03 与 S03 | `S03_STATIC_TRACE.md` 从 subject/output/constraint usable、input absent 推到 output-mediated D3、D2 output_supported、E4 feedback、A03 |
| A03 第二维 | D2 output_supported，来自 S03 主体容量和输出通道；不复用 D1，不补 input |
| 16 profiles / 32 fixtures | 16/16 闭包与 expected profile 一致；32/32 唯一裁决，四机制八类分布完整 |
| 问题隔离 | answers_reverse 4/4 只改 manifestation，不改核心 |

## 回归结果

- positive：4/4 established；
- near_neighbor：4/4 在完整闭包下得到非目标唯一机制；
- single_family：4/4 不授予核心；
- capacity_failure：4/4 candidate；
- counterevidence：4/4 由合法 occurrence 变化自动产生反证闭包并 conflicted；
- time_stable：4/4 同核；
- time_changes_core：4/4 boundary_sensitive；
- answers_reverse：4/4 核心不变。

## 非阻断责任

- nodeAvailability 阈值仍是 `project_assumption_minimum_v0.4`，不是传统共识，未来需版本化真人验证；
- A01—A04 来源继续 pending_source，“古人误会你了”是 project inference / modern reinterpretation candidate，正式对外前必须关闭；
- 母本中静态骨架与现实显化的混合句段，未来组装器必须按批准子块过滤。

这些责任不改变四个正例或最近邻，因此不是本次条件代码准入 blocker。

## 后续边界

后续若申请实现，只能复现已版本化的 nodeAvailability、role relation closure、relationEffectiveness、E/D 与活跃夹具。不得接真实生日、修改现有 H5、让答题进入核心、增加原型/维度、改变 civil_time_v1，或把条件通过解释为 Ready、Merge、部署或真人测试授权。
