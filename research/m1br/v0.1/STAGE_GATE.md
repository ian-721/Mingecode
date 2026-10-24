# M1-BR｜阶段门 v0.1

**状态：Planning Complete / Materials Drafted**

## 已完成

- 混合模型方向已通过 ADR-0009 冻结为研究方向；
- 四个结构签名合同已建立；
- 十二个行为校准题槽已建立；
- 默认三题、最多四题的自适应流程已定义；
- `aligned / adapted / mixed / unresolved` 四种结果关系已定义；
- 结果数据结构和语言风险门已建立；
- 8—12人探索计划已准备。

## 尚未完成

- 十二道题的最终自然语言措辞；
- 四类结果的正式用户文案；
- 题目与结果的独立自然度审读；
- 结构签名的最终命理条件回归；
- 任何真人探索；
- 任何业务实现。

## 当前裁决

```text
hybrid_direction_accepted: yes
signature_contracts_drafted: 4 / 4
question_slots_drafted: 12 / 12
adaptive_flow_defined: yes
result_schema_defined: yes
public_copy_approved: no
exploratory_test_material_ready: no
exploratory_test_authorized: no
business_code_authorized: no
complete_visual_system_authorized: no
```

## 下一工作单元

下一工作单元只做内容工程，不扩模型：

1. 将十二个题槽写成自然、短、无评价倾向的题目；
2. 建立两套不同语气样带，不一次性写完整产品；
3. 对题目执行去AI味、体面度和场景覆盖审读；
4. 为四种关系状态各写一份短结果骨架；
5. 由项目负责人确认语气后，才准备探索材料。

若题目文案尚未获批，不得借结构示例直接进入界面。

## PR关系

- Draft PR #3：保留纯八字人格推导路线的研究记录；不继续扩写，不作为正式规则库合并。
- 本分支：只承载混合译码重构基线。
- 两个 PR 均不得因本阶段完成而自动 Ready 或 Merge。
