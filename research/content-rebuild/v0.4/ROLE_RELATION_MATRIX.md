# Role-pair relation matrix 与完整闭包

状态：`research_candidate / frozen_for_v0.4`

## 1. 唯一角色矩阵

`subject` 与 `peer` 属于同一五行类；下表用 `self` 表示两者的元素类。对任意两个已观察到的具体 occurrence，恰好生成一条确定性关系。

### 生成循环

```text
input -> self -> output -> resource -> constraint -> input
```

展开到功能角色：

- `input -> subject`、`input -> peer`；
- `subject -> output`、`peer -> output`；
- `output -> resource`；
- `resource -> constraint`；
- `constraint -> input`。

### 控制循环

```text
self -> resource -> input -> output -> constraint -> self
```

展开到功能角色：

- `subject -> resource`、`peer -> resource`；
- `resource -> input`；
- `input -> output`；
- `output -> constraint`；
- `constraint -> subject`、`constraint -> peer`。

### 同类

- 相同功能角色的两个不同具体对象生成一条无向 `same_role`；
- `subject` 与 `peer` 共享五行类，因此二者之间也生成无向 `same_role`；
- 同一对象不得与自身生成关系。

除上述矩阵外，任何 `generates / controls / same_role` 角色对均非法。尤其禁止 `constraint -> output controls` 和 `constraint -> input controls`。

## 2. 规范化 relation

每条生成边的字段唯一：

| 字段 | 规则 |
| --- | --- |
| `kind` | 只允许 `generates / controls / same_role` |
| `sourceObjectKey` / `targetObjectKey` | 由矩阵方向确定；`same_role` 按 objectKey 字典序排序 |
| `sourceRole` / `targetRole` | 从 occurrence 复制，不允许人工覆盖 |
| `direction` | 生、克为 `forward`；同类为 `undirected` |
| `canonicalRelationKey` | `kind:sourceObjectKey>targetObjectKey`；同类使用排序后端点 |
| `originClusterKeys` | 两端 `originClusterKey` 去重、排序后的数组 |
| `sourceDedupeKey` | `kind + sourceRole + targetRole + sourceOriginClusterKey + targetOriginClusterKey`；同类端点先排序 |

十神名称只负责把五行映射到功能角色，不额外产生一票或第二条边。

## 3. 完整闭包算法

对一个候选盘执行：

1. 取全部已观察 occurrence，按 `objectKey` 排序；
2. 枚举所有无序对象对，数量必须为 `n * (n - 1) / 2`；
3. 按本文件矩阵为每一对生成且只生成一条规范化关系；
4. `canonicalRelationKey` 必须唯一；再按 `sourceDedupeKey` 折叠同源派生，折叠前若出现两个等价关系则记为重复错误；
5. 再计算 relationEffectiveness；不得先选目标路径。

活跃 fixture input 不再允许 `rawRelations`。关系闭包只能由 evaluator 从 occurrences 生成，因此人工挑选、增加或省略边均成为 schema 错误。

## 4. 完备性失败条件

任一项非零即整份夹具失败：

- `invalidRoleRelationCount`：kind、source、target 或 direction 不符合矩阵；
- `missingDeterministicRelationCount`：对象对没有恰好一条矩阵关系；
- `duplicateRelationAfterSourceDedupeCount`：规范键重复；
- `unexpectedManuallySelectedRelationCount`：fixture input 出现 `rawRelations` 或等价手工边字段。

## 5. 合冲刑害边界

`combines / clashes / punishes / harms` 不由角色矩阵生成。只有 occurrence 携带可核验的具体干支对象身份，且当前排盘库能从该对象对确定关系时，才可生成独立的 raw-only contact；否则保持未使用。它们不替代任一必需生克边，也不证明合化、吉凶或人格行为。
