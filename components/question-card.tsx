import type {
  AnswerChoice,
  QuestionInstance,
} from "@/lib/types";

type QuestionCardProps = {
  instance: QuestionInstance;
  index: number;
  total: number;
  canGoBack: boolean;
  onBack: () => void;
  onAnswer: (selected: AnswerChoice) => void;
};

export function QuestionCard({
  instance,
  index,
  total,
  canGoBack,
  onBack,
  onAnswer,
}: QuestionCardProps) {
  const { question, reversed } = instance;
  const left = reversed ? question.right : question.left;
  const right = reversed ? question.left : question.right;

  return (
    <section className="stage-card question-stage">
      <div className="question-topline">
        <button
          className="back-button"
          onClick={onBack}
          disabled={!canGoBack}
          aria-label="返回上一题"
        >
          ←
        </button>
        <p>
          第 <strong>{index + 1}</strong> / {total} 题
        </p>
        <span>{index >= 3 ? "再确认一个场景" : "按第一反应选"}</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={index + 1}
      >
        <span style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      <p className="eyebrow">一个具体场景</p>
      <h1>{question.prompt}</h1>
      <div className="answer-grid">
        <button
          className="answer-option"
          onClick={() => onAnswer("left")}
        >
          <span>A</span>
          <strong>{left}</strong>
        </button>
        <button
          className="answer-option"
          onClick={() => onAnswer("right")}
        >
          <span>B</span>
          <strong>{right}</strong>
        </button>
      </div>
      <button
        className="uncertain-option"
        onClick={() => onAnswer("uncertain")}
      >
        {question.uncertain}
      </button>
      <p className="question-note">没有得分，也没有哪个选项更体面。</p>
    </section>
  );
}
