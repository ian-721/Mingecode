import type { ContentResult } from "@/lib/content-rebuild/preview-types";
import styles from "./content-preview.module.css";

type PreviewResultProps = {
  readonly content: ContentResult;
  readonly answersUsed: number;
  readonly onAsk: () => void;
  readonly onShare: () => void;
  readonly onReset: () => void;
};

export function PreviewResult({
  content,
  answersUsed,
  onAsk,
  onShare,
  onReset,
}: PreviewResultProps) {
  if (content.status !== "established") {
    return (
      <article className={`${styles.card} ${styles.nonEstablished}`}>
        <section className={styles.nonEstablishedHero}>
          <span className={styles.statusChip}>{content.stateLabel}</span>
          <p className={styles.eyebrow}>这是正式结果，不是错误页</p>
          <h1 className={styles.title}>{content.title}</h1>
          <p className={styles.lead}>{content.explanation}</p>
        </section>

        {content.candidates.length > 0 && (
          <section className={styles.candidateSection}>
            <p className={styles.sectionLabel}>
              {content.status === "unique_candidate"
                ? "最接近的方向"
                : "并列保留的方向"}
            </p>
            <div className={styles.candidateGrid}>
              {content.candidates.map((candidate) => (
                <article className={styles.candidateCard} key={candidate.title}>
                  <h2>{candidate.title}</h2>
                  <p>{candidate.structuralSignal}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className={styles.honestGrid}>
          <article>
            <p className={styles.sectionLabel}>现在可以确认</p>
            <h2>{content.commonGround}</h2>
          </article>
          <article>
            <p className={styles.sectionLabel}>这次不会越过</p>
            <h2>{content.differences}</h2>
          </article>
        </section>

        <div className={styles.buttonRow}>
          <button className={styles.secondary} onClick={onShare}>
            生成这份结果的安全分享卡
          </button>
          <button className={styles.linkButton} onClick={onReset}>
            换个时间重新输入
          </button>
        </div>
        <p className={styles.footerNote}>
          文化研究与娱乐表达，不是预测、心理诊断或人生建议。问题不会把这份结果改成已成立。
        </p>
      </article>
    );
  }

  return (
    <article className={styles.card}>
      <section className={styles.resultHero}>
        <div className={styles.resultMeta}>
          <span>{content.stateLabel}</span>
          <span>问题未参与裁决</span>
          <span>{answersUsed}/2 条现实补充</span>
        </div>
        <p className={styles.eyebrow}>你的命格译码</p>
        <h1 className={styles.resultTitle}>{content.title}</h1>
        <p className={styles.resultRecognition}>{content.recognition}</p>
        <blockquote className={styles.quote}>
          {content.recognitionLine}
        </blockquote>
      </section>

      <section className={styles.resultBody}>
        <ResultSection label="命盘入口" title="这张盘先说了什么">
          {content.chartEntry}
        </ResultSection>

        <ResultSection label="核心运行方式" title="你靠什么运转">
          {content.corePersonality}
        </ResultSection>

        <ResultSection label="内在矛盾" title="同一股力量的两面">
          {content.structuralTension}
        </ResultSection>

        <div className={styles.dual}>
          <section className={`${styles.block} ${styles.blockAccent}`}>
            <p className={styles.eyebrow}>高光时刻</p>
            <h3>{content.staticHighlight}</h3>
          </section>
          <section className={styles.block}>
            <p className={styles.eyebrow}>容易翻车在</p>
            <h3>{content.staticCrash}</h3>
          </section>
        </div>

        {content.manifestationBlocks.length > 0 && (
          <section className={styles.manifestation}>
            <p className={styles.eyebrow}>你确认的现实走法</p>
            {content.manifestationBlocks.map((block) => (
              <div key={block.id} className={styles.block}>
                <span className={styles.sectionLabel}>{block.eyebrow}</span>
                <h3>{block.title}</h3>
                <p>{block.body}</p>
              </div>
            ))}
          </section>
        )}

        <ResultSection label="常见误读" title="古人误会你了">
          {content.modernMisread}
        </ResultSection>

        <ResultSection label="反证" title="什么情况下这条判断不成立">
          {content.counterexample}
        </ResultSection>

        <div className={styles.buttonRow}>
          {answersUsed < 2 && (
            <button className={styles.primary} onClick={onAsk}>
              {answersUsed === 0
                ? "再问我一两句，把现实走法补上"
                : "再补最后一条现实走法"}
            </button>
          )}
          <button className={styles.secondary} onClick={onShare}>
            生成分享卡
          </button>
          <button className={styles.linkButton} onClick={onReset}>
            重新输入
          </button>
        </div>

        <p className={styles.footerNote}>
          核心结果只来自命盘结构。你回答的问题只补充现实显化，不改变核心机制。
          文化研究与娱乐表达，不是预测、心理诊断或人生建议。
        </p>
      </section>
    </article>
  );
}

function ResultSection({
  label,
  title,
  children,
}: {
  readonly label: string;
  readonly title: string;
  readonly children: string;
}) {
  return (
    <section className={styles.section}>
      <span className={styles.sectionLabel}>{label}</span>
      <div>
        <h2>{title}</h2>
        <p>{children}</p>
      </div>
    </section>
  );
}
