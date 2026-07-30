import { QUESTIONS } from "@/data/questions";
import type {
  AnswerChoice,
  AnswerRecord,
  CalibrationVerdict,
  QuestionInstance,
  SignatureCandidate,
  SignatureId,
} from "@/lib/types";

const ORDER: SignatureId[] = ["SIG-A1", "SIG-A2", "SIG-B1", "SIG-C1"];

export function createInitialQuestions(
  candidates: SignatureCandidate[],
): QuestionInstance[] {
  if (candidates.length < 2) return [];
  const pairQuestions = questionsForPair(candidates[0].id, candidates[1].id);
  return pairQuestions.slice(0, 2).map((question, index) => ({
    instanceId: `${question.id}:initial:${index}`,
    question,
    reversed: false,
  }));
}

export function createThirdQuestion(
  candidates: SignatureCandidate[],
  answers: AnswerRecord[],
): QuestionInstance {
  const scores = scoreAnswers(answers);
  const leader = sortRoutesByScore(scores)[0] ?? candidates[0].id;
  const third = candidates.find(
    (candidate) =>
      candidate.id !== candidates[0].id && candidate.id !== candidates[1]?.id,
  );

  if (third) {
    const question = questionsForPair(leader, third.id)[0];
    return {
      instanceId: `${question.id}:third`,
      question,
      reversed: question.pair[0] !== leader,
    };
  }

  const fallback = questionsForPair(candidates[0].id, candidates[1].id)[0];
  return {
    instanceId: `${fallback.id}:third-reverse`,
    question: fallback,
    reversed: true,
  };
}

export function shouldAskFourth(
  candidates: SignatureCandidate[],
  answers: AnswerRecord[],
): boolean {
  if (answers.length < 3) return false;
  const uncertainCount = answers.filter(
    (answer) => answer.selected === "uncertain",
  ).length;
  const scores = [...scoreAnswers(answers).values()].sort((a, b) => b - a);
  const tied = (scores[0] ?? 0) === (scores[1] ?? -1);
  const onlyCandidates = candidates.every(
    (candidate) => candidate.level === "candidate",
  );
  return uncertainCount >= 2 || tied || onlyCandidates;
}

export function createFourthQuestion(
  candidates: SignatureCandidate[],
  answers: AnswerRecord[],
  existing: QuestionInstance[],
): QuestionInstance {
  const scores = scoreAnswers(answers);
  const routes = sortRoutesByScore(scores);
  const left = routes[0] ?? candidates[0].id;
  const right =
    routes.find((route) => route !== left) ??
    candidates.find((candidate) => candidate.id !== left)?.id ??
    candidates[0].id;
  const used = new Set(existing.map((instance) => instance.question.id));
  const available = questionsForPair(left, right);
  const question = available.find((item) => !used.has(item.id)) ?? available[0];

  return {
    instanceId: `${question.id}:fourth`,
    question,
    reversed: question.pair[0] !== left,
  };
}

export function recordAnswer(
  instance: QuestionInstance,
  selected: AnswerChoice,
): AnswerRecord {
  let supportedSignature: SignatureId | null = null;
  if (selected !== "uncertain") {
    const effective =
      instance.reversed
        ? selected === "left"
          ? "right"
          : "left"
        : selected;
    supportedSignature =
      effective === "left"
        ? instance.question.pair[0]
        : instance.question.pair[1];
  }

  return {
    questionInstanceId: instance.instanceId,
    questionId: instance.question.id,
    selected,
    supportedSignature,
    contextTag: instance.question.contextTag,
  };
}

export function decideVerdict(
  candidates: SignatureCandidate[],
  answers: AnswerRecord[],
): CalibrationVerdict {
  const chartRoute = candidates[0]?.id ?? null;
  if (candidates.length < 2 || answers.length < 3) {
    return {
      relation: "unresolved",
      chartRoute,
      realityRoutes: [],
      answerCount: answers.length,
    };
  }

  const scores = scoreAnswers(answers);
  const sorted = sortRoutesByScore(scores);
  const first = sorted[0];
  const second = sorted[1];
  const firstScore = first ? scores.get(first) ?? 0 : 0;
  const secondScore = second ? scores.get(second) ?? 0 : 0;

  if (
    answers.length >= 4 &&
    first &&
    second &&
    firstScore >= 2 &&
    firstScore === secondScore &&
    hasDistinctContexts(answers, first, second)
  ) {
    return {
      relation: "mixed",
      chartRoute,
      realityRoutes: [first, second],
      answerCount: answers.length,
    };
  }

  if (first && firstScore >= 2 && firstScore > secondScore) {
    return {
      relation: first === chartRoute ? "aligned" : "adapted",
      chartRoute,
      realityRoutes: [first],
      answerCount: answers.length,
    };
  }

  return {
    relation: "unresolved",
    chartRoute,
    realityRoutes: [],
    answerCount: answers.length,
  };
}

export function rebuildQuestions(
  candidates: SignatureCandidate[],
  answers: AnswerRecord[],
): QuestionInstance[] {
  const initial = createInitialQuestions(candidates);
  if (answers.length < 2) return initial;
  const third = createThirdQuestion(candidates, answers.slice(0, 2));
  const questions = [...initial, third];
  if (answers.length >= 3 && shouldAskFourth(candidates, answers.slice(0, 3))) {
    questions.push(
      createFourthQuestion(candidates, answers.slice(0, 3), questions),
    );
  }
  return questions;
}

export function scoreAnswers(
  answers: AnswerRecord[],
): Map<SignatureId, number> {
  const scores = new Map<SignatureId, number>();
  for (const answer of answers) {
    if (!answer.supportedSignature) continue;
    scores.set(
      answer.supportedSignature,
      (scores.get(answer.supportedSignature) ?? 0) + 1,
    );
  }
  return scores;
}

function sortRoutesByScore(scores: Map<SignatureId, number>): SignatureId[] {
  return [...scores.keys()].sort(
    (left, right) =>
      (scores.get(right) ?? 0) - (scores.get(left) ?? 0) ||
      ORDER.indexOf(left) - ORDER.indexOf(right),
  );
}

function questionsForPair(
  left: SignatureId,
  right: SignatureId,
) {
  const normalized = [left, right].sort(
    (a, b) => ORDER.indexOf(a) - ORDER.indexOf(b),
  );
  const questions = QUESTIONS.filter(
    (question) =>
      question.pair[0] === normalized[0] &&
      question.pair[1] === normalized[1],
  );
  if (questions.length !== 2) {
    throw new Error(`Missing question pair: ${left}/${right}`);
  }
  return questions;
}

function hasDistinctContexts(
  answers: AnswerRecord[],
  left: SignatureId,
  right: SignatureId,
): boolean {
  const leftContexts = new Set(
    answers
      .filter((answer) => answer.supportedSignature === left)
      .map((answer) => answer.contextTag),
  );
  const rightContexts = new Set(
    answers
      .filter((answer) => answer.supportedSignature === right)
      .map((answer) => answer.contextTag),
  );
  return (
    leftContexts.size > 0 &&
    rightContexts.size > 0 &&
    [...leftContexts].some((context) => !rightContexts.has(context))
  );
}
