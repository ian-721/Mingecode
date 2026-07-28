# 规则级抽象夹具｜Batch 01：MC-R-001—MC-R-010

**版本：** `RF-B01-0.1.0`  
**性质：** 虚构结构夹具 / Process Test Only / Not Human-Tested  
**依赖：** `RULE_DEFINITION_CONTRACT_v1.0-draft.md`、`RULE_REVIEW_MATRIX_BATCH_01_MC-R-001-010.md`

## 1. 使用规则

- 下列夹具不包含真人生日、经历或反馈；
- `trigger` 只表示规则流程是否应被调用，不表示现代人格假设成立；
- `blocked` 表示定义门尚未关闭；
- 同家族重复信号只保留一个家族贡献；
- 任何时间候选改变触发结果时，主材料必须退出并进入敏感性层。

## 2. MC-R-001｜月令同类且日主有根

| Fixture | Type | 抽象输入 | 预期 |
|---|---|---|---|
| R001-P01 | Positive | 月令稳定且同类/生扶；至少一处有效根；非从格；根未关闭 | `trigger=modifier`；记录 `EF-CAPACITY-BASE` 1 次 |
| R001-N01 | Near miss | 月令支持，但没有任何有效根 | `trigger=no`；不能只凭月令写容量稳定 |
| R001-E01 | Exclusion | 表面支持且有名义根，但月令处节气边界或从格候选 | `trigger=no/main`；转时间/特殊结构附录 |
| R001-C01 | Counterevidence | 容量背景成立，但另有已确认的出口闭塞或负荷过载 | 001 可保留背景；禁止生成“稳定有效”正向声明 |
| R001-B01 | Boundary | 两个合理时间候选使月令支持状态不同 | `sensitivity_only`；不得进入主报告 |
| R001-D01 | Family duplicate | 001 与 006 同时满足 | 家族贡献仍为 1；006 只作细节，不增加第二家族 |

## 3. MC-R-002｜失令但多点通根

| Fixture | Type | 抽象输入 | 预期 |
|---|---|---|---|
| R002-P01 | Positive | 月令不支持；两个不同地支有独立有效根；未被集中关闭 | `trigger=modifier`；标记“失令恢复型” |
| R002-N01 | Near miss | 月令不支持，但只有一个有效根 | `trigger=no`；不能写多路径恢复 |
| R002-E01 | Exclusion | 两个名义根实际依赖同一受冲支或同一关系同时关闭 | `trigger=no`；独立性不成立 |
| R002-C01 | Counterevidence | 多根存在，但持续负荷明显超过支持且无恢复链 | 只保留容量背景；不生成回稳行为声明 |
| R002-B01 | Boundary | 第二个关键根位于时支，候选时辰前后根数量改变 | `sensitivity_only` |
| R002-D01 | Family duplicate | 002 与 006 同时满足 | 只计 `EF-CAPACITY-BASE` 一次；叙事优先 002 |

## 4. MC-R-003｜单一根气受冲

| Fixture | Type | 抽象输入 | 预期 |
|---|---|---|---|
| R003-P01 | Positive | 唯一关键根稳定；对支有效；力量比较暂定强于该根；无独立补充 | `trigger=conditional_sensitivity`；不得生成核心人格 |
| R003-N01 | Near miss | 存在第二独立有效根 | `trigger=no`；“单点”条件失败 |
| R003-E01 | Exclusion | 冲被已确认关系有效化解或对支无根无力 | `trigger=no` |
| R003-C01 | Counterevidence | 独立印比支持链到达日主 | 003 降级或关闭；不得写“突然断电” |
| R003-B01 | Boundary | 唯一根本身位于时辰边界候选 | `sensitivity_only`；主样本排除 |
| R003-D01 | Family duplicate | 003 与其他冲弱方规则描述同一支撑点 | 只保留一个 `EF-CAPACITY-VULNERABILITY` 负向守门 |

## 5. MC-R-004｜月令主气透干

