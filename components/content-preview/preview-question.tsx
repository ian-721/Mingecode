import type { ManifestationQuestion } from "@/lib/content-rebuild/preview-types";
import styles from "./content-preview.module.css";

type PreviewQuestionProps = {
  readonly question: ManifestationQuestion;
  readonly index: number;
  readonly onAnswer: (optionId: string) => void;
  readonly onSkip: () => void;
};

export function PreviewQuestion({
  question,
  index,
  onAnswer,
  onSkip,
}: PreviewQuestionProps) {
  return (
    <section className={`${styles.card} ${styles.question}`}>
      <span className={styles.statusChip}>核心结果保持不变</span>
      <p className={styles.eyebrow}>现实显化 · 可跳过 · {index + 1}/2</p>
      <h1>{question.prompt}</h1>
      <div className={styles.options}>
        {question.options.map((option) => (
          <button
            className={styles.option}
            type="button"
            key={option.id}
            onClick={() => onAnswer(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className={styles.buttonRow}>
        <button className={styles.linkButton} type="button" onClick={onSkip}>
          不答了，回到结果
        </button>
      </div>
      <p className={styles.footerNote}>
        这道题只选择同一结构中已批准的现实内容，不会改变命盘核心、候选范围或最终状态。
      </p>
    </section>
  );
}
