"use client";

import { useRef, useState } from "react";
import {
  createSharePayload,
  GENERIC_SHARE_PATH,
} from "@/lib/share";
import type { HybridVerdict } from "@/lib/types";

type ShareViewProps = {
  verdict: HybridVerdict;
  onClose: () => void;
};

export function ShareView({ verdict, onClose }: ShareViewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("");
  const payload = createSharePayload(verdict);

  async function downloadCard() {
    if (!cardRef.current) return;
    setStatus("正在生成图片…");
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: "#f3efe5",
      });
      const anchor = document.createElement("a");
      anchor.download = "mingecode-demo-result.png";
      anchor.href = dataUrl;
      anchor.click();
      setStatus("分享卡已生成。");
    } catch {
      setStatus("这次图片没生成出来，可以先复制分享链接。");
    }
  }

  async function copyLink() {
    const link = `${window.location.origin}${GENERIC_SHARE_PATH}`;
    try {
      await navigator.clipboard.writeText(link);
      setStatus("通用链接已复制，不含你的结果或出生资料。");
    } catch {
      setStatus(`请复制这个通用链接：${link}`);
    }
  }

  return (
    <section className="share-stage">
      <div className="share-heading">
        <button className="back-button" onClick={onClose} aria-label="返回结果">
          ←
        </button>
        <div>
          <p className="eyebrow">只分享愿意公开的那几句</p>
          <h1>出生资料和回答不会进卡片</h1>
        </div>
      </div>

      <div className="share-card-frame">
        <div className="share-card" ref={cardRef} data-testid="share-card">
          <div className="share-card-top">
            <span className="share-seal">命</span>
            <p>命格译码 · 研究候选 Demo</p>
          </div>
          <div className="share-card-glyph" aria-hidden="true">
            译
          </div>
          <p className="share-card-label">我的本次结果</p>
          <h2>{payload.resultName}</h2>
          <p className="share-recognition">{payload.recognition}</p>
          <div className="share-crash">
            <span>抓到一个翻车点</span>
            <p>{payload.crash}</p>
          </div>
          <div className="share-card-bottom">
            <strong>{payload.invitation}</strong>
            <span>不是算未来，是翻译你现在怎么做事。</span>
          </div>
        </div>
      </div>

      <div className="share-actions">
        <button className="button button-primary" onClick={downloadCard}>
          保存分享卡 PNG
        </button>
        <button className="button button-secondary" onClick={copyLink}>
          复制“测测你的”链接
        </button>
        <p className="share-status" aria-live="polite">
          {status}
        </p>
      </div>

      <div className="share-privacy-check">
        <span aria-hidden="true">✓</span>
        <p>
          卡片白名单：产品名、结果名、认领句、翻车句、邀请。没有日期、时间、城市、命盘、答案或内部排序。
        </p>
      </div>
    </section>
  );
}