| Fixture | Type | 抽象输入 | 预期 |
|---|---|---|---|
| R004-P01 | Positive | 月令稳定；主气在天干可见；未被完全合去/制尽；有根或后续承接 | `trigger=visibility_modifier(public)` |
| R004-N01 | Near miss | 对应天干可见，但不是月令主气且无月令承接 | `trigger=no`；应由其他显隐规则处理 |
| R004-E01 | Exclusion | 仅余气名义透出，或透干被完全关闭 | `trigger=no` |
| R004-C01 | Counterevidence | 透干可见但无根无后续承接，同时满足 009 | 004 不得写稳定外显；009 的限制优先 |
| R004-B01 | Boundary | 节气前后月令主气变化 | `sensitivity_only` |
| R004-D01 | Family duplicate | 同一月令主气在多个天干重复出现 | 外显修饰只计 1 次；不得按数量提高人格强度 |

## 6. MC-R-005｜月令主题藏而不透

| Fixture | Type | 抽象输入 | 预期 |
|---|---|---|---|
| R005-P01 | Positive | 月令稳定；主题仅在藏干；藏干有效；无透出、合会或连续引动 | `trigger=visibility_modifier(conditional/private)` |
| R005-N01 | Near miss | 同一功能已有有效透干 | `trigger=no`；转 004 或其他外显规则 |
| R005-E01 | Exclusion | 合会或连续链已建立明确外显通道 | `trigger=no` |
| R005-C01 | Counterevidence | 结构触发，但没有第二规则确认该功能 | 不生成具体能力声明；仅保留内部显隐标记 |
| R005-B01 | Boundary | 月令或相关藏干随候选时间改变 | `sensitivity_only` |
| R005-D01 | Family duplicate | 005 与 010 对同一功能同时满足 | 家族贡献不增加；采用 010 的更严格“默认不写报告”守门 |

## 7. MC-R-006｜多点稳定根气

| Fixture | Type | 抽象输入 | 预期 |
|---|---|---|---|
| R006-P01 | Positive | 两个以上不同地支存在独立有效根；不被同一关系全部关闭 | `trigger=modifier`；记录多个恢复入口候选 |
| R006-N01 | Near miss | 只有一个有效根，其余均为名义残余 | `trigger=no` |
| R006-E01 | Exclusion | 多根全部属于同一被制局或同一时间变化会同时消失 | `trigger=no` |
| R006-C01 | Counterevidence | 多根成立但同时满足 007 的闭塞条件 | 006 只保留容量背景；不得写恢复良好或高承载 |
| R006-B01 | Boundary | 一个关键根在时支，候选盘改变独立根数量 | `sensitivity_only` |
| R006-D01 | Family duplicate | 001、002、006 中两条或三条同时满足 | `EF-CAPACITY-BASE` 仍只计 1 次；采用最具体子类叙事 |

## 8. MC-R-007｜容量强而缺少出口与约束

| Fixture | Type | 抽象输入 | 预期 |
|---|---|---|---|
| R007-P01 | Positive | 容量背景强；输出、转化、约束三类通道逐一验证为无效 | `blocked_pending_definition`；不得正式触发 |
| R007-N01 | Near miss | 至少一个稳定输出或转化通道有效 | `trigger=no` |
| R007-E01 | Exclusion | 存在暗藏但连续的有效通道，或 039 的泄制转化链成立 | `trigger=no` |
| R007-C01 | Counterevidence | 其他规则已确认持续产出/现实收口/外部校准任一机制 | 关闭 007；禁止用“没看见”覆盖已确认通道 |
| R007-B01 | Boundary | 候选时间使一个关键通道有/无根 | `sensitivity_only`；定义完成后仍不得主分析 |
| R007-D01 | Family duplicate | 001/006 提供强容量，007 再引用相同容量事实 | 容量部分不新增家族；只有经验证的“闭塞”可形成独立家族 |

## 9. MC-R-008｜容量弱但支持链成立

