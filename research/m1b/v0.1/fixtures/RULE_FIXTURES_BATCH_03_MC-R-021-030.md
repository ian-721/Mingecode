# M1-B 规则抽象夹具｜Batch 03：MC-R-021—MC-R-030

**版本：** `FX-B03-0.1.0`  
**合同：** `RULE_DEFINITION_CONTRACT_v1.2-draft.md`  
**状态：** F0 Draft / Process Test Only / Not Human-Tested  
**说明：** 全部为虚构结构状态；不对应真人生日、经历、反馈或验证结果。

## 1. 通用字段

除表内差异外，每个夹具默认：

```text
source_rule_id: 由 ID 指定
time_status: stable（BND 为 unstable_candidate）
review_status: draft_fixture
human_data: none
expected_report_release: 不得超过该规则当前审查层级
```

六类预期：Positive=完整条件下按当前层级触发；Near miss=缺一必要条件不触发；Exclusion=命中排除条件关闭；Counterevidence=conditional/unresolved；Boundary=sensitivity_only；Family duplicate=执行家族/依赖簇上限。

## MC-R-021｜食神制杀链成立

**Family：** `EF-PRESSURE-RESPONSE`　**Cluster：** `CL-PRESSURE-INTERFACE`　**Rule status：** `pending_source`

| Fixture ID | Type | Abstract structure / variation | Expected result |
|---|---|---|---|
| `FX-B03-R021-POS` | Positive | 七杀为有效压力节点；食神为关键且有承接的输出；存在直接制约路径；财未改向生杀；容量稳定。 | 按当前层级触发；不得越级为 eligible_core |
| `FX-B03-R021-NEAR` | Near miss | 杀只是虚浮标签，或食神不是关键输出。 | no trigger |
| `FX-B03-R021-EXC` | Exclusion | 偏印完整关闭食神，或财强使输出转而滋生压力，或官杀混杂未解。 | closed / specific rule or unknown takes over |
| `FX-B03-R021-CNT` | Counterevidence | 另有同等级伤官压力处理路径，且无法确定主导模式。 | conditional or unresolved; do not subtract |
| `FX-B03-R021-BND` | Boundary | 关键食神根或杀的有效性依赖不稳定时支/节气候选。 | sensitivity_only; core change exits main sample |
| `FX-B03-R021-DUP` | Family duplicate | 与 022、014、019 复用同一输出/约束端点；只保留一个压力接口簇贡献。 | deduplicated; one family/cluster contribution |

**Forbidden output：** 掌权、贵命、临危天赋、天生会解决一切压力。

## MC-R-022｜伤官制杀但表达锋利

**Family：** `EF-PRESSURE-RESPONSE`　**Cluster：** `CL-PRESSURE-INTERFACE`　**Rule status：** `pending_source`

| Fixture ID | Type | Abstract structure / variation | Expected result |
|---|---|---|---|
| `FX-B03-R022-POS` | Positive | 七杀为有效压力节点；伤官为关键输出；存在直接制约路径；容量稳定；未被印完整关闭。 | 按当前层级触发；不得越级为 eligible_core |
| `FX-B03-R022-NEAR` | Near miss | 伤官可见但无根/承接，或杀不构成真实作用。 | no trigger |
| `FX-B03-R022-EXC` | Exclusion | 财使输出改向生杀、日主无法承载、或直接目标其实是正官接口而非七杀。 | closed / specific rule or unknown takes over |
| `FX-B03-R022-CNT` | Counterevidence | 食神与伤官两条路径同等级，无法预注册主导模式。 | conditional or unresolved; do not subtract |
| `FX-B03-R022-BND` | Boundary | 伤官根、杀根或作用位置因时间候选改变。 | sensitivity_only; core change exits main sample |
| `FX-B03-R022-DUP` | Family duplicate | 与 021 只允许一个压力应对模式；与 023/024 不重复计算约束接口。 | deduplicated; one family/cluster contribution |

**Forbidden output：** 叛逆、锋芒天赋、反权威人格、杀伐果断。

