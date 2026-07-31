# 规则模式 v0.1

## 目的

每条规则必须声明判断的结构机制、独立证据家族、去重方式、反证、降级条件、允许内容与禁止结论。规则不得直接消费用户职业、自述经历、答题总分或原型名称。

## 规则对象

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
  purpose: string;
  requires: {
    dimensionStates?: string[];
    evidenceFamilies: Array<"E1" | "E2" | "E3" | "E4" | "E5" | "E6">;
    structuralPredicates: string[];
    minimumIndependentFamilies: number;
  };
  dedupeKeys: string[];
  counterEvidence: string[];
  downgradeOn: string[];
  excludesWhen: string[];
  outputs: {
    supportedDimensions?: string[];
    supportedArchetype?: "A01" | "A02" | "A03" | "A04";
    allowedClaims: string[];
    forbiddenClaims: string[];
  };
};
```

本文件只冻结语义，不授权现在创建 TypeScript 类型。

## 事实输入

规则只消费已冻结事实层：月令、季节、根气、容量、透干、藏干、功能关系、输入—主体—输出—资源—约束链路、满足定义条件的结构关系，以及所有合理时间候选盘。

## 独立性与去重

`minimumIndependentFamilies` 指 E1—E6 家族，不是事实条数。同一月令、月令藏干与其透出不得包装成三个独立支持。它们可以增强一个结构谓词，但默认只形成一个 `dedupeKey`。

## 原型成立门

某原型只能在以下条件全部满足时输出 `established`：

1. 两条支持规则成立；
2. 一条核心张力规则成立；
3. 对应排除规则未命中；
4. `G01—G04` 全部通过；
5. 至少三个维度共同指向同一机制；
6. 与最近邻存在不可互换的行为差异；
7. 所有合理时间候选盘维持同一核心方向。

否则只能输出 `candidate`、`conflicted`、双候选、结构特质或 `boundary_sensitive`。

## 问题权限

问题只能作用于规则已经声明的显化分岔，不得使未支持规则成立、覆盖排除条件、增加证据家族、改变原型 ID 或生成新机制。

## 内容绑定

核心文案只能绑定 `established` 规则组合。辅助文案可以绑定 `candidate`，但必须使用保留语气。运行时输出内容键，不自由生成整段文本。
