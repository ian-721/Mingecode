import { CONTENT_REBUILD_PREVIEW } from "@/data/content-rebuild-preview";
import type {
  ManifestationAnswer,
  ManifestationBlock,
  ManifestationQuestion,
} from "./preview-types";
import type { MechanismId } from "./types";

export function getManifestationQuestions(
  mechanism: MechanismId,
): readonly ManifestationQuestion[] {
  return CONTENT_REBUILD_PREVIEW[mechanism].questions;
}

export function selectManifestationBlocks(
  mechanism: MechanismId,
  answers: readonly ManifestationAnswer[],
): readonly ManifestationBlock[] {
  if (answers.length > 2) {
    throw new Error("A content preview accepts at most two manifestation answers");
  }

  const definition = CONTENT_REBUILD_PREVIEW[mechanism];
  const questionById = new Map(
    definition.questions.map((question) => [question.id, question]),
  );
  const blockById = new Map(definition.blocks.map((block) => [block.id, block]));
  const seenQuestions = new Set<string>();
  const selectedBlockIds: string[] = [];

  for (const answer of answers) {
    if (seenQuestions.has(answer.questionId)) {
      throw new Error(`Duplicate manifestation answer: ${answer.questionId}`);
    }
    seenQuestions.add(answer.questionId);

    const question = questionById.get(answer.questionId);
    if (!question) {
      throw new Error(`Unsupported manifestation question: ${answer.questionId}`);
    }
    const option = question.options.find(
      (candidate) => candidate.id === answer.optionId,
    );
    if (!option) {
      throw new Error(
        `Unsupported manifestation option: ${answer.questionId}/${answer.optionId}`,
      );
    }
    for (const blockId of option.blockIds) {
      if (!selectedBlockIds.includes(blockId)) selectedBlockIds.push(blockId);
    }
  }

  return selectedBlockIds.map((blockId) => {
    const block = blockById.get(blockId);
    if (!block) throw new Error(`Missing approved manifestation block: ${blockId}`);
    return block;
  });
}
