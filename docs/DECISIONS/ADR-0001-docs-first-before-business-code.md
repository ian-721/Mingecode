# ADR-0001：业务代码前坚持 docs-first

**状态：冻结 / Accepted**

- **Title:** 业务代码前坚持 docs-first
- **Status:** Accepted
- **Date:** 2026-07-27

## Context

人格维度、原型、规则及用户需求均未通过真实盲测。此时建立应用、依赖和生产基础设施会放大未经验证的假设，并产生沉没成本。历史 source 提及 Next.js，但当前阶段决定优先验证区分度。

## Decision

M1 人工盲测达到预先记录的通过标准前，只允许文档、研究材料、验证模板及两个候选原型的轻量视觉简报。不得创建业务代码、Next.js 或其他应用工程、依赖、数据库、API、部署或 CI。Next.js 属于**后续技术候选，当前禁止实施**。

## Consequences

- M0 和 M1 可以低成本修改研究假设。
- 进入业务开发必须由后续 ADR 明确批准。
- 工程便利性不得成为跳过盲测的理由。

## Supersedes / Superseded by

- **Supersedes:** 历史 source 中“首发采用 Next.js 实现”的当前实施时点；不否定其后续候选资格。
- **Superseded by:** 无。

## Open questions

- 盲测通过后应进入低保真原型还是先补充规则复核？
- 后续技术选型需要哪些隐私与可复现性验证？
