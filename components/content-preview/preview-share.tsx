"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { ContentResult } from "@/lib/content-rebuild/preview-types";
import styles from "./content-preview.module.css";

type PreviewShareProps = {
  readonly content: ContentResult;
  readonly onClose: () => void;
};

export function PreviewShare({ content, onClose }: PreviewShareProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("");

  const safe =
    content.status === "established"
      ? {
          title: content.title,
          quote: content.recognitionLine,
          highlight: content.staticHighlight,
          crash: content.staticCrash,
        }
      : {
          title: content.title,
          quote: content.explanation,
          highlight: content.sharedStructure,
          crash: "边界不清时，不强行给出一个更好听的标签。",
        };

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
          title: `命格译码｜${safe.title}`,
          text: safe.quote,
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
      setStatus("这次图片生成没有成功，请稍后再试。");
    }
  }

  return (
    <section className={`${styles.card} ${styles.shareWrap}`}>
      <div ref={cardRef} className={styles.shareCard}>
        <div>
          <p className={styles.eyebrow}>命格译码 · 命盘主导预览</p>
          <h1>{safe.title}</h1>
          <p className={styles.shareQuote}>{safe.quote}</p>
        </div>
        <div>
          <p>高光：{safe.highlight}</p>
          <p>翻车：{safe.crash}</p>
        </div>
        <p>不是替你算命，而是重新翻译你。</p>
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
        分享卡只包含结果文案，不包含出生日期、时间、地点、四柱、候选 ID、问题答案或内部规则。
      </p>
    </section>
  );
}
