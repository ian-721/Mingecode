import { QUESTIONS } from "@/data/questions";
import { SIGNATURE_ORDER } from "@/lib/signatures";
import type {
  AnswerChoice,
  AnswerRecord,
  ChartPrompt,
  HybridVerdict,
  QuestionInstance,
  SignatureId,
} from "@/lib/types";

export function createInitialQuestions(
  chartPrompt: ChartPrompt,
): QuestionInstance[] {
  const [first, second, third, fourth] = chartPrompt.routeOrder;
  return [
    createQuestionInstance(first, second, 0, "initial-1"),
    createQuestionInstance(third, fourth, 0, "initial-2"),
  ];
}

export function createThirdQuestion(
  chartPrompt: ChartPrompt,
  answers: AnswerRecord[],
): QuestionInstance {
  const [first, second, third, fourth] = chartPrompt.routeOrder;
  const firstWinner = answers[0]?.supportedSignature ?? null;
  const secondWinner = answers[1]?.supportedSignature ?? null;

  if (firstWinner && secondWinner) {
    return firstUnusedQuestion(
      firstWinner,
      secondWinner,
      answers,
      "third-winners",
    );
  }
  if (!firstWinner && secondWinner) {
    return firstUnusedQuestion(first, second, answers, "third-first-pair");
  }
  if (firstWinner && !secondWinner) {
    return firstUnusedQuestion(third, fourth, answers, "third-second-pair");
  }
  return firstUnusedQuestion(first, second, answers, "third-both-uncertain");
}

export function createNextQuestion(
  chartPrompt: ChartPrompt,
  answers: AnswerRecord[],
  existing: QuestionInstance[],
  stage: "fourth" | "fifth" | "sixth",
): QuestionInstance {
  const scores = scoreAnswers(answers);
  const routes = sortRoutesByScore(scores, chartPrompt.routeOrder);
  const used = new Set(existing.map((instance) => instance.question.id));
  const leader = routes[0];

  for (const route of routes.slice(1)) {
    const question = firstAvailableQuestion(leader, route, used);
    if (question) {
      return asInstance(question, leader, stage);
    }
  }

  for (let leftIndex = 0; leftIndex < routes.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < routes.length;
      rightIndex += 1
    ) {
      const left = routes[leftIndex];
      const right = routes[rightIndex];
      const question = firstAvailableQuestion(left, right, used);
      if (question) {
        return asInstance(question, left, stage);
      }
    }
  }

  throw new Error("All twelve approved question slots are exhausted");
}

export function shouldAskFifth(
  chartPrompt: ChartPrompt,
  answers: AnswerRecord[],
): boolean {
  if (answers.length !== 4) return false;
  const scores = scoreAnswers(answers);
  const routes = sortRoutesByScore(scores, chartPrompt.routeOrder);
  const firstScore = scores.get(routes[0]) ?? 0;
  const secondScore = scores.get(routes[1]) ?? 0;
  const uncertainCount = countUncertain(answers);

  return (
    firstScore === secondScore ||
    firstScore === 1 ||
    uncertainCount >= 2 ||
    hasContextSplitCandidate(answers)
  );
}

export function shouldAskSixth(
  chartPrompt: ChartPrompt,
  answers: AnswerRecord[],
): boolean {
  if (answers.length !== 5) return false;
  const scores = scoreAnswers(answers);
  const routes = sortRoutesByScore(scores, chartPrompt.routeOrder);
  const first = routes[0];
  const second = routes[1];
  const firstScore = scores.get(first) ?? 0;
  const secondScore = scores.get(second) ?? 0;

  return (
    firstScore === secondScore ||
    (firstScore - secondScore === 1 &&
      !hasDirectComparison(answers, first, second)) ||
    hasMixedCandidateMissingSecondSupport(answers, scores) ||
    countUncertain(answers) >= 3
  );
}

export function recordAnswer(
  instance: QuestionInstance,
  selected: AnswerChoice,
): AnswerRecord {
  let supportedSignature: SignatureId | null = null;
  if (selected !== "uncertain") {
    const effective = instance.reversed
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
    pair: instance.question.pair,
  };
}

