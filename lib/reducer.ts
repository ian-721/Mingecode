import {
  createInitialQuestions,
  createNextQuestion,
  createThirdQuestion,
  decideVerdict,
  rebuildQuestions,
  recordAnswer,
  shouldAskFifth,
  shouldAskSixth,
} from "@/lib/calibration";
import type {
  AnswerChoice,
  BirthInput,
  ChartResolution,
  DemoError,
  DemoState,
} from "@/lib/types";

export const initialDemoState: DemoState = {
  step: "birth_input",
  birthInput: null,
  chartResolution: null,
  questions: [],
  answers: [],
  verdict: null,
  error: null,
};

export type DemoAction =
  | { type: "resolve_started"; input: BirthInput }
  | { type: "resolve_succeeded"; resolution: ChartResolution }
  | { type: "resolve_failed"; error: DemoError }
  | { type: "continue_from_notice" }
  | { type: "answer"; selected: AnswerChoice }
  | { type: "back" }
  | { type: "show_result" }
  | { type: "show_share" }
  | { type: "close_share" }
  | { type: "edit_birth" }
  | { type: "reset" };

export function demoReducer(
  state: DemoState,
  action: DemoAction,
): DemoState {
  switch (action.type) {
    case "resolve_started":
      return {
        ...initialDemoState,
        step: "resolving",
        birthInput: action.input,
      };
    case "resolve_succeeded": {
      const questions = createInitialQuestions(
        action.resolution.chartPrompt,
      );
      return {
        ...state,
        step:
          action.resolution.notices.length > 0
            ? "boundary_notice"
            : "question",
        chartResolution: action.resolution,
        questions,
        answers: [],
        verdict: null,
        error: null,
      };
    }
    case "resolve_failed":
      return { ...state, step: "error", error: action.error };
    case "continue_from_notice":
      return { ...state, step: "question" };
    case "answer":
      return answerCurrentQuestion(state, action.selected);
    case "back": {
      if (!state.chartResolution || state.answers.length === 0) {
        return state;
      }
      const answers = state.answers.slice(0, -1);
      return {
        ...state,
        step: "question",
        answers,
        questions: rebuildQuestions(
          state.chartResolution.chartPrompt,
          answers,
        ),
        verdict: null,
      };
    }
    case "show_result":
      return { ...state, step: "result" };
    case "show_share":
      return { ...state, step: "share" };
    case "close_share":
      return { ...state, step: "result" };
    case "edit_birth":
    case "reset":
      return initialDemoState;
    default:
      return state;
  }
}

function answerCurrentQuestion(
  state: DemoState,
  selected: AnswerChoice,
): DemoState {
  const resolution = state.chartResolution;
  const current = state.questions[state.answers.length];
  if (!resolution || !current) return state;

  const answers = [...state.answers, recordAnswer(current, selected)];
  if (answers.length < state.questions.length) {
    return { ...state, answers };
  }

  if (answers.length === 2) {
    return {
      ...state,
      answers,
      questions: [
        ...state.questions,
        createThirdQuestion(resolution.chartPrompt, answers),
      ],
    };
  }

  if (answers.length === 3) {
    return {
      ...state,
      answers,
      questions: [
        ...state.questions,
        createNextQuestion(
          resolution.chartPrompt,
          answers,
          state.questions,
          "fourth",
        ),
      ],
    };
  }

  if (
    answers.length === 4 &&
    shouldAskFifth(resolution.chartPrompt, answers)
  ) {
    return {
      ...state,
      answers,
      questions: [
        ...state.questions,
        createNextQuestion(
          resolution.chartPrompt,
          answers,
          state.questions,
          "fifth",
        ),
      ],
    };
  }

  if (
    answers.length === 5 &&
    shouldAskSixth(resolution.chartPrompt, answers)
  ) {
    return {
      ...state,
      answers,
      questions: [
        ...state.questions,
        createNextQuestion(
          resolution.chartPrompt,
          answers,
          state.questions,
          "sixth",
        ),
      ],
    };
  }

  return {
    ...state,
    step: "transition",
    answers,
    verdict: decideVerdict(resolution.chartPrompt, answers),
  };
}
