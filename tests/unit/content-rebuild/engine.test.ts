import { describe, expect, it } from "vitest";
import fixtureJson from "@/research/content-rebuild/v0.4/fixtures/archetype-fixtures.v0.2.json";
import {
  evaluateContentRebuild,
  evaluateSingleCandidate,
  type CandidateEvaluation,
  type ChartCandidate,
  type ChartFacts,
  type EvidenceStates,
  type FinalState,
  type MechanismId,
  type NodeAvailabilityByRole,
  type RelationEffectiveness,
  type StaticRuleEngineInput,
} from "@/lib/content-rebuild";

interface ExpectedProfile {
  readonly nodeAvailability: NodeAvailabilityByRole;
  readonly rawRelationCount: number;
  readonly relationEffectivenessCounts: Readonly<
    Record<RelationEffectiveness, number>
  >;
  readonly criticalRelationStates: Readonly<
    Record<string, RelationEffectiveness>
  >;
  readonly evidence: EvidenceStates;
  readonly dimensions: CandidateEvaluation["dimensions"];
  readonly evidenceFamilies: readonly string[];
  readonly originClusterKeys: readonly string[];
  readonly tension: CandidateEvaluation["tension"];
  readonly exclusion: boolean;
  readonly coreMechanism: MechanismId | null;
  readonly finalState: FinalState;
}

interface FixtureCase {
  readonly id: string;
  readonly coverageMechanism: MechanismId;
  readonly type: string;
  readonly input: {
    readonly candidates: readonly {
      readonly candidateId: string;
      readonly factSetRef: string;
    }[];
    readonly manifestationAnswers?: readonly {
      readonly questionId: string;
      readonly answer: string;
    }[];
  };
  readonly expected: {
    readonly coreMechanism: MechanismId | null;
    readonly finalState: FinalState;
    readonly manifestationVariant?: "unselected" | "reverse";
  };
}

interface FixtureDocument {
  readonly timeConventionVersion: "civil_time_v1";
  readonly factSets: Readonly<Record<string, ChartFacts>>;
  readonly expectedProfiles: Readonly<Record<string, ExpectedProfile>>;
  readonly fixtures: readonly FixtureCase[];
}

const fixtureDocument = fixtureJson as unknown as FixtureDocument;

describe("content-rebuild v0.4 frozen fact profiles", () => {
  it("reproduces the complete 16/16 profile chain without reading expected as input", () => {
    const profileIds = Object.keys(fixtureDocument.factSets).sort();
    expect(profileIds).toHaveLength(16);

    for (const profileId of profileIds) {
      const expected = fixtureDocument.expectedProfiles[profileId];
      const result = evaluateSingleCandidate({
        candidateId: profileId,
        facts: fixtureDocument.factSets[profileId],
      });
      const criticalRelationStates = Object.fromEntries(
        Object.keys(expected.criticalRelationStates).map((relationKey) => [
          relationKey,
          result.closure.relations.find(
            (relation) => relation.canonicalRelationKey === relationKey,
          )?.effectiveness,
        ]),
      );

      expect(result.nodeAvailability, profileId).toEqual(
        expected.nodeAvailability,
      );
      expect(result.closure.rawRelationCount, profileId).toBe(
        expected.rawRelationCount,
      );
      expect(result.closure.relationEffectivenessCounts, profileId).toEqual(
        expected.relationEffectivenessCounts,
      );
      expect(criticalRelationStates, profileId).toEqual(
        expected.criticalRelationStates,
      );
      expect(result.closure.diagnostics, profileId).toEqual({
        invalidRoleRelationCount: 0,
        missingDeterministicRelationCount: 0,
        duplicateRelationAfterSourceDedupeCount: 0,
        unexpectedManuallySelectedRelationCount: 0,
      });
      expect(result.evidence, profileId).toEqual(expected.evidence);
      expect(result.dimensions, profileId).toEqual(expected.dimensions);
      expect(result.evidenceFamilies, profileId).toEqual(
        expected.evidenceFamilies,
      );
      expect(result.originClusterKeys, profileId).toEqual(
        expected.originClusterKeys,
      );
      expect(result.tension, profileId).toBe(expected.tension);
      expect(result.exclusion, profileId).toBe(expected.exclusion);
      expect(result.coreMechanism, profileId).toBe(expected.coreMechanism);
      expect(result.finalState, profileId).toBe(expected.finalState);
    }
  });

  it("generates exactly n(n-1)/2 canonical relations for all profiles", () => {
    for (const [profileId, facts] of Object.entries(
      fixtureDocument.factSets,
    )) {
      const result = evaluateSingleCandidate({ candidateId: profileId, facts });
      const expectedCount =
        (facts.occurrences.length * (facts.occurrences.length - 1)) / 2;

      expect(result.closure.rawRelationCount, profileId).toBe(expectedCount);
      expect(result.closure.expectedRelationCount, profileId).toBe(
        expectedCount,
      );
      expect(
        new Set(
          result.closure.relations.map(
            (relation) => relation.canonicalRelationKey,
          ),
        ).size,
        profileId,
      ).toBe(expectedCount);
    }
  });
});

