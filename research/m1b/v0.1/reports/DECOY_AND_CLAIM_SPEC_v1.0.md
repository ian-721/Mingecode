# 错配与声明映射规范 v1.0

## 错配三类

1. 近邻错配：六维模式距离最小但核心原型不同；
2. 共享主维错配：共享主维，次维和翻车机制不同；
3. 远距等质错配：机制距离较大，但长度、正向强度、具体性和职业声望相等。

不得按性别、职业、关系或研究者熟悉度挑错配；同一错配重用次数必须设上限；并列按预注册固定顺序与随机 tie-break 处理。正式错配只能来自同版本匿名真实报告，本轮仅用虚构夹具检查算法。

## 声明映射

每个报告声明必须记录：

```text
claim_id
report_master_id
claim_text
claim_type: resource | cost | misunderstanding | behavior | advice
context
rule_ids
evidence_families
dimension
counterevidence
falsification_question
time_sensitivity
review_status
```

在 40 条规则完成 B1 审查前，`rule_ids` 和 `evidence_families` 不得伪造填写；报告母本只能保持 F0 Draft。
