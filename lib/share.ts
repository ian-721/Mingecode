import { RESULT_COPY } from "@/data/copy";
import type { HybridVerdict, SignatureId } from "@/lib/types";

export type SharePayload = {
  product: "命格译码";
  resultName: string;
  recognition: string;
  crash: string;
  invitation: "测测你的";
};

export function createSharePayload(
  verdict: HybridVerdict,
): SharePayload {
  const route = getResultRoute(verdict);
  const copy = RESULT_COPY[route];
  return {
    product: "命格译码",
    resultName:
      verdict.relationship === "unresolved" ? "这次先不定稿" : copy.name,
    recognition:
      verdict.relationship === "unresolved"
        ? "有些习惯靠这几道题分不清，先留一点余地。"
        : copy.recognition,
    crash:
      verdict.relationship === "unresolved"
        ? "至少这回没有硬给你套一个万能标签。"
        : copy.crash,
    invitation: "测测你的",
  };
}

export function getResultRoute(verdict: HybridVerdict): SignatureId {
  return (
    verdict.reality.primaryRoute ??
    verdict.chartPrompt.primaryRoute ??
    "SIG-A1"
  );
}

export const GENERIC_SHARE_PATH = "/?from=share";

export function sharePayloadContainsSensitiveFields(
  payload: SharePayload,
): boolean {
  const forbidden = [
    "date",
    "time",
    "city",
    "pillars",
    "answers",
    "candidate",
    "score",
    "SIG-",
  ];
  const serialized = JSON.stringify(payload);
  return forbidden.some((field) => serialized.includes(field));
}
