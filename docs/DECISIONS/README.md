# 架构决策记录

**状态：冻结 / Accepted**

本目录当前包含十份 ADR，记录影响产品本体、性别策略、隐私、规则引擎、品牌架构、时间口径、合作边界或前后台表达边界的决定。`Accepted` 表示冻结；`Proposed` 表示候选。改变已接受决定必须新增 ADR，不得静默改写历史。

| ADR | 状态 | 决定 |
|---|---|---|
| [ADR-0001](ADR-0001-docs-first-before-business-code.md) | Accepted | 盲测通过前 docs-first，不创建业务代码 |
| [ADR-0002](ADR-0002-gender-as-optional-explanation-layer.md) | Accepted | 性别为可选解释层，不进入人格裁决 |
| [ADR-0003](ADR-0003-no-user-facing-precise-personality-scores.md) | Accepted | 不向用户展示未经验证的精确人格分数 |
| [ADR-0004](ADR-0004-deterministic-runtime-no-llm-arbitration.md) | Accepted | 确定性运行时，大模型不承担人格裁决 |
| [ADR-0005](ADR-0005-minimise-birth-data-storage.md) | Accepted | 最小化出生资料处理 |
| [ADR-0006](ADR-0006-collaboration-and-decision-boundaries.md) | Accepted | 冻结双人角色与决策边界 |
| [ADR-0007](ADR-0007-brand-architecture-and-public-name-candidate.md) | Proposed | 品牌分层与公开产品名候选 |
| [ADR-0008](ADR-0008-mvp-civil-time-convention.md) | Accepted | MVP 使用 `civil_time_v1`，暂不启用真太阳时 |
| [ADR-0009](ADR-0009-hybrid-chart-candidate-and-calibration.md) | Accepted（研究方向） | 命盘只提出候选，默认三道校准题完成混合译码 |
| [ADR-0010](ADR-0010-backstage-rigor-frontstage-lightness.md) | Accepted | 后台保留严谨研究，前台保持轻松、幽默、易分享 |
