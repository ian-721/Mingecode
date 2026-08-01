# S03 frozen facts → A03 静态裁决 trace

状态：`research_candidate / traceability_artifact`

本文件只追踪已冻结的 S03 结构事实，不修改 `v0.1/SAMPLE_03.md`、内容母本或内容快照。trace 不包含姓名、生日、地点、完整四柱或真人经历。

## 1. 冻结来源事实

来自 S03 已冻结研究材料的抽象事实是：

- subject 有同类支持和两个独立根，主体容量可判 usable；这些根保持 peer 角色身份，但按 subject capacity 合同参与日主根分，不复制节点或关系；
- output 形成稳定、可用的输出通道；
- constraint 有两个可观察来源；
- input 不显，必须判 absent，而不是为 A03 补造供能链；
- output 与 constraint 的具体结构接触存在；
- 一组可核验的支对象形成 clash raw-only contact；该 contact 只作辅助关系证据，不替代生克闭包。

## 2. nodeAvailability

按统一公式得到：

```text
subject = usable
output = usable
constraint = usable
input = absent
```

subject、output、constraint 至少来自两个不同 `originClusterKey`。`input=absent` 是 S03 的明确限制，不是 unknown。

## 3. complete raw relation closure

对 observed subject/output/constraint 对象执行矩阵闭包，必然同时得到：

```text
subject -> output      generates
output -> constraint  controls
constraint -> subject controls
```

不能省略固有的 `constraint -> subject`，也不能把 `output -> constraint` 反向。若 trace 加入其他 observed 角色或同角色对象，所有新对象对也必须完整生成，不能只保留有利边。

## 4. relationEffectiveness

在三端均 usable、没有同对象竞争时：

```text
subject -> output      effective
output -> constraint  effective
constraint -> subject effective
```

input absent，因此 `constraint -> input -> subject` 没有可成立端点链；它是 `not_supported`，不是 A03 必需路径。

## 5. dimensions 与同源张力

- D2=`output_supported`：subject/output usable，且 `subject -> output` effective。
- D3=`constraint_mediated_by_output`：`subject -> output -> constraint` effective；input-mediated path 不成立。直接控制边可以同时存在，它是完整闭包的一部分，不把状态改成 mixed。
- D5=`output_constraint_feedback`：同一个 constraint 端点既被 output 控制，又直接控制 subject。
- E4=`output_control_feedback`：`output -> constraint` 与 `constraint -> subject` 共享同一个具体 constraint 端点及来源簇，形成“输出调节约束 / 约束直接作用主体”的静态反馈张力。

A03 的两个核心维度是 D3 与 D2；D5/E4 提供同源张力和最近邻解释，不把 D1 复用为第二维，也不依赖 input。

两维不重复计票：D2 的区分性输入是 subject/output 的 node_availability（容量家族）；D3 的区分性输入是完整闭包中的 output→constraint 路径（关系闭包家族）。二者共享的 subject→output 只作为连接边，不在两个家族重复加票。

## 6. A03 decision

```text
S03 frozen structural facts
-> nodeAvailability (subject/output/constraint usable; input absent)
-> complete role-matrix closure
-> three effective relations
-> D2 output_supported
-> D3 constraint_mediated_by_output
-> E4 output_control_feedback
-> exclusions not hit
-> A03 established research candidate
```

这条静态 trace 只支持“约束通过输出中介路径被处理”的命盘骨架。方法化、内部质检、首版延迟和持续审查仍是 `CalibrationFork.manifestation`，不得声称由命盘单独证明。
