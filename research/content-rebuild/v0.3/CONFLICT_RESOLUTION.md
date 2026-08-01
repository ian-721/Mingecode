# 冲突裁决合同 v0.2

## 唯一顺序

```text
0. civil_time_v1 候选有效性
1. nodeAvailability + 来源簇去重
2. relationEffectiveness + 中介链
3. E1—E6 / D1—D6
4. 排除
5. 两维、两家族、两来源簇、同源张力
6. 全部成对最近邻边界
7. 候选盘聚合
8. 冻结核心
9. CalibrationFork.manifestation
10. 人工批准内容块组装
```

## 状态

- 任何合理候选盘核心不同：`boundary_sensitive`，不做多数票。
- 支持与明确排除同候选并存：`conflicted`。
- 结构路径只有 limited 或缺一项非排除门：最多 `candidate`。
- 单一家族或单一来源簇：`not_supported`，不授予核心。
- 全部门与唯一边界通过：`established`。

## 最近邻

只使用 v0.4 维度合同中的结构边界：A01/A04 看资源收束接口；A02/A04 看主体容量不对称与完整转换；A03/A04 看约束中介链与资源转换；其余成对边界按 D1—D6 执行。若两个机制都完整通过且结构边界仍无法区分，保留双候选；不得按编号、文案吸引力或答案排序。

## 问题冲突

回答与典型现实显化相反时，只输出不同 `manifestationVariant`。它不能改变 `coreMechanism`、证据、维度、张力、排除、最近邻或时间状态。无法由静态盘证明的行为应保留为问题候选或删去命盘归因，而不是写成不可否认的双面句。
