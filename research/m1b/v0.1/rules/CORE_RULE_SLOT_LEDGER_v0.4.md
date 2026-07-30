# 24 槽核心规则试验集台账 v0.4

**版本：** `CRX-0.4.0-draft`  
**状态：** Research Candidate / Process Test Only  
**当前审查覆盖：** MC-R-001—MC-R-040（40/40 首轮审查完成）  
**继承台账：** `CORE_RULE_SLOT_LEDGER_v0.3.md`  
**真人测试：** NOT AUTHORIZED

## 1. 本版变化

- 完成 MC-R-031—040 逐条裁决与 60 个抽象夹具；
- 累计完成 240 个规则级抽象夹具；
- 建立合、冲的互斥状态轴和关系对象总门；
- 035、036、040执行核心硬排除；
- 037进入显隐组合修饰，不新增证据；
- 038建立官杀解决白名单，关闭020的定义阻塞；
- 039建立全局路由注册表，关闭007的定义阻塞；
- 007、020后续状态由 `pending_definition` 改为 `pending_source`，旧批次文件不回写；
- 40/40审查完成后，A/B层仍无冻结填槽；
- D3目前没有可释放的非关系独立家族，这是维度层风险，而不是靠强行填033解决。

## 2. 填槽原则

- `eligible_core` 才能在来源、回归和报告映射全部通过后进入 Frozen Rule ID；
- `pending_source` 只能列候选，不能占槽；
- `eligible_modifier` 不得占锚点；
- `sensitivity_only` 和 `hard_excluded` 不占任何核心或反向槽；
- 综合门、桥接链和关系状态不因连接多个节点而成为新证据；
- 同一 dependency cluster 或对象最多贡献一份正向证据；
- 目前所有 A/B 槽保持 open 是有效结果，不是材料失败；
- 若某维度没有独立可执行家族，应在跨批次收束中合并、降级或淘汰维度，而不是新增漂亮规则补洞。

## 3. A 层｜12 个锚点槽

| Slot | Dimension / direction | Frozen Rule ID | Candidate under review | Family / cluster | Status | 说明 |
|---|---|---|---|---|---|---|
| A01 | D1 内部参照 | — | MC-R-017 | EF-REFERENCE-BOUNDARY | open / pending_definition | 外部约束弱仍是全局否定命题；030竞争优先级已定义但缺完整验证器 |
| A02 | D1 可谈判边界 | — | MC-R-018 | EF-REFERENCE-BOUNDARY | open / pending_source | 需正式来源、簇外证据和报告映射 |
| A03 | D2 输入偏置 | — | MC-R-011 | EF-INPUT-OUTPUT-ROUTING | open / modifier only | 不能独立提高D2 |
| A04 | D2 输入—输出整合 | — | MC-R-012 | EF-INPUT-OUTPUT-ROUTING | open / pending_source | 与014/026共享端点；需簇外第二家族 |
| A05 | D3 探索启动 | — | — | — | open / no viable family | 033仅sensitivity；食伤/伤官自动增加D3已删除 |
| A06 | D3 切换/重组 | — | — | — | open / no viable family | 当前没有非关系、可执行、可否认且独立的家族 |
| A07 | D4 公开有效输出 | — | MC-R-014 | EF-OUTPUT-CHANNEL | open / pending_source | 来源未关；与012/026去重 |
| A08 | D4 压力响应/接口 | — | MC-R-021 / 022 | CL-PRESSURE-INTERFACE | open / pending_source | 同对象最多一态；023为反向状态 |
| A09 | D5 输出进入完成接口 | — | MC-R-026 | EF-OUTPUT-RESOURCE-ROUTE | open / pending_source | 与012/014/025共享端点 |
| A10 | D5 完成进入正式承诺 | — | MC-R-027 | EF-RESOURCE-CONSTRAINT-ROUTE | open / pending_source | 与019/038约束端去重 |
| A11 | D6 容量与开放路由 | — | MC-R-039 | CL-CAPACITY-ROUTE-SYSTEM | open / composite gate | 039复用多家族，不可成为独立锚点 |
| A12 | D6 压力/负荷处理 | — | MC-R-021 | EF-PRESSURE-RESPONSE | open / pending_source | 不能与A08重复占两份独立证据；负荷规则均未释放 |