## MC-R-023｜伤官见官直接冲突

**Family：** `EF-EXPRESSION-STANDARD-INTERFACE`　**Cluster：** `CL-PRESSURE-INTERFACE`　**Rule status：** `pending_source`

| Fixture ID | Type | Abstract structure / variation | Expected result |
|---|---|---|---|
| `FX-B03-R023-POS` | Positive | 伤官输出与正官标准均有效、同对象直接相触；无财桥、印制、伤尽或官虚等解决路径。 | 按当前层级触发；不得越级为 eligible_core |
| `FX-B03-R023-NEAR` | Near miss | 两端同时出现但位置/链路不发生直接接口。 | no trigger |
| `FX-B03-R023-EXC` | Exclusion | 024 的资源桥完整，或印有效制伤护官，或官无效/伤官伤尽。 | closed / specific rule or unknown takes over |
| `FX-B03-R023-CNT` | Counterevidence | 冲突发生在不同情境，不能合并成同场景未解决状态。 | conditional or unresolved; do not subtract |
| `FX-B03-R023-BND` | Boundary | 任一端或桥接条件依赖边界时间候选。 | sensitivity_only; core change exits main sample |
| `FX-B03-R023-DUP` | Family duplicate | 与 020 的多重约束冲突、013 的输出过滤共享事实时，只保留最具体机制。 | deduplicated; one family/cluster contribution |

**Forbidden output：** 为祸百端、官非、天生反骨、必然破坏合作。

## MC-R-024｜伤官见官有财通关

**Family：** `EF-EXPRESSION-STANDARD-INTERFACE`　**Cluster：** `CL-REALITY-CONVERSION`　**Rule status：** `eligible_modifier`

| Fixture ID | Type | Abstract structure / variation | Expected result |
|---|---|---|---|
| `FX-B03-R024-POS` | Positive | 伤官→财→正官为同一对象的连续链，三端有效且容量稳定；桥接实际关闭 023。 | 按当前层级触发；不得越级为 eligible_core |
| `FX-B03-R024-NEAR` | Near miss | 财出现但未承接伤官，或未继续到达正官。 | no trigger |
| `FX-B03-R024-EXC` | Exclusion | 财虚浮/被竞争关闭，伤官绕过财直接冲官，或任一链段断裂。 | closed / specific rule or unknown takes over |
| `FX-B03-R024-CNT` | Counterevidence | 资源桥只在部分情境成立，正式标准接口仍有未解决冲突。 | conditional or unresolved; do not subtract |
| `FX-B03-R024-BND` | Boundary | 财根或官/伤接口因时间候选改变。 | sensitivity_only; core change exits main sample |
| `FX-B03-R024-DUP` | Family duplicate | 若与 026+027 使用同一财节点，024 只作组合叙事，不增加第三份证据。 | deduplicated; one family/cluster contribution |

**Forbidden output：** 改革家、创业者、能把一切批评变现、升职或掌权。

## MC-R-025｜财有根透出且容量可承载

**Family：** `EF-RESOURCE-CHANNEL`　**Cluster：** `CL-REALITY-CONVERSION`　**Rule status：** `eligible_modifier`

| Fixture ID | Type | Abstract structure / variation | Expected result |
|---|---|---|---|
| `FX-B03-R025-POS` | Positive | 关键财节点有根、可达且公开；来源或去向至少一端有效；容量足；未被竞争/过载关闭。 | 按当前层级触发；不得越级为 eligible_core |
| `FX-B03-R025-NEAR` | Near miss | 财透而无根，或财有根但与任何有效路由不连。 | no trigger |
| `FX-B03-R025-EXC` | Exclusion | 029 负荷超载、030 关键资源竞争、财虚浮或仅名义出现。 | closed / specific rule or unknown takes over |
| `FX-B03-R025-CNT` | Counterevidence | 资源通道存在但不承担当前结构的关键完成/交换对象。 | conditional or unresolved; do not subtract |
| `FX-B03-R025-BND` | Boundary | 关键财根位于不稳定时间候选。 | sensitivity_only; core change exits main sample |
| `FX-B03-R025-DUP` | Family duplicate | 与 026/027/024 同一财节点时，只作资源可见性说明，不增加独立正向证据。 | deduplicated; one family/cluster contribution |

