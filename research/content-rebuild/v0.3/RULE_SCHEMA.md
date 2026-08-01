# 规则模式 v0.3

规则输入只能是 v0.4 原子 occurrences 经统一公式和完整 role-matrix 闭包得到的 E/D 状态。fixture 不得输入 rawRelations、维度、目标原型、规则命中、人格、自述、职业或答案。

```ts
type RuleStatus =
  | "established"
  | "candidate"
  | "conflicted"
  | "not_supported"
  | "boundary_sensitive";

type ClosureGate = {
  invalidRoleRelationCount: 0;
  missingDeterministicRelationCount: 0;
  duplicateRelationAfterSourceDedupeCount: 0;
  unexpectedManuallySelectedRelationCount: 0;
};

type RuleDefinition = {
  id: string;
  kind: "support" | "tension" | "exclusion" | "gate";
  target: "A01" | "A02" | "A03" | "A04" | "shared";
  requires: {
    closure: ClosureGate;
    evidenceNodeIds: Array<"E1" | "E2" | "E3" | "E4" | "E5" | "E6">;
    structuralDimensionTests: string[];
    structuralPredicateIds: string[];
    minimumIndependentFamilies: 2;
    minimumDistinctOriginClusters: 2;
  };
  counterEvidence: string[];
  outputs: {
    chartSkeletonPermissions: string[];
    manifestationPermissions: string[];
    forbiddenClaims: string[];
  };
};
```

本文件不授权 TypeScript 实现。

核心 established 仍要求两个不可重复维度、两个独立家族、两个来源簇、E4 张力、排除未命中、最近邻唯一和候选稳定。问题只在核心冻结后进入 CalibrationFork。
