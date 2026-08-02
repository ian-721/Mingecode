# ADR-0013｜真实 occurrence multiplicity 与 relation interface

**状态：Accepted**

**日期：2026-08-02**

**授权人：赵焱阳**

**Owner approval reference：[PR #24 Owner acceptance patch](https://github.com/ian-721/Mingecode/pull/24)，2026-08-02**

## 背景

content-rebuild v0.4 正确保留了每个显干、藏干、柱位、比例、`objectKey`、`originClusterKey` 与 `rootOccurrence`，并为 `n` 个 occurrence 生成 `n * (n - 1) / 2` 条完整 atomic relation closure。这个物理层不能按目标机制裁剪。

v0.4 同时把以下基数条件定义为 competition：同一个具体对象连接两个或更多同角色对端。真实命盘进入现有适配器后，正常同角色多 occurrence、独立来源、fan-in 与 fan-out 会满足该条件；同源 alias 虽先被去重，独立来源仍会被标为竞争。结果是本来有效的 relation 被降级，E2、E4、D5、排除与最近邻同步失真。

现有 atomic facts 不包含“互斥”“共享有限容量”或“使路径失效”的事实。因此，原 F08 与一个正常双 constraint 输入在算法可见事实上一度同构；不读取样本 ID、预期机制或目标标签，就不能仅凭 occurrence 数量区分两者。

## 路线比较

### 路线 A：closure 前 Relation Interface Projection

先把 occurrences 投影为有限接口再生成决策关系。若它替换 physical closure，会丢失具体来源、same-role 与反证；若同时保留另一套 physical closure，则形成两套容易漂移的关系真相，provenance 还需另建映射。

### 路线 B：完整 closure 后按接口聚合

先生成完整 atomic closure，再按现有 `sourceDedupeKey` 形成 contributor groups，最后投影为六个固定 relation interfaces。atomic 层只承担完整事实与 provenance；interface 层只承担 D/E4/nearest-neighbour 的状态读取。它保留全部物理证据，并把决策接口数量固定为一份。

### 路线 C：只修 source dedupe / competition grouping

不新增接口层，只更换 representative 或 group key。它能局部移除当前误判，却仍让数量不定的 atomic paths 直接进入维度与裁决；加入显式 contention 后仍需新增类型，dedupe、competition 与 decision 继续耦合，也无法从原 F08 的同构输入中推出真实竞争。

采用路线 B。它是修复 multiplicity 语义的最小充分路线，但不会自动让 S01—S04 命中历史标签。

## 决定

### 1. 三层职责

```text
Occurrence[]
→ complete atomic closure
→ source-deduped contributor groups
→ six RelationInterfaces
→ interface direct/compound paths
→ E4 / D1—D6 / nearest-neighbour
```

三层不得互相替代：

1. **Atomic occurrence / relation**：保留全部物理对象、来源簇、根气、比例、same-role、反证、canonical relation keys 与四项 closure diagnostics。
2. **Relation interface**：把指定角色关系投影为六个固定接口；数量不参与身份或状态。
3. **Contention fact**：只表达额外、可验证的互斥、共享容量或路径失效；不从 occurrence 数量猜测。

### 2. 六个固定 interface keys

```text
generates:input>subject
generates:subject>output
generates:output>resource
controls:output>constraint
controls:constraint>subject
generates:constraint>input
```

interface identity 只有上述 key。它不包含 candidate、sample、profile、expected mechanism、candidate answer、target archetype、`objectKey` / `originClusterKey` 或对象 / 来源数量。候选级容器可在接口外层记录 `candidateId`，但不得改变 interface key。

### 3. competition 新边界

以下均不是 competition：

- 多个同角色 occurrence；
- 多个独立来源；
- 正常 fan-in / fan-out；
- 同源 alias。

只有通过 v0.5 schema 与 provenance validator 的 `InterfaceContentionFact` 才能产生 contention。当前真实 adapter 默认不生成 fact；在另有批准的确定性 producer 出现前，事实列表为空。不得用 occurrence、object、origin、profile 或 fixture 数量推断 fact。

### 4. F08 迁移

`research/content-rebuild/v0.4/**` 保持不变。v0.5 继承 F08 的全部 atomic occurrences：

- 无 contention fact 的同构输入不得 conflicted；
- v0.5 的 F08 fixture 通过通用 `shared_capacity` facts 明确表达冲突依据；
- 加入合法 fact 后，F08 继续断言 conflicted；
- 两个变体的 atomic closure、canonical keys 与 base effectiveness 必须相同。

### 5. S01—S04 与 reachability

S01—S04 保留为真实、匿名的结构诊断样本，不再断言 `S01→A01`、`S02→A02`、`S03→A03`、`S04→A04`。fixture 记录适配后的 atomic facts 与实际诊断输出，但 evaluator input 不含目标机制、历史标签或搜索目标。

未来 multiplicity 实现完成后，必须运行机制中立的 chart reachability scan：

1. 从有效、确定性生成的 chart 状态枚举或采样，不使用真人原始出生资料；
2. 不把搜索中的目标机制传入 adapter、evaluator 或 contention producer；
3. 在裁决完成后统计 A01—A04 的可达数量与分布；
4. 每种机制至少存在一个真实可达 chart，否则停止并另立 `AVAILABILITY_AND_INTERFACE_SEMANTICS_RESEARCH`。

“分布严重失衡”尚无 Owner 批准的数值阈值，因此本合同只要求机械输出完整分布；是否构成严重失衡是 Owner review gate，不得伪造自动 PASS。若 Owner 判定分布严重失衡，必须停止后续实现并另立 `AVAILABILITY_AND_INTERFACE_SEMANTICS_RESEARCH`。

## 与 ADR-0012 的关系

本 ADR 已于 2026-08-02 经 Owner 批准为 Accepted。其效力仅限于在 `research/content-rebuild/v0.5/**` 静态研究线中定义 relation interface 与显式 contention；ADR-0012“回滚与停止条件”中关于重新定义 competition 的停止项，仅在这个窄范围内被替代。

除此以外，ADR-0012 继续完整有效：

- 不恢复旧签名确定性模型；
- 不改变当前 H5 `/test` 的起题、答题或现实路线裁决；
- 不把 A01—A04 宣称为经真人验证的人格结论；
- 不改变 `civil_time_v1`、隐私、性别、分享或持久化边界。

本 ADR 不授权代码 IMPLEMENT、PR #16 同步、部署、Ready、merge 或 Production。

## 延续边界

- 运行时只能是确定性逻辑，大模型不得承担排盘、格局或人格裁决。
- 原始出生日期、时间、地点不得写入 URL、日志、浏览器持久化或外部服务。
- 所有机制、维度与规则继续标记为研究候选。
- 不修改 `/test`、app、components、data、依赖、lockfile、CI、workflow 或 Vercel 配置。
- 不触发 Vercel Preview。

## 回滚与停止条件

若未来需要撤销本 ADR，必须以新 ADR 明确替代，不回写 ADR-0012、v0.4 或本 ADR 历史；v0.4 继续作为冻结历史保留。

出现以下任一项立即停止：

- 需要删除合法 occurrence、藏干或 atomic relation；
- 需要读取 mechanism、archetype、sample、profile、expected、target、answer 或 result 来生成 contention；
- 需要按 occurrence / object / origin 数量猜测竞争；
- 需要改变 availability、D1—D6、E4、最近邻、threshold 或 role mapping 以命中 S01—S04 历史标签；
- 需要修改 v0.4、当前 `/test`、依赖、持久化、部署或 Production；
- 无法保留 atomic witness 与完整 provenance。
