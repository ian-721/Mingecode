# M1-BR｜结果结构与文案门 v0.1

**状态：Schema Draft / Public Copy Frozen Off**  
**说明：本文件只定义结果字段，不提供获批前台文案。**

## 1. 结果不是单一类型标签

结果必须同时保留：

```text
命盘提出了什么候选
现实回答更支持哪条路线
二者是一致、适应、分情境还是未决
哪些修饰条件影响表现
```

不得把校准题答案伪装成“命盘本来就算出了全部内容”。

## 2. 结果数据结构

```yaml
result_version: m1br-result-0.1
chart_layer:
  primary_signature:
  secondary_signature:
  candidate_status:
  stability: stable | boundary_sensitive | insufficient
calibration_layer:
  primary_route:
  secondary_route:
  questions_used: 3 | 4
  answer_consistency: consistent | contextual | conflicting | insufficient
relationship_state: aligned | adapted | mixed | unresolved
modifiers:
  capacity:
  visibility:
  load:
  conflict:
  time_sensitivity:
content_blocks:
  title:
  chart_base:
  current_route:
  relationship_explanation:
  strength:
  cost:
  common_misread:
  practical_note:
  cultural_translation:
  usage_notice:
```

## 3. 各区块职责

### title

只负责识别，不得暗示等级、稀缺性、天赋或命定身份。

### chart_base

解释命盘为什么提出该候选，只用现代可理解的结构语言。传统术语放在可展开的来源层，不进入主段落。

### current_route

说明校准题反映的现实处理习惯。不得写成心理诊断或人格本质。

### relationship_explanation

根据 `aligned / adapted / mixed / unresolved` 解释两层关系。不得把不一致写成用户“活错了”、命盘被“压制”或题目在“修正命运”。

### strength / cost

必须来自同一机制的两面，不得把无关缺点拼进去。代价必须可以被用户明确否认。

### common_misread

只写他人可能根据可观察行为产生的误读，不预设用户总被误解，也不把责任全部推给环境。

### practical_note

只给一个具体动作。建议不是人格证据。

### cultural_translation

说明古代语言可能如何描述该结构，以及项目为何不沿用其中的等级、性别或宿命判断。

### usage_notice

明确文化研究与娱乐用途，不构成心理诊断或人生决策依据。

## 4. 当前文案裁决

```text
old_examples_approved: no
old_report_copy_approved: no
question_copy_approved: no
result_copy_approved: no
structure_labels_for_internal_use_only: yes
```

此前对话和 Draft PR #3 中出现的示例，只能视为研究过程材料，不得直接进入产品。

## 5. AI味高风险模式

后续前台文案必须专门审查以下模式：

1. **过度工整的反转句**：连续使用“你不是X，而是Y”；
2. **抽象名词堆叠**：边界、能量、秩序、内核、系统、机制同时出现；
3. **万能理解感**：无论用户怎样都能解释成立；
4. **假具体**：看似有场景，实际仍是抽象流程词；
5. **温柔缺点**：缺点只是“太认真、太负责、想得太深”；
6. **职业能力替代人格**：把表达、管理、产品、交付或协调能力写成命格；
7. **句式过度对称**：每段都按同一节奏排比，像模型模板；
8. **解释过满**：不给用户留任何自我判断空间；
9. **高声望包装**：把普通处理偏好写成稀缺优势；
10. **无来源的心理动机**：擅自解释恐惧、创伤、控制欲、被认可需求。

## 6. 文案编辑顺序

最终文案后置到结构和题目逻辑稳定后，按以下顺序完成：

1. 先写事实级短句；
2. 删除所有可由其他报告直接替换的泛句；
3. 加入明确不适用条件；
4. 检查是否只在职场成立；
5. 检查哪一份显得更聪明、更成熟或更负责；
6. 由未参与规则设计的人做自然度审读；
7. 由项目负责人完成最终语气裁决。

## 7. 文案锁定前置条件

前台文案只有在以下条件满足后才开始正式锁定：

- 四个结构签名是否保留已有明确决定；
- 十二题槽完成至少一轮可理解性检查；
- 混合裁决能稳定输出四种关系状态；
- 不再发生报告合并或签名增删；
- 结果字段已冻结；
- 有单独的语言风格样带获批。

## 8. 当前停止点

本阶段允许写字段名、编辑要求和风险清单；不允许为了展示效果提前生产完整示例结果。
