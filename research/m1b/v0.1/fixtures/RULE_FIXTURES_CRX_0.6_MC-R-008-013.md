# CRX-0.6｜MC-R-008 与 MC-R-013 定义关闭夹具

**状态：** Fictional Structure Fixtures / Process Test Only  
**真人资料：** 0

## MC-R-008｜支持路由门

| Fixture | Type | 抽象结构 | 预期 |
|---|---|---|---|
| FX-008-P | Positive | 低容量候选；一条有效印路稳定到身；无从格、无完整关闭 | `SG-2`，008触发；只开内部支持门，不生成声明 |
| FX-008-N | Near miss | 有印但路径停在外围，不能到身 | `SG-1`，008不触发 |
| FX-008-E | Exclusion | 低容量候选但严格从格条件完整 | 040优先，008关闭 |
| FX-008-C | Counterevidence | 支持到身，但同对象高强度负荷完整覆盖且无恢复路由 | `SG-3`，008不释放支持结论 |
| FX-008-B | Boundary | 唯一支持节点位于时辰边界，不同候选盘改变可达性 | sensitivity_only，不进入主分析 |
| FX-008-D | Family duplicate | 根气、印比和支持链复用同一事实 | 只计一个容量家族；008为gate，新增证据=0 |

### 008 失败保护

- 不得因“有印”直接触发；
- 不得把支持门写成韧性或恢复人格；
- 不得在同一事实已用于001/002/006时再增加一份证据。

## MC-R-013｜关键输出过滤

| Fixture | Type | 抽象结构 | 预期 |
|---|---|---|---|
| FX-013-P | Positive | 食神为唯一关键输出；偏印有效、同对象直接关闭；无财解、无替代输出 | `OF-3`，013触发；只作反向候选 |
| FX-013-N | Near miss | 偏印与食神同时有效，但不在同一对象或无直接作用 | 013不触发 |
| FX-013-E | Exclusion | 偏印承担008必要支持，移除会使容量失效 | 013关闭，不得把必要支持当纯过滤 |
| FX-013-C | Counterevidence | 财路线有效制印，关键食神输出恢复 | 013关闭，记录解除机制 |
| FX-013-B | Boundary | 关键食神或偏印只在不稳定时支成立 | sensitivity_only，不进入主分析 |
| FX-013-D | Family duplicate | 食神过滤同时被011写成一般输出弱 | 采用013具体机制；011不重复累计 |

### 013 失败保护

- 食神与偏印名义同现不得触发；
- 有同等级伤官出口时不得称关键输出被关闭；
- 不能自动增加D2；
- 不能补写“质量控制强”“完美主义”等正向人格。

## 回归结论

```text
fixtures_added: 12
MC-R-008_definition_executable: yes
MC-R-013_definition_executable: yes
modern_behavior_validated: no
human_test_authorized: no
```
