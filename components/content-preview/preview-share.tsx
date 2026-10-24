"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { createSafeSharePayload } from "@/lib/content-rebuild/content";
import type { ContentResult } from "@/lib/content-rebuild/preview-types";
import styles from "./content-preview.module.css";

type PreviewShareProps = {
  readonly content: ContentResult;
  readonly onClose: () => void;
};

export function PreviewShare({ content, onClose }: PreviewShareProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("");
  const safe = createSafeSharePayload(content);

  async function saveOrShare() {
    if (!cardRef.current) return;
    setStatus("正在生成分享卡…");
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "mingecode-content-preview.png", {
        type: "image/png",
      });

      if (
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: `${safe.productName}｜${safe.title}`,
          text: safe.recognition,
          files: [file],
        });
        setStatus("分享卡已交给系统分享面板。");
        return;
      }

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "mingecode-content-preview.png";
      link.click();
      setStatus("分享卡已保存。出生资料没有写进图片。");
    } catch {
      setStatus("这次图片生成没有成功，请稍后再试。结果仍可正常阅读。");
    }
  }

  return (
    <section className={`${styles.card} ${styles.shareWrap}`}>
      <div ref={cardRef} className={styles.shareCard} data-testid="preview-share-card">
        <div>
          <p className={styles.eyebrow}>{safe.productName} · 命盘主导预览</p>
          <span className={styles.statusChip}>{safe.stateLabel}</span>
          <h1>{safe.title}</h1>
          <p className={styles.shareQuote}>{safe.recognition}</p>
        </div>
        <div className={styles.sharePair}>
          <p><strong>高光</strong>{safe.highlight}</p>
          <p><strong>边界</strong>{safe.crash}</p>
        </div>
        <div className={styles.shareBottom}>
          <p>{safe.disclaimer}</p>
          <span>{safe.returnPath}</span>
        </div>
      </div>

      <div className={styles.buttonRow}>
        <button className={styles.primary} type="button" onClick={saveOrShare}>
          保存或分享图片
        </button>
        <button className={styles.secondary} type="button" onClick={onClose}>
          返回结果
        </button>
      </div>
      {status && <p className={styles.footerNote}>{status}</p>}
      <p className={styles.footerNote}>
        分享白名单只有产品名、结果状态、公开标题、结果句、高光、边界说明、声明与通用回流路径；不包含出生资料、四柱、候选 ID、问题答案或内部规则。
      </p>
    </section>
  );
}