export function decideVerdict(
  chartPrompt: ChartPrompt,
  answers: AnswerRecord[],
): HybridVerdict {
  if (answers.length < 4 || answers.length > 6) {
    throw new Error("Hybrid verdict requires four to six answers");
  }

  const scores = scoreAnswers(answers);
  const sortedRoutes = sortRoutesByScore(scores, chartPrompt.routeOrder);
  const mixedRoutes = findMixedRoutes(answers, scores, chartPrompt.routeOrder);
  const uncertainCount = countUncertain(answers);
  let relationship: HybridVerdict["relationship"] = "unresolved";
  let primaryRoute: SignatureId | null = null;
  let secondaryRoute: SignatureId | null = null;

  if (mixedRoutes) {
    [primaryRoute, secondaryRoute] = mixedRoutes;
    relationship = "mixed";
  } else if (uncertainCount < 3) {
    const first = sortedRoutes[0];
    const second = sortedRoutes[1];
    const firstScore = scores.get(first) ?? 0;
    const secondScore = scores.get(second) ?? 0;
    if (
      firstScore >= 2 &&
      firstScore > secondScore &&
      hasDirectComparison(answers, first, second)
    ) {
      primaryRoute = first;
      relationship =
        first === chartPrompt.primaryRoute ? "aligned" : "adapted";
    }
  }

  return {
    modelVersion: "m1br-hybrid-r2-0.1",
    chartPrompt,
    calibration: {
      questionIds: answers.map((answer) => answer.questionId),
      questionsUsed: answers.length as 4 | 5 | 6,
      routeSupport: Object.fromEntries(
        [...scores].filter(([, score]) => score > 0),
      ),
      uncertainCount,
    },
    reality: {
      primaryRoute,
      secondaryRoute,
    },
    relationship,
  };
}

export function rebuildQuestions(
  chartPrompt: ChartPrompt,
  answers: AnswerRecord[],
): QuestionInstance[] {
  const questions = createInitialQuestions(chartPrompt);
  if (answers.length < 2) return questions;

  questions.push(createThirdQuestion(chartPrompt, answers.slice(0, 2)));
  if (answers.length < 3) return questions;

  questions.push(
    createNextQuestion(chartPrompt, answers.slice(0, 3), questions, "fourth"),
  );
  if (answers.length < 4 || !shouldAskFifth(chartPrompt, answers.slice(0, 4))) {
    return questions;
  }

  questions.push(
    createNextQuestion(chartPrompt, answers.slice(0, 4), questions, "fifth"),
  );
  if (answers.length < 5 || !shouldAskSixth(chartPrompt, answers.slice(0, 5))) {
    return questions;
  }

  questions.push(
    createNextQuestion(chartPrompt, answers.slice(0, 5), questions, "sixth"),
  );
  return questions;
}

export function scoreAnswers(
  answers: AnswerRecord[],
): Map<SignatureId, number> {
  const scores = new Map<SignatureId, number>(
    SIGNATURE_ORDER.map((route) => [route, 0]),
  );
  for (const answer of answers) {
    if (!answer.supportedSignature) continue;
    scores.set(
      answer.supportedSignature,
      (scores.get(answer.supportedSignature) ?? 0) + 1,
    );
  }
  return scores;
}

function sortRoutesByScore(
  scores: Map<SignatureId, number>,
  routeOrder: SignatureId[],
): SignatureId[] {
  return [...SIGNATURE_ORDER].sort(
    (left, right) =>
      (scores.get(right) ?? 0) - (scores.get(left) ?? 0) ||
      routeOrder.indexOf(left) - routeOrder.indexOf(right),
  );
}

function createQuestionInstance(
  left: SignatureId,
  right: SignatureId,
  questionIndex: number,
  stage: string,
): QuestionInstance {
  const question = questionsForPair(left, right)[questionIndex];
  return asInstance(question, left, stage);
}

function firstUnusedQuestion(
  left: SignatureId,
  right: SignatureId,
  answers: AnswerRecord[],
  stage: string,
): QuestionInstance {
  const used = new Set(answers.map((answer) => answer.questionId));
  const question = firstAvailableQuestion(left, right, used);
  if (!question) {
    throw new Error(`Question pair exhausted: ${left}/${right}`);
  }
  return asInstance(question, left, stage);
}

function firstAvailableQuestion(
  left: SignatureId,
  right: SignatureId,
  used: Set<string>,
) {
  return questionsForPair(left, right).find(
    (question) => !used.has(question.id),
  );
}

function asInstance(
  question: (typeof QUESTIONS)[number],
  desiredLeft: SignatureId,
  stage: string,
): QuestionInstance {
  return {
    instanceId: `${question.id}:${stage}`,
    question,
    reversed: question.pair[0] !== desiredLeft,
  };
}

