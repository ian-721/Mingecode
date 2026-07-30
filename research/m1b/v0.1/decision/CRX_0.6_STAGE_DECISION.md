# CRX-0.6｜定向机制补研究、P0校勘与报告重建阶段决定

**状态：** Completed as Draft Research Decision  
**真人测试：** NOT AUTHORIZED  
**业务开发：** NOT AUTHORIZED  
**完整视觉系统：** NOT AUTHORIZED

## 1. 本阶段完成

- P0五条规则完成正式版本候选选择、文本层级分离与章节定位；
- 建立13项引文/页码登记，全部诚实保持`PENDING_SCAN`；
- `MC-R-008`与`MC-R-013`完成工作定义与12个虚构夹具；
- 40条规则不再有`pending_definition`；
- 对探索、维护、长期积累进行定向机制研究；
- P01、P04、P08退出当前核心候选；
- P05降为辅助组合特质；
- 形成4个主机制候选并重建4份F0报告；
- 完成40个声明单元映射与等质预审；
- 未回写M1-A原始包和旧报告母本。

## 2. 规则状态

```text
eligible_core:        0
eligible_modifier:   14
sensitivity_only:    12
pending_source:      14
pending_definition:   0
```

`MC-R-008`只作支持路由门，新增证据为0；`MC-R-013`只作关键输出过滤反向候选，删除原D2自动效果。定义闭合不等于传统来源或现代行为有效。

## 3. 原型与维度裁决

```text
P01 先手试路人: retired from current M1-B core
P04 稳态维护者: retired from current M1-B core
P08 慢变量养成者: retired from current M1-B core
P05 接缝协调员: secondary composite only
```

原因不是名称或视觉问题，而是现有40条规则无法为探索、维护、长期积累提供独立、可执行、可反驳且不重复的结构家族。

原D3探索启动继续退出当前模型；不新增第41条规则补洞。

## 4. 当前四个主机制候选

```text
M-A1 输入先行
M-A2 公开成稿
M-B1 权限—标准协商
M-C1 完成—承诺
```

容量/支持、负荷、显隐与接缝桥接只作守门或辅助，不形成独立核心报告。

## 5. P0来源门

### 已完成

```text
edition_selection: complete
text_layer_separation: complete
chapter_anchor: complete
```

### 尚未完成

```text
page_register_verified: 0 / 13
quote_transcribed: 0 / 13
variant_collation: incomplete
modern_behavior_validation: no
```

因此012、014、018、026、027继续保持`pending_source`。不得根据搜索摘要或章节目录推测页码，也不得把后世评注写成原典原话。

## 6. 四份报告裁决

```text
reports_rebuilt: 4
claim_units: 40
traceable_or_modifier: 31
advice_only: 4
unsupported_or_partial: 5
reports_ready_for_F1: 0 / 4
```

自动结构检查：

```text
lengths: 321—335 compact characters
spread: 4.36%
six_section_structure: pass
explicit_banned_terms: pass
```

但五个声明仍需删除、降级或补充对象机制；隐性体面度、正向强度与近邻区分仍需遮名审查，所以不能进入F1。

## 7. M1-A归档门仍未关闭

当前PR仍没有完成17/17上传对象原始字节级快照与源/目标哈希。该问题独立于CRX-0.6研究进展：

```text
M1A_byte_identity_gate: open
PR_ready_for_merge: no
```

不能因为派生研究材料已经丰富，就跳过原始历史快照门。

## 8. 下一阶段建议

下一工作单元：

> **CRX-0.7｜P0逐页校勘、声明修复与四报告区分回归**

顺序：

1. 获取可复核印本/扫描，关闭13项页码与逐句引文；
2. 修复五个无充分依据声明；
3. 重跑012/013/014及020/038互斥；
4. 对R01—R04建立成对近邻区分矩阵；
5. 遮名执行体面度、正向强度与职业声望审计；
6. 若R01/R02或R02/R04仍无法区分，合并而非增加修辞；
7. 只有报告材料达到F1门，才讨论F2操作冻结。

## 9. 明确禁止

- 不启动真人测试或招募；
- 不接收真实出生资料；
- 不把四份报告称为正式人格；
- 不因P0版本选择完成而宣称规则已验证；
- 不恢复P01/P04/P08以满足数量或视觉需求；
- 不开始业务代码、排盘实现、数据库、API、部署或完整视觉系统；
- PR保持Draft，不Ready、不Merge。

## 10. 阶段门

```text
CRX_0_6_completed: yes
P0_edition_selection_completed: yes
P0_page_gate_closed: no
rule_definitions_open: 0
four_report_rebuild_completed: yes
report_F1_content_lock_ready: no
human_test_authorized: no
business_development_authorized: no
pr_ready_for_merge: no
```
