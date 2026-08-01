# Mingecode Repo-native Harness

## 1. 用途与边界

本页是稳定的项目路由层，用于帮助仓库任务定位相关权威来源。它不复制产品、ADR、研究合同或验收规范正文，也不保存当前任务、授权、`STATUS`、验收结果或更新时间。

先读取本页，再按当前任务只读取相关来源；不要默认遍历全部研究和历史材料。

## 2. 当前任务状态职责

| 载体 | 唯一职责 |
|---|---|
| 活跃 GitHub Issue；没有 Issue 时为当前任务卡 | 当前目标、授权级别、修改范围、`STATUS` 和验收标准 |
| Pull Request | 实际变更、检查结果、候选产物、审查和修复记录 |
| 本页 | 稳定项目地图、权威来源路由、优先级、替代关系、工程命令入口和环境事实 |

Pull Request 不承担授权或 `STATUS`。若 Issue 与 Pull Request 表述冲突，以活跃 Issue 或当前任务卡为准。

## 3. 来源与冲突处理

按以下顺序判断当前任务的权威来源：

1. 活跃 GitHub Issue 或当前任务卡；
2. 根目录 [`AGENTS.md`](../AGENTS.md)；
3. 已接受的产品、架构与 ADR；
4. 当前适用的研究合同、产品规范和验收规范；
5. 当前代码、配置、测试和可观察行为；
6. 历史计划、阶段记录和已被替代的材料。

较新的 Accepted ADR 只有在明确说明替代范围时才覆盖旧决定。若来源冲突且没有明确替代关系，停止并请求决策，不自行补全。

## 4. 产品来源

| 任务 | 首要来源 |
|---|---|
| 产品定位、用户价值、表达边界 | [`PRODUCT_VISION.md`](PRODUCT_VISION.md) |
| 产品目标、范围、成功与失败标准 | [`PROJECT_CHARTER.md`](PROJECT_CHARTER.md) |
| 品牌分层与命名状态 | [`BRAND_ARCHITECTURE.md`](BRAND_ARCHITECTURE.md) |
| 协作角色与决策边界 | [`COLLABORATION.md`](COLLABORATION.md) |

## 5. 架构、ADR 与规则合同

- ADR 总索引与状态：[`DECISIONS/README.md`](DECISIONS/README.md)。
- 非生产 H5 的授权和工程边界：[`ADR-0011`](DECISIONS/ADR-0011-h5-demo-implementation-authorization.md)。
- 当前“命盘起题 + 轻问答校准”决定及替代范围：[`ADR-0012`](DECISIONS/ADR-0012-chart-prompt-and-light-calibration.md)。
- 当前 R2 模型实现合同：[`HYBRID_CANDIDATE_MODEL_CONTRACT_v0.4.md`](../research/m1br/v0.3/HYBRID_CANDIDATE_MODEL_CONTRACT_v0.4.md)。
- H5 页面、隐私、分享、响应式与技术边界：[`H5_DEMO_PRODUCT_AND_ACCEPTANCE_SPEC_v0.1.md`](../research/m1br/v0.3/H5_DEMO_PRODUCT_AND_ACCEPTANCE_SPEC_v0.1.md)。

涉及产品本体、隐私、规则引擎、时间口径、持久化、架构或部署边界的变更，按 `AGENTS.md` 和 ADR 索引判断是否需要新 ADR。

## 6. 质量与验收来源

| 范围 | 权威来源 |
|---|---|
| 产品闭环、隐私、响应式、无障碍和交付验收 | [`H5_DEMO_PRODUCT_AND_ACCEPTANCE_SPEC_v0.1.md`](../research/m1br/v0.3/H5_DEMO_PRODUCT_AND_ACCEPTANCE_SPEC_v0.1.md) |
| R2 模型固定夹具与停止条件 | [`HYBRID_CANDIDATE_MODEL_CONTRACT_v0.4.md`](../research/m1br/v0.3/HYBRID_CANDIDATE_MODEL_CONTRACT_v0.4.md) |
| 单元测试配置与用例 | [`vitest.config.ts`](../vitest.config.ts)、[`tests/unit/`](../tests/unit/) |
| E2E 配置与用例 | [`playwright.config.ts`](../playwright.config.ts)、[`tests/e2e/`](../tests/e2e/) |
| 构建、Lint、类型检查和测试命令 | [`package.json`](../package.json) |

实际执行结果只记录在对应 Pull Request，不回写本页。

## 7. 工程命令

以下命令逐项来自 `package.json`：

| 目的 | 命令 |
|---|---|
| 本地开发 | `npm run dev` |
| 生产构建 | `npm run build` |
| 启动构建产物 | `npm run start` |
| Lint | `npm run lint` |
| 类型检查 | `npm run typecheck` |
| 单元测试 | `npm run test:unit` |
| E2E | `npm run test:e2e` |
| 聚合检查 | `npm run check` |

`npm run check` 依次运行 lint、typecheck、unit test 和 build；它不包含 E2E。是否执行命令由当前任务的授权和验收标准决定。

## 8. 稳定项目地图