function questionsForPair(left: SignatureId, right: SignatureId) {
  const normalized = [left, right].sort(
    (a, b) => SIGNATURE_ORDER.indexOf(a) - SIGNATURE_ORDER.indexOf(b),
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

function countUncertain(answers: AnswerRecord[]): number {
  return answers.filter((answer) => answer.selected === "uncertain").length;
}

function hasDirectComparison(
  answers: AnswerRecord[],
  left: SignatureId,
  right: SignatureId,
): boolean {
  return answers.some(
    (answer) =>
      answer.pair.includes(left) &&
      answer.pair.includes(right),
  );
}

function hasContextSplitCandidate(answers: AnswerRecord[]): boolean {
  for (let leftIndex = 0; leftIndex < SIGNATURE_ORDER.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < SIGNATURE_ORDER.length;
      rightIndex += 1
    ) {
      if (
        contextsAreMutuallyDistinct(
          answers,
          SIGNATURE_ORDER[leftIndex],
          SIGNATURE_ORDER[rightIndex],
        ) &&
        pairQuestionsSplitOneEach(
          answers,
          SIGNATURE_ORDER[leftIndex],
          SIGNATURE_ORDER[rightIndex],
        )
      ) {
        return true;
      }
    }
  }
  return false;
}

function hasMixedCandidateMissingSecondSupport(
  answers: AnswerRecord[],
  scores: Map<SignatureId, number>,
): boolean {
  for (let leftIndex = 0; leftIndex < SIGNATURE_ORDER.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < SIGNATURE_ORDER.length;
      rightIndex += 1
    ) {
      const left = SIGNATURE_ORDER[leftIndex];
      const right = SIGNATURE_ORDER[rightIndex];
      const leftScore = scores.get(left) ?? 0;
      const rightScore = scores.get(right) ?? 0;
      if (
        leftScore >= 1 &&
        rightScore >= 1 &&
        (leftScore < 2 || rightScore < 2) &&
        contextsAreMutuallyDistinct(answers, left, right) &&
        pairQuestionsSplitOneEach(answers, left, right)
      ) {
        return true;
      }
    }
  }
  return false;
}

function findMixedRoutes(
  answers: AnswerRecord[],
  scores: Map<SignatureId, number>,
  routeOrder: SignatureId[],
): [SignatureId, SignatureId] | null {
  const eligible = SIGNATURE_ORDER.filter(
    (route) => (scores.get(route) ?? 0) >= 2,
  );
  if (eligible.length !== 2) return null;

  const [left, right] = eligible;
  if (
    !contextsAreMutuallyDistinct(answers, left, right) ||
    !pairQuestionsSplitOneEach(answers, left, right)
  ) {
    return null;
  }

  return [left, right].sort(
    (a, b) =>
      (scores.get(b) ?? 0) - (scores.get(a) ?? 0) ||
      routeOrder.indexOf(a) - routeOrder.indexOf(b),
  ) as [SignatureId, SignatureId];
}

function contextsAreMutuallyDistinct(
  answers: AnswerRecord[],
  left: SignatureId,
  right: SignatureId,
): boolean {
  const leftContexts = contextsFor(answers, left);
  const rightContexts = contextsFor(answers, right);
  return (
    leftContexts.size > 0 &&
    rightContexts.size > 0 &&
    [...leftContexts].some((context) => !rightContexts.has(context)) &&
    [...rightContexts].some((context) => !leftContexts.has(context))
  );
}

function contextsFor(
  answers: AnswerRecord[],
  route: SignatureId,
): Set<string> {
  return new Set(
    answers
      .filter((answer) => answer.supportedSignature === route)
      .map((answer) => answer.contextTag),
  );
}

function pairQuestionsSplitOneEach(
  answers: AnswerRecord[],
  left: SignatureId,
  right: SignatureId,
): boolean {
  const directAnswers = answers.filter(
    (answer) =>
      answer.pair.includes(left) &&
      answer.pair.includes(right) &&
      answer.supportedSignature !== null,
  );
  return (
    directAnswers.length === 2 &&
    new Set(directAnswers.map((answer) => answer.questionId)).size === 2 &&
    directAnswers.filter((answer) => answer.supportedSignature === left)
      .length === 1 &&
    directAnswers.filter((answer) => answer.supportedSignature === right)
      .length === 1
  );
}
