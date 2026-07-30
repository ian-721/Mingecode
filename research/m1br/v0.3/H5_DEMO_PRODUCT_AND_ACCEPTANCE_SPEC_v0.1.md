# 完整响应式 H5 Demo 产品与验收规范 v0.1

**状态：Accepted / Implementation Spec**  
**产品文案：Demo Copy / Not Final**

## 1. 产品闭环

```text
首页
→ 生辰输入
→ 输入校验与边界提示
→ 校准题 1—3
→ 必要时第 4 题
→ 短过渡
→ 完整结果
→ 保存分享卡 / 复制通用链接
→ 朋友从“测测你的”入口回流
```

目标是一个真实可操作的 Demo，不是只展示预制结果的交互壳。

## 2. 路由

只使用两个静态路由：

- `/`：首页；`?from=share` 只触发通用回流提示，不携带个人结果。
- `/test`：输入、校准、结果与分享；全部状态仅存在当前 React 内存。

刷新 `/test` 后结果可以消失。不得为恢复进度增加持久化。

## 3. 页面状态

```ts
type DemoStep =
  | "birth_input"
  | "resolving"
  | "boundary_notice"
  | "question"
  | "transition"
  | "result"
  | "share"
  | "error"
```

核心状态：

```ts
type DemoState = {
  step: DemoStep
  birthInput: BirthInput | null
  chartResolution: ChartResolution | null
  candidates: SignatureCandidate[]
  questions: QuestionInstance[]
  answers: AnswerRecord[]
  verdict: CalibrationVerdict | null
  error: DemoError | null
}
```

规则：

- 修改任一生辰字段，清空候选、问题、回答与结果。
- 返回修改上一题后，从该题重新裁决后续问题。
- 第四题最多出现一次。
- 未捕获错误不得显示堆栈、出生资料、四柱或内部 ID。

## 4. 组件范围

最小组件：

- `Hero`
- `BirthForm`
- `CityCombobox`
- `PrivacyNote`
- `BoundaryNotice`
- `QuestionCard`
- `ProgressHint`
- `ResultHero`
- `ResultSections`
- `ShareCard`
- `ShareActions`
- `InlineError`

组件只服务当前流程，不建立跨产品设计系统、通用表单框架或 schema 驱动页面引擎。

## 5. 输入体验

- 出生日期、时间、时间精度和城市是唯一输入。
- 城市必须从搜索建议中选择。
- 时间未知时不要求填写具体时间。
- 校验提示说明如何修正，不责怪用户。
- 时间边界敏感时用一段简短提示说明“这段时间可能落在两个边界，我们会保留不确定性”，不展示算法细节。
- 提交前可见“出生资料只在当前页面计算，不会保存”。

## 6. 校准题

- 默认三题，最多四题。
- 每屏一题；两个主要选项视觉权重相同。
- 第三状态低强调显示为“都不像 / 看情况”。
- 题目只描述具体行为，不显示签名名、分数、命理词或“正确答案”。
- 当前可写完整 12 题的自然 Demo 措辞以支持闭环，但必须在代码数据文件和页面说明中标记 `demo-copy-v0.1`，不得称为正式文案。
- 工作/协作情境不超过题库约三分之一；其余使用日常安排、朋友、学习与创作情境。

## 7. 结果页

结果首屏：

- Demo 结果名；
- 一句具体识别句；
- 一个真实翻车点；
- 分享入口；
- 清楚标记“研究候选 Demo，不是预测或诊断”。

结果展开依次包含：

1. 平时怎么运行；
2. 命盘先提出的底色候选；
3. `aligned / adapted / mixed / unresolved` 的自然语言关系说明；
4. 一个高光场景；
5. 一个翻车场景；
6. 古人误会在哪里；
7. 一个可执行建议；
8. 折叠的“查看依据”。

用户界面不得出现：

- 四柱、十神、结构签名 ID；
- 内部分数、权重、候选排序；
- 规则编号、古籍页码；
- 出生日期、时间、城市；
- 回答明细；
- 准确率或科学效度声明。

## 8. 分享

分享卡只包含：

- 项目/候选产品名；
- Demo 结果名；
- 一句认领句；
- 一句翻车句；
- “测测你的”邀请。

分享卡不得包含任何出生资料、命盘、答案、内部候选或精确分数。

- PNG 在客户端从分享卡 DOM 生成。
- 分享链接是固定通用 URL `/?from=share`，不编码结果或个人信息。
- 无系统分享能力时允许下载 PNG 和复制链接。

## 9. 响应式与无障碍

- 移动端优先；390×844 可完整操作且主要按钮无需横向滚动。
- 1440×900 保持合理内容宽度，不把手机卡片无限拉宽。
- 键盘可完成城市选择、选项选择、返回与分享。
- 表单有显式 label；错误与状态变化可被辅助技术感知。
- 支持 `prefers-reduced-motion`。
- 颜色不是唯一状态提示。

## 10. 技术边界

- Next.js `16.2.12` App Router；
- React / React DOM `19.2.8`；
- TypeScript；
- `output: "export"`；
- `useReducer` 管理流程；
- 原生 CSS / CSS Modules；
- `@4n6h4x0r/stem-branch@0.8.0`；
- `html-to-image@1.11.13`；
- Vitest；
- Playwright Chromium。

禁止增加：

- API Route、Server Action、数据库、认证、分析 SDK、支付；
- Tailwind、UI 组件库、Zustand、Redux、XState；
- 服务端出生资料处理；
- 生产部署配置；
- 微信小程序或原生 App。

## 11. 测试

单元测试至少覆盖：

- 18 个固定夹具；
- 四签名成立、降级和关闭；
- 多盘聚合、排序和 A1/A2 去重；
- 三题路径、第四题门和四种关系；
- 修改回答与修改生辰的状态清理；
- 分享数据白名单。

E2E 至少覆盖：

- 390×844 标准输入 → 三题 → 完整结果 → 分享卡；
- 冲突输入 → 第四题 → `unresolved`；
- 返回修改答案后重新裁决；
- 修改生辰后旧答案清空；
- 通用分享链接回流；
- 1440×900 基本闭环；
- DST 不存在时间错误。

## 12. 交付验收

必须全部满足：

- 标准输入真实经过排盘、四签名、校准和结果，不使用预制最终结果绕过后台；
- 四种关系状态均可由测试夹具到达；
- 分享卡和分享链接通过字段白名单，不含敏感或后台字段；
- 首页初始构建块不包含排盘依赖；
- `lint`、`typecheck`、`test:unit`、`test:e2e`、`build` 全部通过；
- 静态导出产物生成；
- 只创建 Draft PR；
- 不部署，不把业务 PR 转 Ready，不合并。
