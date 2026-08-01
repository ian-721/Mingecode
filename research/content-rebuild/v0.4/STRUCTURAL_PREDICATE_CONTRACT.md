# 静态结构谓词与显化权限合同

状态：`research_candidate`

所有核心谓词先要求完整关系闭包四项计数为 0；共同按来源簇去重、逐候选执行，且不读取人格、问题、自述或手工关系。

## 1. 核心静态谓词

### C01 内部供能链相对连续

- 输入：input/subject occurrences、availability、矩阵生成的 input→subject。
- 成立：D1 supply_continuous。
- 反证/降级：blocked 不支持，limited 为 candidate，unknown 不裁决。
- 支持：A01 命盘骨架。
- 禁止：内部定标、持续建构、重写行为。

### C02 收束接口相对弱

- 输入：subject/output/resource 与完整闭包中的 subject→output、output→resource。
- 成立：上游有效且 D6 limited/blocked。
- 反证：D6 effective；上游 limited 降级。
- 支持：A01 收束接口骨架。
- 禁止：扩张欲、裁剪偏好、重开地图。

### C03 输出外显且主体容量不对称

- 输入：visible output、subject/output availability、subject→output。
- 成立：D2 output_visible_asymmetric。
- 反证：D2 output_supported 或 output 非 visible；limited/unknown 降级。
- 支持：A02 输出—主体骨架。
- 禁止：环境敏感、反馈耗电、气氛响应、恢复速度。

### C04 输出调节约束

- 输入：subject/output/constraint availability，完整闭包中的 subject→output、output→constraint、constraint→subject，以及可选 input 路径。
- 成立：D3 constraint_mediated_by_output。
- 反证：D3 mixed、constraint_mediated_by_input、direct_only 或 blocked；limited/unknown 降级。
- 支持：A03“约束通过输出中介路径被处理，而非只直接作用于主体”。
- 禁止：方法化、内部质检、持续审查、首版延迟。

### C05 输入—输出—资源转换连续

- 输入：input/subject/output/resource 与完整三段生成链。
- 成立：D4 conversion_continuous 且 D6 effective。
- 反证：任一关键节点 absent、路径 limited/blocked/unknown。
- 支持：A04 转换链骨架。
- 禁止：意义价值双验收、完成度门、淘汰灵感。

### C06 三边反馈/竞争接口

- 输入：subject→output、output→constraint、constraint→subject 三条必生边、端点 availability、competition group。
- 成立形态：A02 要求 D5 regulating；A03 要求 D5 feedback；competition 形成明确反证。
- 去重：共享 subject/output/constraint 具体端点只计一次来源张力。
- 支持：A02/A03 张力和最近邻。
- 禁止：把固有 constraint→subject 单边自动当排除，或把反馈翻译为心理体验。

## 2. 原八个表达的权限

| 原表达 | v0.4 权限 |
| --- | --- |
| P01 内部定标连续 | 仅 C01 的现代解释，不是静态谓词名 |
| P02 扩张强于外部裁剪 | 仅 C02 结构代理；行为需问题 |
| P03 可见表达与环境响应同强 | 静态只支持 C03/C06；环境响应需问题 |
| P04 输出响应高于承载恢复 | 静态只支持容量不对称；恢复需问题 |
| P05 压力被转成方法 | 静态只支持 C04；方法化需问题 |
| P06 持续建构伴随内部审查 | `manifestation_only` |
| P07 意义与价值双重验收 | 静态只支持 C05；双验收需问题 |
| P08 完成度门过早进入生成阶段 | `manifestation_only` |

P06/P08 不进入维度、家族、张力、排除、最近邻或核心。

## 3. 机制权限

| 机制 | 命盘骨架 | 问题校准显化 |
| --- | --- | --- |
| A01 | C01+C02 | 重写问题、重开地图、扩张/裁剪体验 |
| A02 | C03 + D5 regulating | 环境敏感、反馈耗电、气氛响应、恢复体验 |
| A03 | C04 + D2 output_supported；S03 trace 见 `S03_STATIC_TRACE.md` | 方法化、内部质检、持续审查、首版延迟 |
| A04 | C05+D6 | 意义价值双验收、完成度门、淘汰灵感 |

CalibrationFork 最多读取 3 道问题，在核心冻结后只选择人工批准 manifestation 子块；不得改变核心、证据、维度、张力、排除或最近邻。

## 4. 内容键绑定

| 内容键 | 静态权限 | manifestation 权限 |
| --- | --- | --- |
| `A01.core.coordinate` | C01+C02 | 无 |
| `A01.tension.expand-vs-crash` | E4 A01 结构句 | 具体扩张/重写需问题 |
| `A02.core.response` | C03+D5 regulating | 环境/反馈/气氛需问题 |
| `A02.tension.output-vs-recovery` | 只支持三边不对称 | recovery 文本需问题 |
| `A03.core.method` | 只支持 output-mediated 结构句 | 方法化/质检需问题 |
| `A03.tension.build-vs-review` | E4 output-control feedback 结构句 | P06 全部需问题 |
| `A04.core.editor` | C05 转换链结构句 | 双验收需问题 |
| `A04.tension.quality-vs-start` | E4 转换交接结构句 | P08 全部需问题 |

母本和快照保持冻结。未来同一内容块混合两层时，组装器必须按批准子块过滤；未实现前不得把 manifestation 声称为命盘单独证明。