describe("content-rebuild v0.4 frozen fixtures", () => {
  it("reproduces all 32/32 unique final outcomes", () => {
    expect(fixtureDocument.fixtures).toHaveLength(32);

    for (const fixture of fixtureDocument.fixtures) {
      const result = evaluateContentRebuild(inputForFixture(fixture));

      expect(result.coreMechanism, fixture.id).toBe(
        fixture.expected.coreMechanism,
      );
      expect(result.finalState, fixture.id).toBe(fixture.expected.finalState);
      if (fixture.expected.manifestationVariant) {
        expect(result.manifestationVariant, fixture.id).toBe(
          fixture.expected.manifestationVariant,
        );
      }
    }
  });

  it("keeps all answers_reverse core layers identical to their positive case", () => {
    for (const mechanism of ["A01", "A02", "A03", "A04"] as const) {
      const positive = fixtureDocument.fixtures.find(
        (fixture) =>
          fixture.coverageMechanism === mechanism && fixture.type === "positive",
      );
      const reverse = fixtureDocument.fixtures.find(
        (fixture) =>
          fixture.coverageMechanism === mechanism &&
          fixture.type === "answers_reverse",
      );
      if (!positive || !reverse) throw new Error(`Missing ${mechanism} fixture`);

      const positiveResult = evaluateContentRebuild(inputForFixture(positive));
      const reverseResult = evaluateContentRebuild(inputForFixture(reverse));
      const { manifestationVariant: positiveVariant, ...positiveCore } =
        positiveResult;
      const { manifestationVariant: reverseVariant, ...reverseCore } =
        reverseResult;

      expect(positiveCore, mechanism).toEqual(reverseCore);
      expect(positiveVariant, mechanism).toBe("unselected");
      expect(reverseVariant, mechanism).toBe("reverse");
    }
  });

  it("aggregates same-core candidates without extra votes and marks changed cores boundary-sensitive", () => {
    const stable = fixtureById("CF-006");
    const changing = fixtureById("CF-007");

    const stableResult = evaluateContentRebuild(inputForFixture(stable));
    const changingResult = evaluateContentRebuild(inputForFixture(changing));

    expect(stableResult.coreMechanism).toBe("A01");
    expect(stableResult.finalState).toBe("established");
    expect(stableResult.candidateResults).toHaveLength(2);
    expect(changingResult.coreMechanism).toBeNull();
    expect(changingResult.finalState).toBe("boundary_sensitive");
    expect(changingResult.evidence.E6).toBe("boundary_sensitive");
  });
});

