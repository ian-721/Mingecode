# 00｜M1-A 原始研究包“研究候选 v0.1”入库方案

## 1. 入库原则

### 1.1 原始包是历史快照，不是活文档

M1-A 原始研究包进入仓库后的身份为：

```text
stage: M1-A
status: Research Candidate
package_version: 0.1
validation_status: Not Human-Tested
content_mutability: Immutable Snapshot
```

它记录“2026-07-27 当时提出了什么候选、依据是什么、哪些地方尚未解决”。后续发现错误、补充页码、调整规则或改写报告，均不得回写原始快照。

### 1.2 不给原文件补 front matter

在每个原始 Markdown 顶部加状态声明，看似只是整理，实质会改变原文。状态、来源、哈希和审查结论统一放在快照外层的清单与包装 README 中。

### 1.3 修正采用旁路，不采用覆盖

- **原始错误或歧义：** 写入 `provenance/ERRATA.md`；
- **审查意见：** 写入 `review/M1A_REVIEW_DECISION.md`；
- **五项修正：** 写入 `review/M1B_CORRECTION_MAP_v0.1.md`；
- **真正修订后的规则、来源或报告：** 进入 `research/m1b/v0.1/`，并反向引用原始文件、Rule ID、Source ID 和 Disagreement ID。

## 2. 建议仓库结构

```text
research/
  candidates/
    m1a/
      v0.1/
        README.md                         # 新增包装说明，不冒充原始 README
        original/                         # 不可变原文区
          README(1).md
          M1A_EXECUTION_AUDIT.md
          TIME_BOUNDARY_RESEARCH.md
          PERSONALITY_DIMENSIONS_V0.1.md
          PERSONA_CANDIDATES_V0.1.md
          RULE_ONTOLOGY_V0.1.md
          RULE_CANDIDATES_V0.1.md
          TRADITIONAL_TRANSLATION_SAMPLE.md
          BLIND_TEST_PREREGISTRATION.md
          NAMING_TEST_PLAN.md
          VISUAL_BRIEF_CANDIDATE_A.md
          VISUAL_BRIEF_CANDIDATE_B.md
          MOODBOARD_TASKS_FOR_YUTING.md
          M1A_FREEZE_MATRIX.md
          SOURCE_REGISTER_V0.1.md
          DISAGREEMENT_LOG_V0.1.md
          UNRESOLVED_QUESTIONS_AND_NEXT_PROMPT.md
        provenance/
          SOURCE_BUNDLE_MANIFEST.yml
          SHA256SUMS
          INGEST_DIFF_REPORT.md
          ERRATA.md
        review/
          M1A_REVIEW_DECISION.md
          M1B_CORRECTION_MAP_v0.1.md
```

说明：原包为“1 份包级 README + 16 份索引文件”，合计 17 个原始文件。源文件名默认原样保留。若人工决定把 `README(1).md` 改名，必须在 manifest 中记录 `rename_only: true`、源名、目标名和内容哈希，且不得同时改变正文。

## 3. 清单字段

`SOURCE_BUNDLE_MANIFEST.yml` 对每个文件至少记录：

```yaml
package_id: mingecode-m1a-candidate-v0.1
source_conversation: "01｜命格译码｜排盘口径、人格维度与首批规则研究"
research_date: 2026-07-27
source_repo_baseline: 89e5f829256fba8bd05c5b49a90b59a767e0f136
status: Research Candidate
validation_status: Not Human-Tested
files:
  - source_filename: RULE_CANDIDATES_V0.1.md
    target_path: research/candidates/m1a/v0.1/original/RULE_CANDIDATES_V0.1.md
    encoding: UTF-8
    content_transform: none
    rename_only: false
    byte_length: null
    sha256: null
    reviewer: null
    reviewed_at: null
```

## 4. 入库执行顺序

1. **重新核验基线**：记录执行当时 `main` 完整 SHA、PR 状态和目录树；若与上一轮基线不同，先做冲突报告。
2. **建立文档分支**：建议 `docs/m1a-candidate-v0.1-ingest`；不得直接写 `main`。
3. **复制原文件字节**：不改标题、标点、链接、换行、错别字和状态词。
4. **生成 SHA-256**：对源包与目标文件分别计算；逐文件完全一致。
5. **生成差异报告**：列出新增文件、任何重命名、任何编码或换行差异；原则上应为“仅新增”。
6. **新增包装与审查文件**：这些是新文档，必须明显标记为“外层元数据/后续审查”，不得混入 `original/`。
7. **打开 Draft PR**：PR 标题建议 `docs: archive M1-A research candidate v0.1`。
8. **人工验收后再合并**：至少由赵焱阳确认原文、状态、文件数、哈希和阶段边界。
9. **合并后建立研究标签**：可选 annotated tag `research-m1a-v0.1`；标签说明必须写“not validated”。

## 5. Draft PR 硬门

PR 必须同时满足：

- 17/17 原始文件均已进入 `original/`；
- 源/目标逐文件 SHA-256 一致；
- 原始文件没有语义 diff；
- M0 文档、ADR、`docs/source/` 均未被覆盖；
- 没有 `package.json`、依赖、程序、数据库、API、CI、部署或配置变化；
- 没有把 `Candidate`、`Pending` 改成 `Accepted`；
- 包装 README 明写“未通过真人盲测”；
- PR 只保持 Draft，未获得单独授权前不得 Ready、merge 或发布。

任一项不满足，入库停止。

## 6. 静默改写的判定

以下行为即使出于“整理”，也属于改写，必须禁止或显式记录：

- 替换原型名称、维度名称或规则名称；
- 把低置信度改成中等置信度；
- 补写缺失来源却不保留原始状态；
- 删除看起来不成熟的候选；
- 把“建议”“可能”“候选”改成确定语气；
- 统一措辞时改变必要条件、排除条件或权重；
- 把旧的预注册阈值按本轮意见直接覆盖；
- 对原文进行批量格式化后声称“内容没变”却不提供字节差异。

## 7. 本轮状态

本文件只完成入库方案设计。未修改 GitHub、未创建分支、未打开 PR、未复制原始研究包。
