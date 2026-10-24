# 架构决策记录

**状态：冻结 / Accepted**

本目录当前包含十三份 ADR：十二份 `Accepted`，一份 `Proposed`。`Accepted` 表示冻结；`Proposed` 表示候选。改变已接受决定必须新增 ADR，不得静默改写历史。

| ADR | 状态 | 决定 |
|---|---|---|
| [ADR-0001](ADR-0001-docs-first-before-business-code.md) | Accepted | 盲测通过前 docs-first，不创建业务代码 |
| [ADR-0002](ADR-0002-gender-as-optional-explanation-layer.md) | Accepted | 性别为可选解释层，不进入人格裁决 |
| [ADR-0003](ADR-0003-no-user-facing-precise-personality-scores.md) | Accepted | 不向用户展示未经验证的精确人格分数 |
| [ADR-0004](ADR-0004-deterministic-runtime-no-llm-arbitration.md) | Accepted | 确定性运行时，大模型不承担人格裁决 |
| [ADR-0005](ADR-0005-minimise-birth-data-storage.md) | Accepted | 最小化出生资料处理 |
| [ADR-0007](ADR-0007-brand-architecture-and-public-name-candidate.md) | Proposed | 品牌分层与公开产品名候选 |
| [ADR-0008](ADR-0008-mvp-civil-time-convention.md) | Accepted | MVP 使用 `civil_time_v1`，暂不启用真太阳时 |
| [ADR-0009](ADR-0009-hybrid-chart-candidate-and-calibration.md) | Accepted（研究方向） | 历史混合模型：命盘候选 + 默认三题校准 |
| [ADR-0010](ADR-0010-backstage-rigor-frontstage-lightness.md) | Accepted | 后台保留严谨研究，前台保持轻松、幽默、易分享 |
| [ADR-0011](ADR-0011-h5-demo-implementation-authorization.md) | Accepted | 窄范围授权非生产 H5 Demo；不授权部署或合并业务 PR |
| [ADR-0012](ADR-0012-chart-prompt-and-light-calibration.md) | Accepted | 命盘只负责起题，四至六题独立裁决现实路线 |
| [ADR-0013](ADR-0013-real-occurrence-multiplicity.md) | Accepted | 冻结 content-rebuild 静态研究线的真实 occurrence multiplicity、relation interface 与显式 contention 边界 |
| [ADR-0014](ADR-0014-sole-maintainer-and-authorship.md) | Accepted | 独立维护与按实际贡献署名，取消未实施的双人审批安排 |

ADR-0011 只在其明确范围内覆盖 ADR-0001 的代码禁令，不改变旧决定的历史状态。ADR-0012 在同一非生产 H5 边界内替代 ADR-0009 的运行模型。

ADR-0013 已于 2026-08-02 经 Owner 批准为 Accepted；仅在 content-rebuild 静态研究线内，窄范围替代 ADR-0012 关于重新定义 competition 的停止条件。ADR-0012 其余部分、当前 H5 `/test` 与现行 R2 实现合同继续有效。
