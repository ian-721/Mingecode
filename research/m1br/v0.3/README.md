# M1-BR-D｜完整响应式 H5 Demo 实施基线 v0.1

**状态：Accepted / Authorized for Non-production Demo**  
**日期：2026-07-30**

## 本阶段目标

建立一个移动端优先、可从首页真实跑到结果与分享的 H5 Demo：

```text
输入出生日期、时间和城市
→ 生成有限四柱与结构签名候选
→ 默认三道、最多四道现实行为校准题
→ 输出 aligned / adapted / mixed / unresolved
→ 生成不含敏感资料的分享卡或通用回流链接
```

本阶段验证产品闭环，不验证命理或人格科学效度，不部署生产环境。

## 冻结实施文件

| 文件 | 作用 |
|---|---|
| `BACKSTAGE_SIGNATURE_IMPLEMENTATION_CONTRACT_v0.1.md` | 时间地点、排盘事实、四签名、候选排序、校准裁决和固定夹具 |
| `H5_DEMO_PRODUCT_AND_ACCEPTANCE_SPEC_v0.1.md` | 页面、状态、组件、数据、隐私、响应式和验收标准 |
| `CODEX_IMPLEMENTATION_TASK.md` | 执行层可直接使用的精确任务书 |

授权边界见：

- `docs/DECISIONS/ADR-0011-h5-demo-implementation-authorization.md`

## 状态说明

```text
hybrid_model: research_candidate
non_production_h5_demo: authorized
runtime_llm: forbidden
database_or_login: forbidden
production_deployment: forbidden
formal_copy: not_approved
human_validation: not_executed
```

旧 v0.1/v0.2 研究记录保持原样；本目录只负责把已批准研究转成可实现、可测试的合同。