describe("relation closure and failure gates", () => {
  it("dedupes root and relation sources by origin cluster before competition", () => {
    const base = fixtureDocument.factSets.F13;
    const facts: ChartFacts = {
      ...base,
      occurrences: [
        ...base.occurrences,
        {
          role: "input",
          kind: "hidden",
          objectKey: "f13-i-alias",
          originClusterKey: "d2",
          hiddenStemProportion: 0.6,
          rootOccurrence: true,
        },
      ],
    };
    const result = evaluateSingleCandidate({ candidateId: "dedupe", facts });
    const inputSubjectRelations = result.closure.relations.filter(
      (relation) =>
        relation.kind === "generates" &&
        relation.sourceRole === "input" &&
        relation.targetRole === "subject",
    );
    const dedupedInputSubjectRelations =
      result.closure.sourceDedupedRelations.filter(
        (relation) =>
          relation.kind === "generates" &&
          relation.sourceRole === "input" &&
          relation.targetRole === "subject",
      );

    expect(result.nodeAvailability.input).toBe("usable");
    expect(inputSubjectRelations).toHaveLength(2);
    expect(dedupedInputSubjectRelations).toHaveLength(1);
    expect(
      inputSubjectRelations.every(
        (relation) => !relation.limitedByCompetition,
      ),
    ).toBe(true);
  });

  it("downgrades both shared-object interfaces under competition", () => {
    const result = evaluateSingleCandidate({
      candidateId: "competition",
      facts: fixtureDocument.factSets.F08,
    });
    const competed = result.closure.relations.filter(
      (relation) => relation.limitedByCompetition,
    );

    expect(competed.map((relation) => relation.canonicalRelationKey)).toEqual([
      "controls:f08-o>f08-c1",
      "controls:f08-o>f08-c2",
    ]);
    expect(
      result.closure.relations
        .filter(
          (relation) =>
            relation.kind === "controls" &&
            relation.sourceRole === "constraint" &&
            relation.targetRole === "subject",
        )
        .every((relation) => relation.effectiveness === "limited"),
    ).toBe(true);
    expect(result.dimensions.D5).toBe("shared_endpoint_competition");
    expect(result.finalState).toBe("conflicted");
  });

  it("represents absent structural paths as blocked", () => {
    const a02 = evaluateSingleCandidate({
      candidateId: "blocked-a02",
      facts: fixtureDocument.factSets.F05,
    });
    const a03 = evaluateSingleCandidate({
      candidateId: "blocked-a03",
      facts: fixtureDocument.factSets.F09,
    });

    expect(a02.dimensions.D1).toBe("supply_blocked");
    expect(a02.dimensions.D6).toBe("resource_interface_blocked");
    expect(a03.dimensions.D4).toBe("conversion_blocked");
  });

  it("propagates unresolved positions as unknown without guessing", () => {
    const base = fixtureDocument.factSets.F01;
    const facts: ChartFacts = {
      ...base,
      missingPositions: ["hour"],
      seasonalStrength: { ...base.seasonalStrength, resource: "unknown" },
    };
    const result = evaluateSingleCandidate({ candidateId: "unknown", facts });

    expect(result.nodeAvailability.subject).toBe("usable");
    expect(result.nodeAvailability.resource).toBe("unknown");
    expect(result.nodeAvailability.constraint).toBe("unknown");
    expect(
      result.closure.relations.some(
        (relation) => relation.effectiveness === "unknown",
      ),
    ).toBe(true);
    expect(result.dimensions.D6).toBe("unresolved");
  });

  it.each([
    ["invalid time basis", invalidTimeBasis()],
    ["missing seasonal role", missingSeasonalRole()],
    ["duplicate occurrence", duplicateOccurrence()],
    ["manually injected relation", manuallyInjectedRelation()],
    ["unsupported contact", unsupportedContact()],
  ])("fails explicitly for %s", (_label, input) => {
    expect(() => evaluateContentRebuild(input)).toThrow();
  });
});

