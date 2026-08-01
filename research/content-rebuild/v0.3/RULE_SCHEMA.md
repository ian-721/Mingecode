# 规则模式 v0.2

## 目的

规则必须从 v0.4 原子事实链读取结果，不能消费预填维度、目标原型、规则命中、人格标签、职业、自述或问题答案。

```ts
type RuleStatus =
  | "established"
  | "candidate"
  | "conflicted"
  | "not_supported"
  | "boundary_sensitive";

type RuleDefinition = {
  id: string;
  kind: "support" | "tension" | "exclusion" | "gate";
  target: "A01" | "A02" | "A03" | "A04" | "shared";
  requires: {
    evidenceNodeIds: Array<"E1" | "E2" | "E3" | "E4" | "E5" | "E6">;
    structuralDimensionTests: string[];
    structuralPredicateIds: string[];
    minimumIndependentFamilies: 2;
    minimumDistinctOriginClusters: 2;
  };
  dedupeKeys: string[];
  counterEvidence: string[];
  downgradeOn: string[];
  excludesWhen: string[];
  outputs: {
    chartSkeletonPermissions: string[];
    manifestationPermissions: string[];
    forbiddenClaims: string[];
  };
};
```

本文件只冻结语义，不授权创建 TypeScript。

## 原型成立门

输出 `established` 必须同时满足：

1. 至少两个不可重复结构维度；
2. 至少两个独立证据家族；
3. 至少两个不同 `originClusterKey`；
4. 一项 E4 同源核心张力；
5. 排除未命中；
6. 成对最近邻边界唯一；
7. 所有合理候选盘核心相同。

不得再要求三个维度，也不得用辅助关系、P06/P08、固定优先级或问题答案补门。

## 问题与内容权限

核心完成后，最多 3 道问题只进入 `CalibrationFork.manifestation`。问题不得建立规则、增加家族/来源簇、覆盖排除、改变机制或时间状态。内容键必须分别声明 chart skeleton 与 manifestation 权限；运行时仍只允许人工批准块。
