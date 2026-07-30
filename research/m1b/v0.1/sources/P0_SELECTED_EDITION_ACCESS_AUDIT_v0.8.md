# CRX-0.8｜P0 选定版本逐页访问审计

**状态：** Public-access attempt completed / Selected-edition page gate still open  
**范围：** `MC-R-012`、`014`、`018`、`026`、`027` 的 13 项页码与逐句引文  
**原则：** 找不到选定版本页面时必须保持空缺；不得用目录、搜索摘要、历史扫描或其他版次页码代填

## 1. 本轮目标

CRX-0.7 已用公版历史扫描确认相关章节和传统条件化讨论确实存在。本轮进一步尝试取得 CRX-0.6 选定版本的可复核页面，以关闭：

```text
page_start
page_end
quote_text
text_layer
variant_notes
verified_by
verified_at
```

## 2. 选定版本访问结果

| Source ID | 选定版本 | 已核验 | 公开可复核逐页页面 | 本轮结论 |
|---|---|---|---|---|
| SR-006A | 《秘本子平真诠：四库存目子平汇刊2》，华龄出版社，2014，ISBN 9787516905128 | 书目、篇幅、目录层级 | 未找到覆盖 13 项登记所需章节的完整公开页面 | `selected_page_blocked` |
| SR-006B | 《子平真诠评注》，中州古籍出版社，1994，ISBN 9787534812729 | 书目记录、总页数 | 可找到其他重排/电子整理本的目录页码，但不能证明与所选 1994 印本逐页一致 | `selected_page_blocked` |
| SR-007A | 《秘授滴天髓阐微：四库存目子平汇刊4》，华龄出版社，2014，ISBN 9787516905173 | 书目、277 页、章节目录 | 未找到所选点校本的逐页公开预览 | `selected_page_blocked` |
| SR-008/009A | 《增广汇校三命通会》上中下，华龄出版社，2019，ISBN 9787516914342 | 书目、3 册、1014 页、目录层级 | 未找到所选汇校本卷五、卷六相关页的公开逐页预览 | `selected_page_blocked` |
| SR-013A | 《新校命理探原：四库存目子平汇刊7》，华龄出版社，2016，ISBN 9787516906309 | CRX-0.6 书目登记与近代整理层定位 | 未找到所选版本的逐页公开预览 | `selected_page_blocked` |

## 3. 已发现但拒绝代填的材料

### 3.1 历史公版扫描

已确认：

- 民国《子平真诠》扫描；
- 1947《滴天髓阐微》扫描；
- 明刻或民国《三命通会》扫描。

用途仅为：章节定位、原典层存在性、避免二手摘要误引。它们不能替代 2014/2019 点校、汇校本的精确页码。

### 3.2 其他重排电子本

网络上存在 179 页、286 页、446 页等不同排版的《子平真诠评注》电子整理本。其章节顺序可用于交叉核对，但页码不能移植到 SR-006A/B。

### 3.3 商品目录与书目页面

商品页、WorldCat、Google Books 与图书馆目录可以证明书名、版次、ISBN、页数和章节目录，但不能证明某句文本所在页，也不能承担逐句异文校勘。

## 4. 13 项登记结果

```text
selected_modern_edition_page_verified: 0 / 13
selected_modern_edition_quote_transcribed: 0 / 13
historical_scan_crosscheck_available: yes
edition_identity_verified: yes
text_layer_contract_defined: yes
variant_collation_complete: no
P0_source_gate_closed: no
```

## 5. 关闭这道门所需的最小证据

每个登记项至少需要以下之一：

1. 对应选定版本的实体书页面照片；
2. 合法取得、页码完整的扫描或电子版页面；
3. 图书馆受控阅览中的页码、逐句转录和复核记录。

每张页面须能同时识别：书名/版次、页码、章节标题、引文上下文和文本层级。只给孤立句子或无页码截图不能关闭。

## 6. 本轮裁决

本轮已完成公开访问路径的尽职搜索，但没有取得足以关闭选定版本页码门的页面证据。保持 0/13 是正确结果，不以历史版次或网络重排页码代填。

```text
public_access_due_diligence: complete
selected_edition_evidence_obtained: no
source_gate_status: open
rule_upgrade_allowed: no
F1_lock_allowed_from_source_side: no
```
