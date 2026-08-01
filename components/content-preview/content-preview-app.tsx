"use client";

import Link from "next/link";
import { useState } from "react";
import { resolveBirthInput } from "@/lib/astro";
import { adaptChartResolution } from "@/lib/content-rebuild/adapter";
import { assembleContentResult } from "@/lib/content-rebuild/content";
import { evaluateContentRebuild } from "@/lib/content-rebuild";
import type {
  ContentPreviewStep,
  ManifestationAnswer,
  PreviewEvaluation,
} from "@/lib/content-rebuild/preview-types";
import type { BirthInput, ChartResolution } from "@/lib/types";
import { PreviewBirthForm } from "./preview-birth-form";
import { PreviewQuestion } from "./preview-question";
import { PreviewResult } from "./preview-result";
import { PreviewShare } from "./preview-share";
import styles from "./content-preview.module.css";

const ERROR_MESSAGES = {
  invalid_input: "还有一项没填对，请检查日期、时间和城市。",
  nonexistent_local_time:
    "这个当地时间刚好被夏令时跳过去了。请把时间前后调整一小时再试。",
  too_many_candidates:
    "这个时间碰到的边界太多，当前预览无法在不丢信息的情况下处理。",
  calculation_failed: "这次排盘没有顺利完成。出生资料没有被保存，请重新试一次。",
} as const;

export function ContentPreviewApp() {
  const [step, setStep] = useState<ContentPreviewStep>("birth_input");
  const [birthInput, setBirthInput] = useState<BirthInput | null>(null);
  const [resolution, setResolution] = useState<ChartResolution | null>(null);
  const [evaluation, setEvaluation] = useState<PreviewEvaluation | null>(null);
  const [answers, setAnswers] = useState<readonly ManifestationAnswer[]>([]);
  const [error, setError] = useState("");

  async function handleBirthSubmit(input: BirthInput) {
    setStep("resolving_birth");
    setBirthInput(input);
    setResolution(null);
    setEvaluation(null);
    setAnswers([]);
    setError("");

    const result = await resolveBirthInput(input);
    if (!result.ok) {
      setError(ERROR_MESSAGES[result.error]);
      setStep("error");
      return;
    }

    setResolution(result.value);
    if (result.value.notices.length > 0) {
      setStep("boundary_notice");
      return;
    }
    evaluateCore(input, result.value);
  }

  function evaluateCore(input: BirthInput, chartResolution: ChartResolution) {
    setStep("evaluating_core");
    try {
      const engineInput = adaptChartResolution(input, chartResolution);
      const engine = evaluateContentRebuild(engineInput);
      const content = assembleContentResult(engine);
      setEvaluation({ engine, content });
      setStep("core_result");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? `命盘事实转换没有通过：${cause.message}`
          : "命盘事实转换没有通过。",
      );
      setStep("error");
    }
  }

  function continueFromBoundary() {
    if (!birthInput || !resolution) return;
    evaluateCore(birthInput, resolution);
  }

  function startQuestions() {
    if (evaluation?.content.status !== "established") return;
    setStep("manifestation_question");
  }

  function answerQuestion(optionId: string) {
    if (evaluation?.content.status !== "established") return;
    const question = evaluation.content.questions[answers.length];
    if (!question) {
      setStep("core_result");
      return;
    }
    const nextAnswers = [
      ...answers,
      { questionId: question.id, optionId },
    ] as const;
    const content = assembleContentResult(evaluation.engine, nextAnswers);
    setAnswers(nextAnswers);
    setEvaluation({ engine: evaluation.engine, content });
    setStep(nextAnswers.length < 2 ? "manifestation_question" : "core_result");
  }

  function reset() {
    setStep("birth_input");
    setBirthInput(null);
    setResolution(null);
    setEvaluation(null);
    setAnswers([]);
    setError("");
  }

  const question =
    evaluation?.content.status === "established"
      ? evaluation.content.questions[answers.length]
      : undefined;

  return (
    <main className={styles.shell}>
      <div className={styles.frame}>
        <header className={styles.header}>
          <Link className={styles.brand} href="/">
            <span className={styles.seal} aria-hidden="true">命</span>
            <span>命格译码</span>
          </Link>
          <span className={styles.badge}>内容重建 Preview</span>
        </header>

        {step === "birth_input" && (
          <PreviewBirthForm onSubmit={handleBirthSubmit} />
        )}

        {(step === "resolving_birth" || step === "evaluating_core") && (
          <section className={`${styles.card} ${styles.stage} ${styles.center}`} aria-live="polite">
            <div>
              <div className={styles.spinner} aria-hidden="true" />
              <p className={styles.eyebrow}>
                {step === "resolving_birth" ? "正在排回出生现场" : "正在读取结构关系"}
              </p>
              <h1>
                {step === "resolving_birth"
                  ? "先把时间放回它出生的城市"
                  : "这次不让问题替命盘投票"}
              </h1>
            </div>
          </section>
        )}

        {step === "boundary_notice" && resolution && (
          <section className={`${styles.card} ${styles.stage}`}>
            <p className={styles.eyebrow}>边界说明</p>
            <h1 className={styles.title}>先把不确定性摆在桌上。</h1>
            <p className={styles.lead}>
              后台会保留合理候选。候选改变核心时，结果会明确写成边界敏感，不会硬选一个。
            </p>
            <ul className={styles.noticeList}>
              {resolution.notices.map((notice) => (
                <li key={notice}>{notice}</li>
              ))}
            </ul>
            <div className={styles.buttonRow}>
              <button className={styles.primary} onClick={continueFromBoundary}>
                保留边界，继续译码
              </button>
              <button className={styles.secondary} onClick={reset}>
                返回修改
              </button>
            </div>
          </section>
        )}

        {step === "core_result" && evaluation && (
          <PreviewResult
            content={evaluation.content}
            answersUsed={answers.length}
            onAsk={startQuestions}
            onShare={() => setStep("share")}
            onReset={reset}
          />
        )}

        {step === "manifestation_question" && question && (
          <PreviewQuestion
            question={question}
            index={answers.length}
            onAnswer={answerQuestion}
            onSkip={() => setStep("core_result")}
          />
        )}

        {step === "share" && evaluation && (
          <PreviewShare
            content={evaluation.content}
            onClose={() => setStep("core_result")}
          />
        )}

        {step === "error" && (
          <section className={`${styles.card} ${styles.stage}`}>
            <p className={styles.eyebrow}>这次没有硬猜</p>
            <h1 className={styles.title}>结果没有顺利成立。</h1>
            <p className={`${styles.lead} ${styles.error}`} role="alert">
              {error}
            </p>
            <div className={styles.buttonRow}>
              <button className={styles.primary} onClick={reset}>
                返回重新输入
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