## 4. B 层｜6 个反向/排除槽

| Slot | Dimension | Frozen Rule ID | Candidate under review | Status | 说明 |
|---|---|---|---|---|---|
| B01 | D1 | — | MC-R-020 / 023 / 030 | open | 020已转pending_source；023来源未关；030定义未闭合 |
| B02 | D2 | — | MC-R-013 | open / pending_definition | 只作关键输出过滤，不自动定义D2 |
| B03 | D3 | — | — | open / no viable family | 033/034只在敏感性附录 |
| B04 | D4 | — | MC-R-013 / 023 | open | 两类对象机制不得混写 |
| B05 | D5 | — | MC-R-029 / 030 | open / pending_definition | 资源过载与竞争均需对象特定验证 |
| B06 | D6 | — | MC-R-016 / 020 / 029 | open | 020来源未关；016/029定义未闭合；同一容量事实只取最具体负荷 |

035、036、040不列入B层，因为“硬排除”不是人格反向证据。

## 5. C 层｜6 个情境/守门槽

| Slot | 守门主题 | Rule ID / protocol | Status | Batch 04 影响 |
|---|---|---|---|---|
| C01 | 可见不等于稳定 | MC-R-009 | provisional_candidate | 继续限制037公开端 |
| C02 | 潜在不自动入报告 | MC-R-010 | provisional_candidate | 继续关闭037藏端的无引动声明 |
| C03 | 时间/单点支撑敏感 | MC-R-003 | sensitivity_candidate | 合冲刑害及从格全部受时间门约束 |
| C04 | 家族/簇/对象去重 | family-cluster-object cap protocol | provisional_candidate | 新增CL-RELATION-STATE与CL-CAPACITY-ROUTE-SYSTEM |
| C05 | 单一家族不足 | core gate protocol | provisional_candidate | 关系、桥接、综合门均不能自成核心 |
| C06 | 候选盘改变核心 | time stability protocol | provisional_candidate | 任何关系/从格状态变化均退出主样本 |

C层仍为治理候选，不代表人格规则已验证。

## 6. 可复用修饰规则

| Rule ID | 用途 | 上限 |
|---|---|---|
| 001、002、004、005、006、009、010 | 容量背景、显隐与守门 | 按Batch01家族上限 |
| 011、015、019 | 输入偏置、潜在输出、单一约束整合 | 按Batch02依赖簇上限 |
| 024、025、028 | 接口桥接、资源显隐、官印桥接 | 按Batch03端点去重 |
| 037 | 公开/藏层状态组合 | 0份新增证据；必须有具体情境与独立锚点 |

`eligible_modifier` 不得独立生成核心原型或完整人格段落。

## 7. 来源待关闭候选

| Rule ID | 候选用途 | 已通过 | 尚未通过 | 释放条件 |
|---|---|---|---|---|
| 007 | 容量闭路状态 | 全局路由扫描表、039互斥 | 正式版本/页码、行为反例 | Source gate + 跨批次回归 |
| 012 | 输入—输出整合 | 连续链、互斥、夹具 | 正式来源、簇外证据 | Source gate + report mapping |
| 014 | 公开有效输出 | 显隐、透根、反例 | 正式来源、端点去重 | Source gate + report mapping |
| 018 | 可谈判边界 | 双端有效、中介、冲突排除 | 正式来源、簇外证据 | Source gate + report mapping |
| 020 | 多重约束未解决 | 038解决白名单、互斥 | 正式来源、对象一致性回归 | Source gate + 038 regression |
| 021 | 方法化压力响应 | 对象/制约/容量、夹具 | 正式来源、簇外证据 | Source gate + subtype rule |
| 022 | 重定义压力响应 | 对象/制约/子型互斥 | 正式来源、行为区分 | Source gate + subtype rule |
| 023 | 表达—标准未解决 | 同对象、救应白名单 | 正式来源、024回归 | Source gate |
| 026 | 输出→完成 | 连续链、竞争/负荷关闭 | 正式来源、端点独立性 | Source gate + report mapping |
| 027 | 完成→承诺 | 连续链、约束排除 | 正式来源、与019/038去重 | Source gate |
| 038 | 多重约束已解决 | 解决白名单、020互斥 | 正式来源、现代机制验证 | Source gate |
| 039 | 容量开放综合门 | 全局路由表、007互斥 | 正式来源、综合门回归 | Source gate；不占锚点 |