**Forbidden output：** 赚钱能力、商业头脑、财富等级、现实能力强。

## MC-R-026｜食伤生财有效链

**Family：** `EF-OUTPUT-RESOURCE-ROUTE`　**Cluster：** `CL-REALITY-CONVERSION`　**Rule status：** `pending_source`

| Fixture ID | Type | Abstract structure / variation | Expected result |
|---|---|---|---|
| `FX-B03-R026-POS` | Positive | 有效输出有持续来源；财节点能承接；输出→财链连续；容量稳定；无关键过滤或竞争。 | 按当前层级触发；不得越级为 eligible_core |
| `FX-B03-R026-NEAR` | Near miss | 食伤与财同时出现，但没有连续到达关系。 | no trigger |
| `FX-B03-R026-EXC` | Exclusion | 印完整关闭关键输出、030 关闭关键财节点、029 形成容量超载。 | closed / specific rule or unknown takes over |
| `FX-B03-R026-CNT` | Counterevidence | 输出存在但实际去向是约束制衡/内部循环，不是资源或完成接口。 | conditional or unresolved; do not subtract |
| `FX-B03-R026-BND` | Boundary | 输出根或财根依赖不稳定时间候选。 | sensitivity_only; core change exits main sample |
| `FX-B03-R026-DUP` | Family duplicate | 与 012/014 复用输出端、与 025 复用财端；整个现实转化簇最多一份正向贡献。 | deduplicated; one family/cluster contribution |

**Forbidden output：** 创业者、变现能力、作品必有市场、商业成功。

## MC-R-027｜财生官有效链

**Family：** `EF-RESOURCE-CONSTRAINT-ROUTE`　**Cluster：** `CL-REALITY-CONVERSION`　**Rule status：** `pending_source`

| Fixture ID | Type | Abstract structure / variation | Expected result |
|---|---|---|---|
| `FX-B03-R027-POS` | Positive | 财节点有来源并连续到达有效官约束；责任承接存在；官不过重且无混杂未解。 | 按当前层级触发；不得越级为 eligible_core |
| `FX-B03-R027-NEAR` | Near miss | 财与官并见，但财未实际到达官，或官无根。 | no trigger |
| `FX-B03-R027-EXC` | Exclusion | 财弱官重、020 混杂未解、030 关闭关键财、023 直接冲官未解。 | closed / specific rule or unknown takes over |
| `FX-B03-R027-CNT` | Counterevidence | 成果/资源存在，但没有形成正式承诺或规则接口。 | conditional or unresolved; do not subtract |
| `FX-B03-R027-BND` | Boundary | 财或官关键根依赖时间候选。 | sensitivity_only; core change exits main sample |
| `FX-B03-R027-DUP` | Family duplicate | 与 019 复用约束端、与 025/026 复用财端；同一链只计一个现实转化簇贡献。 | deduplicated; one family/cluster contribution |

**Forbidden output：** 职位、仕途、领导力、社会地位、天生负责。

## MC-R-028｜官印相生有效链

**Family：** `EF-CONSTRAINT-INTERNALIZATION`　**Cluster：** `CL-CROSS-BRIDGE`　**Rule status：** `eligible_modifier`

