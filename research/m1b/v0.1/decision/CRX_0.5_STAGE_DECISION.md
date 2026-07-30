# CRX-0.5｜跨批次回归与候选收束阶段决定

**状态：** Completed as Draft Research Decision  
**真人测试：** NOT AUTHORIZED  
**业务开发：** NOT AUTHORIZED

## 1. 本阶段完成

- 40条规则完成跨批次互斥、覆盖、对象和依赖簇回归；
- 六条`pending_definition`完成继续定义/降级裁决；
- 12条`pending_source`建立P0/P1/P2校勘优先级；
- 六维独立性完成第一次正式诊断；
- 原24槽停止机械填充，重组为8个候选机制状态、4个候选反向状态、2个敏感性关闭状态和6个治理门；
- 八份报告完成六区块级规则追踪预审；
- 未改写原M1-A和原F0报告母本，修正均以旁路审计文件记录。

## 2. 关键结论

### 六维模型不进入下一冻结层

现有40条规则不足以给六个维度各提供两个独立家族。D3没有可释放家族；D2/D4/D5端点高度重叠；D6只有容量与负荷守门。

因此六维模型状态为：

```text
not_advanced / redesign_required
```

### 工作结构改为三主机制域

```text
M-A 输入—输出路由
M-B 参照—约束接口
M-C 完成—承诺路由
```

容量/负荷、显隐和关系/时间只作为修饰或守门，不增加核心人格证据。

### 八原型不能进入F1

```text
Conditional Candidate: P03, P06, P07
Hold/Narrow or Secondary: P02, P05
Hold/Redesign: P01, P04, P08
```

当前没有任何一份报告可以锁定为真人盲测材料。

## 3. 规则总状态

```text
eligible_modifier: 14
sensitivity_only: 12
pending_source: 12
pending_definition: 2
eligible_core: 0
```

`MC-R-035`、`036`、`040`继续作为`sensitivity_only`中的核心硬排除子集。

## 4. 下一阶段建议

下一阶段命名：

> **CRX-0.6｜定向机制补研究、来源P0校勘与报告重建**

顺序：

1. 先校勘P0五条：012、014、018、026、027；
2. 完成008、013两个剩余定义合同；
3. 不预设必须保留探索、维护、长期积累原型，做定向机制研究；
4. 若找不到独立家族，正式淘汰P01/P04/P08；
5. 围绕三个主机制域重写P03/P06/P07；
6. 将P02收窄为输入侧候选，将P05降为辅助组合特质；
7. 形成6个以内的新候选报告后，再做10声明单元映射和等质审计；
8. 只有材料达到F1门，才讨论F2操作冻结。

## 5. 明确禁止

- 不因原型名称、视觉简报或传播潜力保留无机制报告；
- 不用新规则临时补齐D3/D6；
- 不将传统来源关闭误称为现代人格验证；
- 不招募、不接收真人出生资料、不开放问卷；
- 不开始业务代码、排盘实现、数据库、API、部署或完整视觉系统；
- PR继续保持Draft，不Ready、不Merge。

## 6. 当前阶段门

```text
CRX_0_5_completed: yes
40_rule_cross_regression_completed: yes
six_dimension_model_advanced: no
report_F1_content_lock_ready: no
pr_ready_for_merge: no
human_test_authorized: no
business_development_authorized: no
```
