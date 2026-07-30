# 后台签名实现合同 v0.1

**状态：Accepted / Implementation Contract**  
**适用范围：非生产 H5 Demo**

## 1. 输入、地点与隐私

```ts
type BirthInput = {
  date: string
  time: string | null
  timePrecision: "exact" | "approximate" | "unknown"
  cityId: string
}
```

- 日期支持 1900-01-01 至当前民用日期。
- 城市必须从本地搜索结果中选择；记录稳定 `cityId`、展示名、国家/地区和 IANA 时区。
- 城市数据至少支持首版常用中国城市与 DST 边界测试城市；搜索支持简体、繁体、拼音和英文别名。
- 默认时间口径为 `civil_time_v1`，不做真太阳时修正。
- 出生资料只存在当前 React 内存；不得写入 Local Storage、Session Storage、Cookie、IndexedDB、URL、日志、分析事件或网络请求。
- 计算采用用户输入地的历史 IANA 时区规则。
- 节气以真实 UTC instant 判断；日柱、时柱以输入地民用时间计算。

## 2. 时间候选

提交后先生成有限时间候选，再排盘并对四柱去重：

- 精确时间：使用对应 instant。
- DST 不存在时间：阻止提交，并要求用户调整。
- DST 重复时间：保留两个合法 instant。
- 子时换日：23:00 换日与 00:00 换日两种口径均生成候选，不擅自冻结一派。
- 距时辰边界不超过 30 分钟：同时评估相邻时辰。
- 距节气边界不超过 120 分钟：同时评估节气前后。
- `approximate`：在输入时间前后 60 分钟的有限边界点生成候选。
- `unknown`：时柱不参与必须条件；只使用年、月、日可确认的事实。
- 候选四柱去重后最多 16 份；超过上限立即停止，不静默截断。

时间稳定性：

```ts
type TimeStability = "stable" | "boundary_sensitive" | "insufficient"
```

- 所有合理候选盘的签名状态与排序一致：`stable`。
- 候选盘之间发生签名成立、关闭或排序变化：`boundary_sensitive`。
- 未知时间导致必要事实无法判断，或候选不足以裁决：`insufficient`。

## 3. 排盘事实

锁定依赖：

```text
@4n6h4x0r/stem-branch@0.8.0
```

依赖必须通过动态导入进入 `/test` 交互，不得进入首页初始构建块。不得在未批准的情况下自行替换排盘库、引入外部 API 或服务端排盘。

运行时只产生后台事实：

```ts
type NodeState = "established" | "present" | "absent"

type ChartFacts = {
  pillars: FourPillars | null
  visibleStems: StemFact[]
  hiddenStems: HiddenStemFact[]
  relations: TenRelationFact[]
  capacity: "supported" | "candidate" | "fragile"
  timeStability: TimeStability
}
```

节点状态：

- `established`：天干透出且有根，或为月支主气，或在两个以上地支中有根。
- `present`：只有透出或只有根。
- `absent`：均不存在。

证据规则：

- 同一节点、端点或依赖簇只能贡献一次事实。
- 负荷、竞争、显隐、冲突和时间只负责降级或关闭，不增加正向人格证据。
- 仍处于来源或定义风险中的旧规则，只能将签名从 `supported` 降为 `candidate`，不得升级为新的硬断语。
- 未知时柱不得被当作 `absent`；必须保持不确定。

## 4. 四个结构签名

```ts
type SignatureId = "SIG-A1" | "SIG-A2" | "SIG-B1" | "SIG-C1"
type SignatureLevel = "supported" | "candidate" | "closed"
```

| 签名 | 必要条件 | `supported` | `closed` | `candidate` |
|---|---|---|---|---|
| SIG-A1 输入→第一版 | 印与食伤均存在，输入—承接—输出路线可达 | 两端 `established`、时间稳定、无明确过滤 | 输入或输出在所有候选盘中均 `absent` | 路线部分成立、过滤未决或时间敏感 |
| SIG-A2 成形→公开输出 | 食伤输出存在 | 输出 `established` 且公开可见 | 所有候选盘均无输出 | 只在藏层、可见但无承接或时间敏感 |
| SIG-B1 权限/标准→边界 | 比劫与官杀两端均存在 | 两端 `established` 且存在可执行中介路线 | 任一端在所有候选盘中均 `absent` | 官杀主次未决、双标准冲突或时间敏感 |
| SIG-C1 输出→完成/承诺 | 食伤到财的完成路线存在 | 两端 `established`；官杀有效时只增加承诺修饰 | 输出或完成对象在所有候选盘中均 `absent` | 路线部分成立、负荷/竞争未决或责任接口不足 |

实现只允许把四柱事实映射到以上关系节点与路线，不得创建新的签名、人格原型或第 41 条规则。

