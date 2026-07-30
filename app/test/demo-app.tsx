"use client";

import Link from "next/link";
import { useEffect, useReducer } from "react";
import { BirthForm } from "@/components/birth-form";
import { BoundaryNotice, InlineError } from "@/components/notices";
import { QuestionCard } from "@/components/question-card";
import { ResultView } from "@/components/result-view";
import { ShareView } from "@/components/share-view";
import { resolveBirthInput } from "@/lib/astro";
import { demoReducer, initialDemoState } from "@/lib/reducer";
import type { BirthInput, DemoError } from "@/lib/types";

const ERROR_MESSAGES: Record<DemoError["code"], string> = {
  invalid_input: "还有一项没填对，请检查日期、时间和城市。",
  nonexistent_local_time:
    "这个当地时间刚好被夏令时跳过去了。请把时间前后调整一小时再试。",
  too_many_candidates:
    "这个时间碰到的边界太多，Demo 暂时不能在不丢信息的情况下处理。",
  calculation_failed: "这次计算没有顺利完成。出生资料没有被保存，请重新试一次。",
};

export function DemoApp() {
  const [state, dispatch] = useReducer(demoReducer, initialDemoState);

  async function handleBirthSubmit(input: BirthInput) {
    dispatch({ type: "resolve_started", input });
    const result = await resolveBirthInput(input);
    if (result.ok) {
      dispatch({ type: "resolve_succeeded", resolution: result.value });
    } else {
      dispatch({
        type: "resolve_failed",
        error: { code: result.error, message: ERROR_MESSAGES[result.error] },
      });
    }
  }

  useEffect(() => {
    if (state.step !== "transition") return;
    const timer = window.setTimeout(
      () => dispatch({ type: "show_result" }),
      360,
    );
    return () => window.clearTimeout(timer);
  }, [state.step]);

  const currentQuestion = state.questions[state.answers.length];

  return (
    <main className="test-shell">
      <header className="test-header">
        <Link className="brand-lockup" href="/">
          <span className="brand-seal" aria-hidden="true">
            命
          </span>
          <span>命格译码</span>
        </Link>
        <span className="demo-badge">Demo</span>
      </header>

      {state.step === "birth_input" && (
        <BirthForm onSubmit={handleBirthSubmit} />
      )}

      {state.step === "resolving" && (
        <section className="stage-card stage-center" aria-live="polite">
          <div className="pulse-mark" aria-hidden="true">
            译
          </div>
          <p className="eyebrow">正在排好底色</p>
          <h1>先把时间放回它出生的城市</h1>
          <p>真实计算通常很快，不演几十步神秘进度。</p>
        </section>
      )}

      {state.step === "boundary_notice" && state.chartResolution && (
        <BoundaryNotice
          notices={state.chartResolution.notices}
          onContinue={() => dispatch({ type: "continue_from_notice" })}
          onEdit={() => dispatch({ type: "edit_birth" })}
        />
      )}

      {state.step === "question" && currentQuestion && (
        <QuestionCard
          instance={currentQuestion}
          index={state.answers.length}
          total={state.questions.length === 4 ? 4 : 3}
          canGoBack={state.answers.length > 0}
          onBack={() => dispatch({ type: "back" })}
          onAnswer={(selected) => dispatch({ type: "answer", selected })}
        />
      )}

      {state.step === "transition" && (
        <section className="stage-card stage-center" aria-live="polite">
          <div className="result-transition" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="eyebrow">好了</p>
          <h1>把底色和你的现实走法放到一起</h1>
        </section>
      )}

      {state.step === "result" && state.verdict && state.chartResolution && (
        <ResultView
          verdict={state.verdict}
          chartResolution={state.chartResolution}
          onShare={() => dispatch({ type: "show_share" })}
          onRestart={() => dispatch({ type: "reset" })}
        />
      )}

      {state.step === "share" && state.verdict && (
        <ShareView
          verdict={state.verdict}
          onClose={() => dispatch({ type: "close_share" })}
        />
      )}

      {state.step === "error" && state.error && (
        <InlineError
          message={state.error.message}
          onRetry={() => dispatch({ type: "edit_birth" })}
        />
      )}
    </main>
  );
}