| Fixture ID | Type | Abstract structure / variation | Expected result |
|---|---|---|---|
| `FX-B03-R028-POS` | Positive | 有效官/杀有度并到达有效印，印再到达日主；链连续且无财破印、混杂未解。 | 按当前层级触发；不得越级为 eligible_core |
| `FX-B03-R028-NEAR` | Near miss | 官印同现，但印不承接官或印不到日主。 | no trigger |
| `FX-B03-R028-EXC` | Exclusion | 财完整破坏印、官杀过重无制、020 混杂未解、印仅名义存在。 | closed / specific rule or unknown takes over |
| `FX-B03-R028-CNT` | Counterevidence | 规则压力被输出直接处理，而非转成内部支持/框架。 | conditional or unresolved; do not subtract |
| `FX-B03-R028-BND` | Boundary | 官或印关键根依赖不稳定时间候选。 | sensitivity_only; core change exits main sample |
| `FX-B03-R028-DUP` | Family duplicate | 与 019、011/012 复用官印端点时只作桥接修饰，不能成为第三独立家族。 | deduplicated; one family/cluster contribution |

**Forbidden output：** 学历高、道德好、体制型人才、贵气、权威认可依赖已被证明。

## MC-R-029｜财多身弱负荷超载

**Family：** `EF-RESOURCE-LOAD`　**Cluster：** `CL-REALITY-CONVERSION`　**Rule status：** `pending_definition`

| Fixture ID | Type | Abstract structure / variation | Expected result |
|---|---|---|---|
| `FX-B03-R029-POS` | Positive | 多个有效财负荷持续占用容量；根气/印比恢复不足；不是严格从财；结论在时间候选中稳定。 | 按当前层级触发；不得越级为 eligible_core |
| `FX-B03-R029-NEAR` | Near miss | 财多但多数虚浮，或容量足以承接。 | no trigger |
| `FX-B03-R029-EXC` | Exclusion | 比印恢复充分、财通道不关键、严格从财候选、负荷只是一次性。 | closed / specific rule or unknown takes over |
| `FX-B03-R029-CNT` | Counterevidence | 现实对象多但有明确分流、收口或恢复路径，未超过容量。 | conditional or unresolved; do not subtract |
| `FX-B03-R029-BND` | Boundary | 关键财或容量根随时间候选改变。 | sensitivity_only; core change exits main sample |
| `FX-B03-R029-DUP` | Family duplicate | 与 016 同为负荷比较，若共享容量事实只生成一个过载叙事；不增加 D5 正向证据。 | deduplicated; one family/cluster contribution |

**Forbidden output：** 守不住财、能力弱、贫穷、机会太多必失败。

## MC-R-030｜比劫争财条件完整

**Family：** `EF-RESOURCE-COMPETITION`　**Cluster：** `CL-REALITY-CONVERSION`　**Rule status：** `pending_definition`

| Fixture ID | Type | Abstract structure / variation | Expected result |
|---|---|---|---|
| `FX-B03-R030-POS` | Positive | 比劫与关键财节点发生直接竞争；财缺少图内保护/持续来源；比劫不是必要扶身；对象范围明确。 | 按当前层级触发；不得越级为 eligible_core |
| `FX-B03-R030-NEAR` | Near miss | 比劫与财并见，但没有直接竞争或财不是关键节点。 | no trigger |
| `FX-B03-R030-EXC` | Exclusion | 比劫为必要支持、官有效制劫、食伤持续补充关键财、竞争对象不同。 | closed / specific rule or unknown takes over |
| `FX-B03-R030-CNT` | Counterevidence | 同类节点参与资源生成或承接，而非削弱关键财。 | conditional or unresolved; do not subtract |
| `FX-B03-R030-BND` | Boundary | 比劫根、财根或保护路径依赖时间候选。 | sensitivity_only; core change exits main sample |
| `FX-B03-R030-DUP` | Family duplicate | 同一比劫事实不得再支持 017 的内部参照；受影响财节点关闭 025/026/027 的正向释放。 | deduplicated; one family/cluster contribution |

**Forbidden output：** 克妻、破财、败家、兄弟不和、公平感已被证明。

## 2. 完整性检查

```text
rules covered: 10
fixtures per rule: 6
total fixtures: 60
unique fixture IDs: 60
real participants: 0
real birth data: 0
human-test evidence: 0
```

任一规则的必要/排除条件、证据家族、依赖簇、对象范围或互斥关系发生语义变化时，相关六个夹具必须重跑并升级版本。