## 5. 多盘聚合、排序与去重

对每个时间候选独立判断四签名，再聚合：

1. 所有盘均 `supported` 才保持 `supported`。
2. 只要有盘 `supported` 或 `candidate`、且不是所有盘均 `closed`，聚合为 `candidate`。
3. 所有盘均 `closed` 才为 `closed`。
4. `supported` 高于 `candidate`。
5. 多盘一致高于边界敏感。
6. 必要路线完整高于部分路线。
7. 不确定项更少者优先。
8. 完全并列按 `SIG-A1 → SIG-A2 → SIG-B1 → SIG-C1` 固定顺序，保证确定性；顺序不代表价值。
9. `SIG-A1` 与 `SIG-A2` 共享输入—输出依赖簇，证据只计一次；两者均成立时仍保留为危险近邻并优先提问。
10. 最多返回三个未关闭候选。
11. 若未关闭候选不足两个，不伪造候选；直接进入 `unresolved` 收缩结果。

## 6. 三至四题路由

- Q1、Q2：最高两个候选对应题组的两个不同题槽。
- Q3：
  - 前两题一致：主候选对第三候选；
  - 前两题冲突：选择与冲突相关的交叉题；
  - 只有两个候选：使用既有题槽的反向条件，不新增第十三题槽。
- Q4 只在并列、无法解释的冲突、两次以上 `uncertain` 或所有候选均非 `supported` 时出现。
- 同一路线至少获得两次支持且领先下一路线，才能成为现实主路线。
- `mixed` 必须由两个不同 `contextTag` 分别支持两条路线；简单平票不能产生 `mixed`。
- 第四题后仍不满足裁决条件，统一 `unresolved`。

关系状态：

```text
aligned     现实主路线与最高命盘候选一致
adapted     现实主路线稳定领先，但不同于最高命盘候选
mixed       两条路线分别在不同情境获得稳定支持
unresolved  信息不足、候选不足或冲突未解
```

## 7. 固定夹具

以下夹具是最低测试集，允许增加失败回归，不得删除或放宽。

### 时间与排盘夹具

| ID | 输入 | 预期 |
|---|---|---|
| T01 | 北京，2024-02-10 14:30，exact | `甲辰 丙寅 甲辰 辛未` |
| T02 | 济南，1995-07-21 23:40，exact | 生成 23:00/00:00 两口径候选；日柱为 `癸丑` / `甲寅`，时柱均为 `甲子` |
| T03 | 北京，1988-07-15 12:00，exact | 应用中国历史夏令时；UTC instant 为 03:00 |
| T04 | New York，2024-03-10 02:30，exact | `nonexistent_local_time`，阻止提交 |
| T05 | New York，2024-11-03 01:30，exact | `ambiguous_local_time`，生成两个 instant |
| T06 | 时辰边界前后 29 / 31 分钟 | 29 分钟为 `boundary_sensitive`；31 分钟不因该时辰边界扩展 |
| T07 | 节气边界前后 119 / 121 分钟 | 119 分钟为 `boundary_sensitive`；121 分钟不因该节气边界扩展 |
| T08 | 同一输入分别标记 approximate / unknown | approximate 生成有限时间候选；unknown 不伪造时柱并允许 `insufficient` |

### 签名纯函数夹具

| ID | 输入事实 | 预期 |
|---|---|---|
| S09 | 印、食伤两端 established，路线可达，稳定 | SIG-A1 supported |
| S10 | 印 established、食伤 absent | SIG-A1 closed |
| S11 | 食伤 established、透出、有承接 | SIG-A2 supported |
| S12 | 食伤仅藏层 present | SIG-A2 candidate |
| S13 | 比劫、官杀 established，中介路线可达 | SIG-B1 supported |
| S14 | 比劫、官杀存在但双标准冲突 | SIG-B1 candidate |
| S15 | 食伤、财 established，完成路线可达 | SIG-C1 supported |
| S16 | 食伤、财存在但负荷/竞争未决 | SIG-C1 candidate |
| S17 | A1/A2 共享同一输入—输出事实簇 | 证据不重复；两签名均可进入近邻校准 |
| S18 | 所有候选均为 candidate，三至四题冲突 | 第四题后 unresolved |

## 8. 失败与停止

出现以下任一项立即停止实施并报告：

- T01—T05 的核心时间/四柱结果无法由锁定依赖稳定复现；
- 需要外部城市、时区或排盘 API；
- 需要服务端保存或处理出生资料；
- 合同不足以确定四签名映射，且修复需要增加规则；
- 候选数必须超过 16 才能避免静默丢失合理解释；
- 为通过测试必须改写冻结的四签名或四关系语义。