| Fixture | Type | 抽象输入 | 预期 |
|---|---|---|---|
| R008-P01 | Positive | 基础容量有限；支持节点有效并连续到达；负荷未压倒支持 | `blocked_pending_definition`；不得正式触发 |
| R008-N01 | Near miss | 有印比标签，但路径未到达日主 | `trigger=no` |
| R008-E01 | Exclusion | 支持节点无根、被有效破坏或属于从格候选 | `trigger=no` |
| R008-C01 | Counterevidence | 支持链存在但财食/官杀负荷经统一判据明显占优 | 关闭或降级；不得写“会借结构恢复” |
| R008-B01 | Boundary | 支持链关键节点位于时间边界候选 | `sensitivity_only` |
| R008-D01 | Family duplicate | 官印、印比等多个标签实际描述同一条支持路径 | `EF-SUPPORT-RECOVERY` 只计 1 次 |

## 10. MC-R-009｜关键功能透而无根

| Fixture | Type | 抽象输入 | 预期 |
|---|---|---|---|
| R009-P01 | Positive | 某功能天干可见；无同类根、无生扶、无后续承接 | `trigger=modifier_guard`；只允许“可见意向” |
| R009-N01 | Near miss | 对应功能有一处有效根 | `trigger=no`；转有根透出规则 |
| R009-E01 | Exclusion | 月令余气或合会经审查已提供有效根/承接 | `trigger=no` |
| R009-C01 | Counterevidence | 研究者试图由透干写成稳定能力、外向或职业优势 | 输出审计失败；删除声明或降为具体短时情境 |
| R009-B01 | Boundary | 候选时间改变相关地支是否提供根 | `sensitivity_only` |
| R009-D01 | Family duplicate | 同一功能多处透出但均无根 | 每个功能只生成 1 个守门标记，不按数量累计 |

## 11. MC-R-010｜藏干多但无透无引

| Fixture | Type | 抽象输入 | 预期 |
|---|---|---|---|
| R010-P01 | Positive | 同一功能在多支藏干出现；无透干、无合会引动、无连续链 | `trigger=modifier_guard`；默认不生成用户声明 |
| R010-N01 | Near miss | 只有一处弱藏干 | `trigger=no`；不足以满足“多处潜在”条件 |
| R010-E01 | Exclusion | 月令主气承担显著功能，或已有有效引动/连续链 | `trigger=no` |
| R010-C01 | Counterevidence | 研究者准备把所有潜在功能写入报告 | 输出审计失败；仅保留已被其他独立家族支持的功能 |
| R010-B01 | Boundary | 候选时间改变藏干集合或引动条件 | `sensitivity_only` |
| R010-D01 | Family duplicate | 同一功能在三个藏干出现 | 家族贡献仍为 1；不得产生三个声明或更高“潜力” |

## 12. Batch 01 预期汇总

| 规则 | Positive | Near miss | Exclusion | Counterevidence | Boundary | Family duplicate |
|---|---|---|---|---|---|---|
| 001 | modifier | no | no/main | restrict | sensitivity | cap 1 |
| 002 | modifier | no | no | restrict | sensitivity | subtype wins |
| 003 | conditional sensitivity | no | no | close/reduce | sensitivity | negative cap 1 |
| 004 | public visibility | no | no | 009 supersedes | sensitivity | cap 1 |
| 005 | private/conditional visibility | no | no | no user claim alone | sensitivity | 010 supersedes |
| 006 | modifier | no | no | background only | sensitivity | cap 1 |
| 007 | blocked | no | no | close | sensitivity | capacity not recounted |
| 008 | blocked | no | no | close/reduce | sensitivity | path cap 1 |
| 009 | guard | no | no | audit fail on overclaim | sensitivity | cap 1/function |
| 010 | guard | no | no | audit fail on overclaim | sensitivity | cap 1/function |

## 13. 当前结论

本批夹具验证的是定义和流程边界，而不是规则正确性。只有 001、002、004、005、006、009、010 可进入下一轮抽象 dry run；003 仅进入敏感性 dry run；007、008 在定义补齐前保持 blocked。