| 路径 | 职责 |
|---|---|
| `app/` | Next.js 页面、路由和页面级流程 |
| `components/` | 当前 H5 用户界面组件 |
| `data/` | 城市、题目和 Demo 文案等本地数据 |
| `lib/` | 确定性排盘、校准、状态与分享逻辑 |
| `tests/` | 单元测试、E2E 与测试辅助入口 |
| `docs/` | 产品、治理、术语、阶段计划和 ADR |
| `research/` | 研究治理、模型合同、规则与验证材料 |
| `design/` | 视觉方向、交接和设计治理材料 |

## 9. 替代与历史关系

- [`ADR-0012`](DECISIONS/ADR-0012-chart-prompt-and-light-calibration.md) 明确替代 ADR-0009 中“命盘提出结构签名候选、默认三题最多四题”的运行模型；ADR-0009 保留为历史研究决定。
- [`BACKSTAGE_SIGNATURE_IMPLEMENTATION_CONTRACT_v0.1.md`](../research/m1br/v0.3/BACKSTAGE_SIGNATURE_IMPLEMENTATION_CONTRACT_v0.1.md) 中被 ADR-0012 和当前 R2 合同明确替代的部分不再管辖。未被明确替代的部分，仅在不与当前 Accepted ADR 和当前合同冲突时继续适用。
- [`M0_BASELINE.md`](M0_BASELINE.md)、[`research/m1br/v0.1/`](../research/m1br/v0.1/)、[`research/m1br/v0.2/`](../research/m1br/v0.2/) 和 [`CODEX_IMPLEMENTATION_TASK.md`](../research/m1br/v0.3/CODEX_IMPLEMENTATION_TASK.md) 记录历史阶段与演进，不承担当前任务状态。
- 根 [`README.md`](../README.md) 是项目说明与导航入口；发生规范冲突时，按本页的来源优先级处理。

## 10. Node/npm 与执行环境事实

- 仓库当前没有固定 Node 或 npm 版本。
- 执行任务前必须先确认当前执行环境是否具备：本地 Git 工作树、目标分支、`node`、`npm` 和所需浏览器测试能力。
- 环境修复与版本固定属于独立决策；不得为普通任务自行修改 PATH、工具链配置、`package.json` 或 lockfile。
- 聊天连接器、只读仓库接口或不含本地工作树的运行环境，不得被当作已经具备仓库级执行能力。

## 11. 非部署验证边界

1. `lint`、TypeScript、单元测试、生产构建、样本门、裁决链诊断和 E2E，必须在本地仓库或正式 CI 中执行。
2. 不得通过修改 `vercel.json`、Vercel `buildCommand`、产品 Preview 页面、生产页面或连续部署来代跑上述检查或定位业务逻辑。
3. 不得创建仅用于触发测试、搬运脚本或代替本地执行的临时 GitHub workflow、临时 Vercel 配置或临时诊断页面。
4. 调试信息必须进入测试输出、正式 CI 日志或本地命令输出；不得临时暴露在用户页面中。
5. 所有业务逻辑修复必须先在非部署环境完成定位、实现和完整检查，再形成稳定产品候选。
6. 文档、治理或 Harness 变更不以 Vercel Preview 作为验收依据，也不得为其主动触发或重试部署。

## 12. `BLOCKED — LOCAL_EXECUTION_REQUIRED`

当任务需要仓库级执行，但当前环境缺少可写本地工作树、目标分支、`node`、`npm`、私有依赖、浏览器、正式 CI、必要日志或长期进程能力时：

1. 立即停止实现、测试结论、Preview 和部署动作；
2. 将 Objective 状态报告为 `BLOCKED`，阻塞原因统一记为 `LOCAL_EXECUTION_REQUIRED`；
3. 精确列出缺失能力、实际影响、已完成的只读分析、最小本地交接指令和恢复条件；
4. 不得把静态代码阅读、手工推演、GitHub 文件写入、Vercel 构建或 Preview 冒充本地/CI 验证；
5. 不得静默降级到 Vercel 调试、临时 workflow、页面诊断或重复部署；
6. 恢复条件必须是获得可用的本地仓库执行环境或正式 CI，而不是获得新的 Preview 配额。

本节只统一阻塞术语，不改变第 11 节和第 13 节已经冻结的验证与部署边界。已运行 Objective 继续使用启动时固定的 `project_harness_ref`；除非 Owner 明确批准迁移，本次更新不自动替换其 Harness pin。

## 13. Vercel 使用门

1. Vercel 只用于已经通过本地或正式 CI 完整检查的稳定产品候选，验证 Vercel 特有的构建、环境变量、路由和真实页面表现。
2. 每个已经本地验证的候选最多触发一次 Preview。
3. Preview 失败后，必须先在非部署环境完成定位、修复和完整复验，才允许产生下一个候选部署。
4. 遇到配额、频率、平台故障或项目限制时，立即停止所有部署重试；平台限制不得解释为代码失败，也不得据此修改业务代码。
5. Vercel 结果只能证明部署平台相关行为，不能替代 lint、类型检查、测试、样本门、裁决链或本地生产构建证据。
6. 未满足本节前置条件时，不得请求、生成、刷新或反复轮询 Preview。
