# 静态结构谓词与显化权限合同

状态：`research_candidate`

## 1. 核心静态谓词

每个谓词只读原子 ChartFacts、`nodeAvailability`、`relationEffectiveness` 和 E1—E6。共同规则：按 `originClusterKey` 去重；逐候选执行；候选不同则 `boundary_sensitive`；unknown 不得当 absent；人格、问题、自述不得成为输入。

### C01 内部供能链相对连续

- 原子输入：input/subject occurrences、季节强度、根、可见性、`input -> subject` raw relation。
- 成立：D1=`supply_continuous`。
- 反证：input 或 subject absent，路径 blocked。
- 排除/降级：路径 limited 只得 candidate；unknown 不裁决。
- 可支持内容：A01 与 A03 的“命盘结构骨架”权限。
- 禁止推出：内部定标、持续建构、反复重写或人格稳定性。

### C02 外部收束接口相对弱

- 原子输入：subject/output/resource 节点与 `subject -> output -> resource` raw relations。
- 成立：上游链 effective，D6=`resource_interface_limited` 或 `resource_interface_blocked`。
- 反证：D6=`resource_interface_effective`。
- 排除/降级：上游链 limited 只能 candidate；完全 unknown 不裁决。
- 可支持内容：A01“外部收束接口相对较弱”的结构句。
- 禁止推出：扩张欲、裁剪偏好、重开地图、完成行为。

### C03 输出路径外显且容量不对称

- 原子输入：visible output occurrence、subject/output 可用性、`subject -> output`。
- 成立：D2=`output_visible_asymmetric`。
- 反证：subject usable 且路径 effective，或 output 非 visible。
- 排除/降级：output limited 或边 unknown 只能 candidate。
- 可支持内容：A02“输出外显，输出负荷与主体容量存在结构不对称”。
- 禁止推出：环境敏感、反馈耗电、气氛响应、恢复速度。

### C04 约束存在中介处理链

- 原子输入：constraint/input/subject/output 节点，`constraint -> input -> subject -> output` 与直接 `constraint -> subject` raw relations。
- 成立：D3=`constraint_mediated`。
- 反证：D3=`constraint_direct_only / mixed / constraint_blocked`。
- 排除/降级：中介链 limited 只能 candidate；缺方向为 unknown。
- 可支持内容：A03“约束通过输入/输出中介链被处理，而非仅直接作用于主体”。
- 禁止推出：方法化、内部质检、持续审查、首版延迟。

### C05 输入—输出—资源转换链连续

- 原子输入：input/subject/output/resource 节点与三段 raw relation。
- 成立：D4=`conversion_continuous` 且 D6=`resource_interface_effective`。
- 反证：任一关键节点 absent、边 blocked 或 D6 limited/blocked。
- 排除/降级：任一 limited 只能 candidate。
- 可支持内容：A04“输入—主体—输出—资源转换链同时有效”。
- 禁止推出：意义与价值双重验收、过早淘汰灵感、完成度判断。

### C06 关键接口阻断或受限

- 原子输入：具体端点、同对象竞争、路径状态。
- 成立：指定核心路径的一个关键接口 limited/blocked，同时其上游支持链 effective，并共享 E4 `originClusterKey`。
- 反证：整条路径 effective 或限制来自无关来源簇。
- 排除/降级：unknown 只得 candidate；不得把不存在的 recovery/pruning 节点当接口。
- 可支持内容：A01、A02 的同源核心张力，以及排除/最近邻。
- 禁止推出：受挫体验、压力感、耗电或行为后果。

## 2. 原八个表达的处置

| 原表达 | v0.4 权限 | 可执行替代或原因 |
| --- | --- | --- |
| P01 内部定标连续 | 核心中撤名 | 仅可计算 C01 供能链连续；“内部定标”是现代解释 |
| P02 扩张强于外部裁剪 | 核心中撤名 | 仅可计算 C02 收束接口相对弱；扩张/裁剪是行为翻译 |
| P03 可见表达与环境响应同强 | 核心中撤名 | 仅可计算 C03 加 D5；环境响应需问题校准 |
| P04 输出响应高于承载恢复 | 核心中撤名 | 仅可计算输出—主体容量不对称；恢复不可由静态盘推出 |
| P05 压力被转成方法 | 核心中撤名 | 仅可计算 C04 中介处理链；方法化需问题校准 |
| P06 持续建构伴随内部审查 | `manifestation_only` | 静态事实不足；退出维度、证据、张力、排除、最近邻与核心 |
| P07 意义与价值双重验收 | 核心中撤名 | 仅可计算 C05 转换链；双验收需问题校准 |
| P08 完成度门过早进入生成阶段 | `manifestation_only` | 静态事实不足；退出维度、证据、张力、排除、最近邻与核心 |

P06/P08 不再是 blocker，因为 Owner 已决定它们不属于静态核心合同；不得继续为它们补造字段或公式。

## 3. 命盘骨架与 CalibrationFork

| 机制 | 命盘确定的结构骨架 | 仅问题可校准的现实显化 |
| --- | --- | --- |
| A01 | C01 + C02：内部供能链连续，外部收束接口相对较弱 | 重写问题、不断重开地图、扩张/裁剪体验 |
| A02 | C03 + D5：输出外显，输出负荷与主体容量存在结构不对称 | 环境敏感、反馈耗电、气氛响应、恢复体验 |
| A03 | C04 + C01：约束经输入/输出中介链处理 | 方法化、内部质检、持续审查、首版延迟 |
| A04 | C05 + D6：输入—主体—输出—资源转换链同时有效 | 意义价值双验收、完成度门、过早淘汰灵感 |

`CalibrationFork` 最多读取 3 道有限问题，只允许选择该核心机制内人工批准的 manifestation 内容块。它必须在核心完成后执行，并输出独立的 `manifestationVariant`；不得改写 `coreMechanism`、证据家族、维度、张力、排除或最近邻结果。

## 4. 内容键绑定权限

以下绑定只调整“能由什么声明”，不改写任何已通过文本：

| 内容键 | chart skeleton 权限 | manifestation 权限 |
| --- | --- | --- |
| `A01.core.coordinate` | C01 + C02 | 无 |
| `A01.tension.expand-vs-crash` | 仅结构张力前句可由 E4 支持 | 具体扩张、重写、重开地图需 CalibrationFork |
| `A02.core.response` | C03 + D5 的结构句 | 环境、反馈、气氛、耗电需 CalibrationFork |
| `A02.tension.output-vs-recovery` | 仅输出—主体不对称可由 C03 支持 | recovery 相关文本需 CalibrationFork，且不作为事实字段 |
| `A03.core.method` | 仅 C04 中介链结构句 | 方法化、质检、审查、首版延迟需 CalibrationFork |
| `A03.tension.build-vs-review` | 无独立核心权限 | 全部为 manifestation；P06 不参与核心 |
| `A04.core.editor` | 仅 C05 转换链结构句 | 意义价值双验收需 CalibrationFork |
| `A04.tension.quality-vs-start` | 无独立核心权限 | 完成度门、淘汰灵感为 manifestation；P08 不参与核心 |

母本中若同一人工内容块同时包含两层，未来运行时必须按句段或批准子块执行权限过滤；在该能力实现前，不能把 manifestation 句段声明为“命盘单独证明”。

## 5. 明确禁止的结论

静态合同不得推出：人格形容词、心理动机、职业适配、人生经历、行为频率、恢复能力、环境敏感度、内外范围、生成/完成阶段、吉凶、传统价值判断或问题答案。所有公开表达仍是研究候选。
