import { RELATION_COPY, RESULT_COPY } from "@/data/copy";
import { getResultRoute } from "@/lib/share";
import type {
  CalibrationVerdict,
  ChartResolution,
} from "@/lib/types";

type ResultViewProps = {
  verdict: CalibrationVerdict;
  chartResolution: ChartResolution;
  onShare: () => void;
  onRestart: () => void;
};

const MISREAD: Record<keyof typeof RESULT_COPY, string> = {
  "SIG-A1":
    "旧说法容易把“先收材料”写成犹豫。放到今天，它更像一种启动顺序；只有迟迟不出第一版时，才真的变成拖延。",
  "SIG-A2":
    "旧说法容易把公开表达写成爱出风头。现实里，你只是需要一个看得见的对象来继续判断。",
  "SIG-B1":
    "旧说法容易把边界和标准写成服从权威。你在意的其实是谁负责、哪套规则真正有效。",
  "SIG-C1":
    "旧说法容易把承诺写成命定责任。更现实的翻译是：你需要知道事情最后落到谁手里。",
};

export function ResultView({
  verdict,
  chartResolution,
  onShare,
  onRestart,
}: ResultViewProps) {
  const route = getResultRoute(verdict);
  const result = RESULT_COPY[route];
  const relation = RELATION_COPY[verdict.relation];
  const chartRoute = verdict.chartRoute
    ? RESULT_COPY[verdict.chartRoute]
    : null;
  const secondaryRoute = verdict.realityRoutes[1]
    ? RESULT_COPY[verdict.realityRoutes[1]]
    : null;
  const unresolved = verdict.relation === "unresolved";

  return (
    <article className="result-page">
      <section className="result-hero">
        <div className="result-kicker">
          <span>研究候选 Demo</span>
          <span>{relation.label}</span>
        </div>
        <div className="result-number" aria-hidden="true">
          译
        </div>
        <p className="eyebrow">你的本次结果</p>
        <h1>{unresolved ? "这次先不定稿" : result.name}</h1>
        <p className="result-recognition">
          {unresolved
            ? "几条近邻路线还没有稳定分开。先留一点余地，比硬把你塞进一个标签更有用。"
            : result.recognition}
        </p>
        <div className="crash-card">
          <span>容易翻车在</span>
          <p>
            {unresolved
              ? "今天的几道选择没有形成稳定领先。它不是“你太复杂”，只是这次信息还不够。"
              : result.crash}
          </p>
        </div>
        <div className="button-row result-actions">
          <button className="button button-primary" onClick={onShare}>
            生成分享卡
            <span aria-hidden="true">↗</span>
          </button>
          <button className="button button-ghost" onClick={onRestart}>
            再测一次
          </button>
        </div>
      </section>

      <section className="result-body">
        <div className="result-section section-accent">
          <p className="section-index">01</p>
          <div>
            <p className="eyebrow">平时怎么运行</p>
            <h2>{unresolved ? relation.label : result.operation}</h2>
            {secondaryRoute && (
              <p>
                另一条会在不同场景出现：{secondaryRoute.operation}
              </p>
            )}
          </div>
        </div>

        <div className="result-section">
          <p className="section-index">02</p>
          <div>
            <p className="eyebrow">生辰先看见的底色</p>
            <h2>{chartRoute?.name ?? "暂时没有稳定候选"}</h2>
            <p>
              {chartRoute?.recognition ??
                "出生时间提供的信息有限，所以这里不补一个看起来完整的答案。"}
            </p>
          </div>
        </div>

        <div className="result-section">
          <p className="section-index">03</p>
          <div>
            <p className="eyebrow">两者是什么关系</p>
            <h2>{relation.label}</h2>
            <p>{relation.description}</p>
          </div>
        </div>

        <div className="two-column-results">
          <section>
            <span className="mini-label">高光时刻</span>
            <h2>{unresolved ? "愿意先停一下" : result.highlight}</h2>
          </section>
          <section>
            <span className="mini-label">一个可用动作</span>
            <h2>
              {unresolved
                ? "换个时间状态重测，或接受今天就到这里。"
                : result.advice}
            </h2>
          </section>
        </div>

        <section className="misread-section">
          <p className="eyebrow">古人误会在哪里</p>
          <h2>结构不是判词，习惯也不是命运。</h2>
          <p>{MISREAD[route]}</p>
        </section>

        <details className="evidence-details">
          <summary>查看依据</summary>
          <div>
            <p>
              生辰只负责提出几条可能的处理路线；你回答的 {verdict.answerCount}{" "}
              个具体场景，再判断现实里哪条更常出现。
            </p>
            <p>{relation.description}</p>
            {chartResolution.notices.map((notice) => (
              <p key={notice}>{notice}</p>
            ))}
          </div>
        </details>
      </section>

      <footer className="result-footer">
        <p>文化研究与娱乐表达，不是预测、心理诊断或人生建议。</p>
        <p>demo-copy-v0.1 · 正式文案尚未批准</p>
      </footer>
    </article>
  );
}
