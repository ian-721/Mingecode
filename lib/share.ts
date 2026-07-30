import { RESULT_COPY } from "@/data/copy";
import type { CalibrationVerdict, SignatureId } from "@/lib/types";

export type SharePayload = {
  product: "命格译码";
  resultName: string;
  recognition: string;
  crash: string;
  invitation: "测测你的";
};

export function createSharePayload(
  verdict: CalibrationVerdict,
): SharePayload {
  const route = getResultRoute(verdict);
  const copy = RESULT_COPY[route];
  return {
    product: "命格译码",
    resultName:
      verdict.relation === "unresolved" ? "这次先不定稿" : copy.name,
    recognition:
      verdict.relation === "unresolved"
        ? "有些习惯靠三道题分不清，先留一点余地。"
        : copy.recognition,
    crash:
      verdict.relation === "unresolved"
        ? "至少这回没有硬给你套一个万能标签。"
        : copy.crash,
    invitation: "测测你的",
  };
}

export function getResultRoute(verdict: CalibrationVerdict): SignatureId {
  return (
    verdict.realityRoutes[0] ??
    verdict.chartRoute ??
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
