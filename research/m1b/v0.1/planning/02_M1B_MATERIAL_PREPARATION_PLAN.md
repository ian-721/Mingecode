# 02｜M1-B 材料准备计划

## 1. 阶段目标

把 M1-A 的候选研究包转成一套：

- 可逐条审查；
- 可由虚构夹具复核流程；
- 可生成等质报告；
- 可冻结并计算哈希；
- 可在未来独立授权后执行盲测；
- 一旦测试开始就不能按结果临时改写的材料系统。

M1-B 材料准备不等于开始真人测试，更不等于验证通过。

## 2. 建议目录

```text
research/m1b/v0.1/
  README.md
  00_GATE_AND_SCOPE.md
  01_M1A_TRACEABILITY_MATRIX.md
  sources/
    SOURCE_EDITION_AUDIT.md
    QUOTE_PAGE_REGISTER.md
  rules/
    RULE_DEFINITION_CONTRACT_v1.0.md
    RULE_REVIEW_MATRIX.md
    CORE_RULE_EXPERIMENT_SET_v0.1.md
    RULE_CONFLICT_TESTS.md
  time/
    SAMPLE_ELIGIBILITY_SPEC_v1.0.md
    TIME_METADATA_SCHEMA.md
    BOUNDARY_SENSITIVITY_CASES.md
  reports/
    REPORT_GENERATION_SPEC_v1.0.md
    REPORT_MASTER_P01.md
    REPORT_MASTER_P02.md
    REPORT_MASTER_P03.md
    REPORT_MASTER_P04.md
    REPORT_MASTER_P05.md
    REPORT_MASTER_P06.md
    REPORT_MASTER_P07.md
    REPORT_MASTER_P08.md
    REPORT_CLAIM_MAP.md
    REPORT_EQUIVALENCE_AUDIT.md
    DECOY_SELECTION_SPEC_v1.0.md
    BARNUM_CONTROL_v1.0.md
    PRETTY_CONTROL_v1.0.md
  fixtures/
    FIXTURE_CATALOG.md
    FX-01.md
    FX-02.md
    FX-03.md
    FX-04.md
    FX-05.md
    FX-06.md
    FX-07.md
    FX-08.md
    FIXTURE_EXPECTATIONS.md
    FIXTURE_DRY_RUN_REPORT.md
  validation/
    PREREGISTRATION_v1.0.md
    PARTICIPANT_INSTRUCTIONS_v1.0.md
    QUESTIONNAIRE_SCHEMA_v1.0.md
    RANDOMIZATION_SPEC.md
    BLIND_CODEBOOK.md
    PRIVACY_AND_RETENTION_PLAN.md
    FREEZE_MANIFEST.sha256
    DEVIATION_LOG.md
    FREEZE_CHECKLIST.md
  decision/
    HUMAN_TEST_AUTHORIZATION_GATE.md
```

## 3. B0—B6 执行顺序

### B0｜M1-A 候选快照入库

输入：17 个 M1-A 原始文件。  
输出：不可变快照、manifest、哈希、差异报告、审查决定。  
硬门：任何原文语义变化均停止。

### B1｜来源与规则逐条审查

工作量对象：6 维、8 原型、40 规则、12 翻译样带。  
每项必须得到以下状态之一：

```text
eligible_core
eligible_modifier
sensitivity_only
pending_source
pending_definition
excluded_m1b
```

输出：来源校勘表、规则审查矩阵、规则定义契约。  
硬门：未完成来源或定义审查的规则不能进入核心试验集。

### B2｜时间与样本资格冻结

输出主样本纳排表、敏感性附录规则和时间元数据字段。  
硬门：子时、节气边界、DST 歧义或多盘核心变化不能被强行压成一个确定结果。

### B3｜核心规则试验集与虚构夹具

先做规则级正例、近失、排除、反例、边界和重复家族测试，再做 8 个组合夹具。  
夹具只能验证“材料与裁决流程是否按定义运行”，不能作为命理有效性或真人反馈证据。

### B4｜报告母本、控制文本与错配协议

完成 8 份报告母本、声明追踪表、等质审计、巴纳姆控制、漂亮话控制和错配算法。  
硬门：任何一份报告在长度、正向强度、声望词或具体性上明显占优，都不能进入冻结。

### B5｜预注册 v1.0 与哈希冻结

冻结文本、算法、纳排、指标、阈值、随机化、盲法、隐私和偏离规则。  
输出统一 `FREEZE_MANIFEST.sha256`。  
硬门：冻结后改变核心内容必须升级版本并重新冻结；测试已启动时必须停止旧版本。

### B6｜真人测试授权门

只输出“是否具备被单独授权的条件”。  
不发送邀请、不接收真实出生信息、不生成真实参与者报告、不开放测试。

## 4. 角色与审查

| 工作 | 起草 | 必须审查 | 最终批准 |
|---|---|---|---|
| 原始包完整性 | 执行者 | 赵焱阳 | 赵焱阳 |
| 传统来源与页码 | 研究执行者 | 至少一次独立复核 | 赵焱阳 |
| 规则定义与入选 | 研究执行者 | 逐条人工审查 | 赵焱阳 |
| 报告文案等质 | 内容执行者 | 去名称横向比较 | 赵焱阳 |
| 视觉 | 本轮不制作完整系统 | 不适用 | 不适用 |
| 预注册与门槛 | 方法执行者 | 测试前完整复核 | 赵焱阳 |
| 真人测试启动 | 不在本轮 | 独立授权 | 赵焱阳 |

## 5. M1-B 完成定义

只有下列条件全部成立，才能称“材料准备完成”：

- M1-A 快照已完整、可哈希追溯；
- 40 条规则均有审查状态；
- 核心试验集和全部规则级夹具通过定义一致性检查；
- 8 个组合夹具没有暴露裁决歧义；
- 8 份报告通过等质审计；
- 控制文本、错配算法和随机化方案已冻结；
- 预注册 v1.0 及全部文件哈希已生成；
- 独立授权门仍为关闭状态。