describe("decision boundaries and determinism", () => {
  it("applies exclusions generated by legal occurrences for F04/F08/F12/F16", () => {
    for (const profileId of ["F04", "F08", "F12", "F16"]) {
      const result = evaluateSingleCandidate({
        candidateId: profileId,
        facts: fixtureDocument.factSets[profileId],
      });
      expect(result.exclusion, profileId).toBe(true);
      expect(result.finalState, profileId).toBe("conflicted");
    }
  });

  it("runs all six pairwise nearest-neighbor comparisons with a unique positive", () => {
    for (const [profileId, mechanism] of [
      ["F01", "A01"],
      ["F05", "A02"],
      ["F09", "A03"],
      ["F13", "A04"],
    ] as const) {
      const result = evaluateSingleCandidate({
        candidateId: profileId,
        facts: fixtureDocument.factSets[profileId],
      });

      expect(result.nearestNeighbor.comparisons, profileId).toHaveLength(6);
      expect(result.nearestNeighbor.status, profileId).toBe("unique");
      expect(result.nearestNeighbor.uniqueMechanism, profileId).toBe(mechanism);
    }
  });

  it("does not mutate input, freezes output, and repeats byte-equivalent structure", () => {
    const input = inputForFixture(fixtureById("CF-025"));
    const before = structuredClone(input);
    const first = evaluateContentRebuild(input);
    const second = evaluateContentRebuild(input);

    expect(input).toEqual(before);
    expect(first).toEqual(second);
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.candidateResults[0])).toBe(true);
    expect(
      Object.isFrozen(first.candidateResults[0].closure.relations[0]),
    ).toBe(true);
  });
});

function inputForFixture(fixture: FixtureCase): StaticRuleEngineInput {
  return {
    timeBasisVersion: fixtureDocument.timeConventionVersion,
    candidates: fixture.input.candidates.map(
      ({ candidateId, factSetRef }): ChartCandidate => ({
        candidateId,
        facts: fixtureDocument.factSets[factSetRef],
      }),
    ),
    ...(fixture.input.manifestationAnswers
      ? { manifestationAnswers: fixture.input.manifestationAnswers }
      : {}),
  };
}

function fixtureById(id: string): FixtureCase {
  const fixture = fixtureDocument.fixtures.find((item) => item.id === id);
  if (!fixture) throw new Error(`Missing fixture ${id}`);
  return fixture;
}

function baseInput(): StaticRuleEngineInput {
  return {
    timeBasisVersion: "civil_time_v1",
    candidates: [
      { candidateId: "c1", facts: fixtureDocument.factSets.F01 },
    ],
  };
}

function invalidTimeBasis(): StaticRuleEngineInput {
  return {
    ...baseInput(),
    timeBasisVersion: "solar_time_v1",
  } as unknown as StaticRuleEngineInput;
}

function missingSeasonalRole(): StaticRuleEngineInput {
  const incomplete = Object.fromEntries(
    Object.entries(fixtureDocument.factSets.F01.seasonalStrength).filter(
      ([role]) => role !== "peer",
    ),
  );
  return {
    ...baseInput(),
    candidates: [
      {
        candidateId: "c1",
        facts: {
          ...fixtureDocument.factSets.F01,
          seasonalStrength: incomplete,
        },
      },
    ],
  } as unknown as StaticRuleEngineInput;
}

function duplicateOccurrence(): StaticRuleEngineInput {
  const facts = fixtureDocument.factSets.F01;
  return {
    ...baseInput(),
    candidates: [
      {
        candidateId: "c1",
        facts: {
          ...facts,
          occurrences: [...facts.occurrences, facts.occurrences[0]],
        },
      },
    ],
  };
}

function manuallyInjectedRelation(): StaticRuleEngineInput {
  return {
    ...baseInput(),
    candidates: [
      {
        candidateId: "c1",
        facts: {
          ...fixtureDocument.factSets.F01,
          rawRelations: [],
        },
      },
    ],
  } as unknown as StaticRuleEngineInput;
}

function unsupportedContact(): StaticRuleEngineInput {
  return {
    ...baseInput(),
    candidates: [
      {
        candidateId: "c1",
        facts: {
          ...fixtureDocument.factSets.F01,
          branchContactFacts: [{ kind: "clashes" }],
        },
      },
    ],
  } as unknown as StaticRuleEngineInput;
}