## 8. 定义阻塞列表

| Rule ID | 阻塞原因 | 关闭条件 |
|---|---|---|
| 008 | 支持与负荷比较 | 连续链 + 支持/负荷分类 + 家族上限 |
| 013 | 关键输出/直接过滤 | 替代输出扫描 + 作用力量 + 扶身/财制排除 |
| 016 | 输出负荷比较 | 持续/恢复分类 + 收口检查 + 特殊结构排除 |
| 017 | 外部约束弱 | 官杀/隐藏/承接全局缺失验证器 + 030优先级 |
| 029 | 资源负荷超过容量 | 对象计数、持续/恢复分类、严格从财排除 |
| 030 | 对象特定资源竞争 | 直接竞争检测、图内保护白名单、图外情境分离 |

007、020已从该列表移出，但只进入`pending_source`，不是准入核心。

## 9. 敏感性与核心硬排除

| Rule ID | 状态 | 核心资格 | 允许用途 |
|---|---|---|---|
| 003 | sensitivity_only | no | 单点根/时间敏感性 |
| 031 | sensitivity_only | no | 合关系状态附录 |
| 032 | sensitivity_only | no | 合而不化状态附录 |
| 033 | sensitivity_only | no | 力量接近之冲附录 |
| 034 | sensitivity_only | no | 强弱悬殊之冲附录 |
| 035 | sensitivity_only | hard_excluded | 历史/研究附录，无用户声明 |
| 036 | sensitivity_only | hard_excluded | 历史/研究附录，无用户声明 |
| 040 | sensitivity_only | hard_excluded | 专家复核候选，无用户声明 |

## 10. 当前累计统计

```text
A anchor slots frozen:             0 / 12
B reverse/exclusion slots frozen:  0 / 6
C guard slots provisional:         6 / 6

rules fully reviewed:             40 / 40
rules eligible_core:               0
rules eligible_modifier:          14
rules sensitivity_only:            8
rules pending_source:              12
rules pending_definition:           6
rules excluded_m1b:                 0
rules core_hard_excluded:           3

abstract rule fixtures:           240
combination fixtures:               8
real participants:                  0
```

状态总和为 40：

```text
14 modifier + 8 sensitivity + 12 pending_source + 6 pending_definition = 40
```

## 11. 40/40 后的第一次诊断

### D1

有018、020/038等候选，但高度集中于 `CL-REFERENCE-CONSTRAINT`。内部参照侧017仍未闭合，边界维度可能过度依赖官杀/比劫语言。

### D2

012是主要候选，但与D4共享输入—输出簇。当前“感受吸收”尚缺与表达链独立的可靠家族。

### D3

没有可释放家族。033被降为敏感性，伤官/食伤自动增加探索已删除。D3必须在跨批次阶段接受合并、重定义或淘汰检验。

### D4

014、021/022、023具有较多候选，但相关依赖明显；需要防止“表达型原型”因规则丰富而占优势。

### D5

026、027候选可执行度较高，但财节点与输出/约束端重复；不能包装为商业、成品或现实能力。

### D6

当前多为容量背景、压力和负荷守门。039只是综合门，不能填正向锚点；“恒载/脉冲”仍需更清楚的独立行为机制。

## 12. 下一阶段

下一阶段不是直接填槽，而是 `CRX-0.5｜跨批次回归与候选收束`：

1. 重跑所有互斥、覆盖和依赖簇；
2. 对12个`pending_source`建立正式版本/页码优先级；
3. 对6个`pending_definition`决定继续定义、降级或淘汰；
4. 检查六维是否仍有足够独立家族；
5. 形成第一版候选入槽表，但仍不冻结；
6. 让八份报告逐句映射到规则，删除无依据或高声望表述；
7. 保持真人测试门关闭。
