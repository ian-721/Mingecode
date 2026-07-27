# 时间与主样本资格规范 v1.0

**默认口径：** `civil_time_v1`  
**用途：** 未来盲测资格判定与敏感性分层；不实现排盘代码

## 主分析纳入

必须全部满足：

- 出生城市可解析到唯一 IANA zone；
- 出生时间至少精确到小时和分钟；
- 距时辰边界超过 30 分钟；
- 不处于 22:30—01:30；
- 距采用的节气时刻超过 120 分钟；
- 不处于未澄清的 DST 重复或不存在时间；
- 使用同一 `civil_time_v1`、tzdb 与节气数据版本；
- 所有合理候选盘的核心原型稳定。

## 仅敏感性附录

子时、模糊时间、时辰/节气边界、历史时区证据不足、DST 未澄清、多盘改变核心原型者不计入 48 人主门槛。

## 元数据结构

```text
time_convention_version: civil_time_v1
birth_local_datetime_input:
birth_time_precision: exact | approximate | range | unknown
birth_place_resolution:
iana_zone_id:
tzdb_version:
utc_offset_applied:
dst_status: standard | daylight | ambiguous | nonexistent | unknown
day_boundary_convention: pending_23 | pending_00 | not_applicable
solar_term_source_and_version:
distance_to_hour_boundary_minutes:
distance_to_solar_term_boundary_minutes:
candidate_chart_count:
stable_facts:
unstable_facts:
core_persona_stability: stable | auxiliary_only | core_changes | indeterminate
eligibility: main | sensitivity_only | excluded
exclusion_reason:
```

## 边界夹具

| Case | 输入情形 | 预期处理 |
|---|---|---|
| T-01 | 22:29 | 主样本可继续检查其他门 |
| T-02 | 22:30—01:30 | sensitivity_only |
| T-03 | 距时辰边界 29 分钟 | sensitivity_only |
| T-04 | 距时辰边界 31 分钟 | 可继续 |
| T-05 | 距节气 119 分钟 | sensitivity_only |
| T-06 | 距节气 121 分钟 | 可继续 |
| T-07 | DST ambiguous | 待澄清；未澄清不得主分析 |
| T-08 | 候选盘只改辅助特质 | main + sensitivity disclosure |
| T-09 | 候选盘改变核心原型 | sensitivity_only |

子时换日、早晚子时和最终节气月柱算法继续保持 Pending Verification。
