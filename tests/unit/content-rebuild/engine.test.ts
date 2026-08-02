import { describe, expect, it, vi } from "vitest";
import v04FixtureJson from "@/research/content-rebuild/v0.4/fixtures/archetype-fixtures.v0.2.json";
import v05FixtureJson from "@/research/content-rebuild/v0.5/fixtures/archetype-fixtures.v0.3.json";
import * as publicApi from "@/lib/content-rebuild";
import {
  evaluateContentRebuild,
  evaluateSingleCandidate,
  type CandidateEvaluation,
  type ChartCandidate,
  type ChartFacts,
  type InterfaceContentionFact,
  type MechanismId,
  type StaticRuleEngineInput,
  type StaticRuleEngineResult,
} from "@/lib/content-rebuild";
import { evaluateContentRebuildForFixture } from "@/lib/content-rebuild/engine";
import { buildRelationInterfaceProjectionForFixture } from "@/lib/content-rebuild/relation-interface";
import {
  DECISION_INTERFACE_KEYS,
  INTERFACE_PATH_IDS,
  MECHANISMS,
  type DecisionInterfaceKey,
} from "@/lib/content-rebuild/types";

interface FixtureCandidateInput {
  readonly candidateId: string;
  readonly factSetRef: string;
  readonly interfaceContentionFacts?: readonly InterfaceContentionFact[];
}

interface FixtureInput {
  readonly candidates: readonly FixtureCandidateInput[];
  readonly manifestationAnswers?: StaticRuleEngineInput["manifestationAnswers"];
}

interface FixtureCase {
  readonly id: string;
  readonly kind?: string;
  readonly type?: string;
  readonly coverageMechanism?: MechanismId;
  readonly input: FixtureInput;
  readonly expected: {
    readonly coreMechanism?: MechanismId | null;
    readonly finalState?: StaticRuleEngineResult["finalState"];
    readonly manifestationVariant?: StaticRuleEngineResult["manifestationVariant"];
    readonly [key: string]: unknown;
  };
}

interface InvalidContentionCase {
  readonly id: string;
  readonly input: FixtureInput;
  readonly expectedError: string;
}

interface DiagnosticCase {
  readonly id: string;
  readonly input: FixtureInput;
  readonly observed: unknown;
}

interface V05FixtureDocument {
  readonly timeConventionVersion: "civil_time_v1";
  readonly inheritance: {
    readonly profiles: Readonly<Record<string, string>>;
    readonly fixtures: Readonly<Record<string, string>>;
  };
  readonly factSets: Readonly<Record<string, ChartFacts>>;
  readonly contractFactSets: Readonly<Record<string, ChartFacts>>;
  readonly diagnosticFactSets: Readonly<Record<string, ChartFacts>>;
  readonly expectedProfiles: Readonly<Record<string, unknown>>;
  readonly expectedContractProfiles: Readonly<Record<string, unknown>>;
  readonly fixtures: readonly FixtureCase[];
  readonly contractCases: readonly FixtureCase[];
  readonly invalidContentionCases: readonly InvalidContentionCase[];
  readonly diagnosticCases: readonly DiagnosticCase[];
}

interface V04FixtureDocument {
  readonly factSets: Readonly<Record<string, ChartFacts>>;
  readonly fixtures: readonly FixtureCase[];
}

const fixture = v05FixtureJson as unknown as V05FixtureDocument;
const v04Fixture = v04FixtureJson as unknown as V04FixtureDocument;

describe("content-rebuild v0.5 inheritance and complete projection", () => {
  it("inherits all 16 atomic fact sets and 31 unchanged fixture inputs exactly", () => {
    expect(Object.keys(fixture.inheritance.profiles)).toHaveLength(16);
    expect(Object.keys(fixture.inheritance.fixtures)).toHaveLength(32);
    for (const [profileId, facts] of Object.entries(fixture.factSets)) {
      expect(JSON.stringify(facts), profileId).toBe(
        JSON.stringify(v04Fixture.factSets[profileId]),
      );
    }
    for (const current of fixture.fixtures.filter((item) => item.id !== "CF-013")) {
      const historical = v04Fixture.fixtures.find((item) => item.id === current.id);
      expect(JSON.stringify(current), current.id).toBe(JSON.stringify(historical));
    }
  });

  it("preserves all 32 historical top-level outcomes and their distribution", () => {
    const distribution = new Map<string, number>();
    expect(fixture.fixtures).toHaveLength(32);
    for (const current of fixture.fixtures) {
      const historical = v04Fixture.fixtures.find(
        (item) => item.id === current.id,
      );
      if (!historical) throw new Error(`Missing v0.4 fixture ${current.id}`);
      expect(current.expected.coreMechanism, current.id).toBe(
        historical.expected.coreMechanism,
      );
      expect(current.expected.finalState, current.id).toBe(
        historical.expected.finalState,
      );
      const state = current.expected.finalState;
      if (!state) throw new Error(`Missing finalState for ${current.id}`);
      distribution.set(state, (distribution.get(state) ?? 0) + 1);
    }
    expect(Object.fromEntries(distribution)).toEqual({
      established: 16,
      not_supported: 4,
      candidate: 4,
      conflicted: 4,
      boundary_sensitive: 4,
    });
  });

  it("byte-compares the complete 16/16 v0.5 profile projections", () => {
    expect(Object.keys(fixture.expectedProfiles)).toHaveLength(16);
    for (const profileId of Object.keys(fixture.expectedProfiles)) {
      const result = evaluateContentRebuild({
        timeBasisVersion: "civil_time_v1",
        candidates: [candidate(profileId, fixture.factSets[profileId])],
      });
      expectExactProjection(
        profileProjection(result.candidateResults[0], result),
        fixture.expectedProfiles[profileId],
        profileId,
      );
    }
  });

  it("byte-compares all four contract fact-set projections", () => {
    expect(Object.keys(fixture.expectedContractProfiles)).toHaveLength(4);
    for (const profileId of Object.keys(fixture.expectedContractProfiles)) {
      const result = evaluateContentRebuild({
        timeBasisVersion: "civil_time_v1",
        candidates: [candidate(profileId, fixture.contractFactSets[profileId])],
      });
      expectExactProjection(
        baseProfileProjection(result.candidateResults[0]),
        fixture.expectedContractProfiles[profileId],
        profileId,
      );
    }
  });

  it("freezes all 14 reconciled E4 aggregates and 45 present-known witnesses", () => {
    const reconciled = [
      ["profile", "F04", "A02", 1],
      ["profile", "F09", "A02", 1],
      ["profile", "F10", "A02", 1],
      ["profile", "F12", "A02", 1],
      ["profile", "F13", "A01", 1],
      ["profile", "F14", "A01", 1],
      ["profile", "F16", "A01", 1],
      ["profile", "F16", "A02", 1],
      ["contract", "M01_ALIAS", "A01", 1],
      ["contract", "M02_INDEPENDENT", "A01", 1],
      ["diagnostic", "S01", "A01", 4],
      ["diagnostic", "S02", "A01", 16],
      ["diagnostic", "S03", "A01", 9],
      ["diagnostic", "S03", "A02", 6],
    ] as const satisfies readonly (
      readonly [
        "profile" | "contract" | "diagnostic",
        string,
        MechanismId,
        number,
      ]
    )[];
    let witnessCount = 0;

    expect(reconciled).toHaveLength(14);
    for (const [source, id, mechanism, expectedCount] of reconciled) {
      let local: CandidateEvaluation;
      if (source === "profile") {
        local = evaluateContentRebuild({
          timeBasisVersion: "civil_time_v1",
          candidates: [candidate(id, fixture.factSets[id])],
        }).candidateResults[0];
      } else if (source === "contract") {
        local = evaluateContentRebuild({
          timeBasisVersion: "civil_time_v1",
          candidates: [candidate(id, fixture.contractFactSets[id])],
        }).candidateResults[0];
      } else {
        const diagnostic = fixture.diagnosticCases.find(
          (item) => item.id === id,
        );
        if (!diagnostic) throw new Error(`Missing diagnostic ${id}`);
        local = evaluateContentRebuildForFixture(inputFor(diagnostic.input))
          .candidateResults[0];
      }
      const witnesses = local.e4Witnesses[mechanism];
      expect(e4State(local, mechanism), `${id}/${mechanism}`).toBe(
        "not_supported",
      );
      expect(witnesses, `${id}/${mechanism}`).toHaveLength(expectedCount);
      for (const witness of witnesses) {
        expect(witness.state, witness.witnessKey).toBe("not_supported");
        expect(["effective", "limited"], witness.witnessKey).toContain(
          witness.baseState,
        );
        expect(witness.atomicRelationKeys.length, witness.witnessKey)
          .toBeGreaterThan(0);
        expect(witness.objectPath, witness.witnessKey).toHaveLength(
          witness.atomicRelationKeys.length + 1,
        );
        expect(witness.originPath, witness.witnessKey).toHaveLength(
          witness.atomicRelationKeys.length + 1,
        );
        expect(witness.contentionFactKeys, witness.witnessKey).toEqual([]);
        expect(witness.counterRelationKeys, witness.witnessKey).toEqual([]);
      }
      witnessCount += witnesses.length;
    }
    expect(witnessCount).toBe(45);
  });

  it("reproduces all 32/32 migrated fixture outcomes", () => {
    expect(fixture.fixtures).toHaveLength(32);
    for (const testCase of fixture.fixtures) {
      const result = evaluateContentRebuildForFixture(inputFor(testCase.input));
      expect(result.coreMechanism, testCase.id).toBe(
        testCase.expected.coreMechanism,
      );
      expect(result.finalState, testCase.id).toBe(testCase.expected.finalState);
      if (testCase.expected.manifestationVariant !== undefined) {
        expect(result.manifestationVariant, testCase.id).toBe(
          testCase.expected.manifestationVariant,
        );
      }
    }
  });

  it("keeps complete atomic closure and the four diagnostics for every fact set", () => {
    for (const [profileId, facts] of Object.entries(allFactSets())) {
      const result = evaluateSingleCandidate(candidate(profileId, facts));
      const expected = (facts.occurrences.length * (facts.occurrences.length - 1)) / 2;
      expect(result.closure.rawRelationCount, profileId).toBe(expected);
      expect(result.closure.expectedRelationCount, profileId).toBe(expected);
      expect(
        new Set(
          result.closure.relations.map(
            (relation) => relation.canonicalRelationKey,
          ),
        ).size,
        profileId,
      ).toBe(expected);
      expect(result.closure.diagnostics, profileId).toEqual({
        invalidRoleRelationCount: 0,
        missingDeterministicRelationCount: 0,
        duplicateRelationAfterSourceDedupeCount: 0,
        unexpectedManuallySelectedRelationCount: 0,
      });
    }
  });
});

describe("F08 migration and explicit contention", () => {
  it("keeps normal F08 multiplicity effective without a contention fact", () => {
    const result = evaluateContentRebuildForFixture(
      inputFor(contractCase("MC-001").input),
    );
    const local = result.candidateResults[0];

    expect(local.closure.rawRelationCount).toBe(6);
    expect(local.closure.sourceDedupedRelations).toHaveLength(6);
    expect(local.closure.relationEffectivenessCounts).toEqual({
      effective: 3,
      limited: 3,
      blocked: 0,
      unknown: 0,
    });
    expect(local.contributors["controls:output>constraint"]).toHaveLength(2);
    expect(local.contributors["controls:constraint>subject"]).toHaveLength(2);
    expect(local.interfaces["controls:output>constraint"].state).toBe(
      "effective",
    );
    expect(local.interfaces["controls:constraint>subject"].state).toBe(
      "limited",
    );
    expect(local.paths.output_constraint.state).toBe("effective");
    expect(local.paths.constraint_subject.state).toBe("limited");
    expect(local.dimensions.D5).toBe("output_constraint_regulating");
    expect(e4State(local, "A02")).toBe("established");
    expect(result.coreMechanism).toBe("A02");
    expect(result.finalState).toBe("established");
  });

  it("overlays CF-013 contention without changing one atomic byte", () => {
    const noFact = evaluateContentRebuildForFixture(
      inputFor(contractCase("MC-001").input),
    );
    const explicit = evaluateContentRebuildForFixture(
      inputFor(fixtureCase("CF-013").input),
    );
    const local = explicit.candidateResults[0];

    expect(JSON.stringify(local.closure)).toBe(
      JSON.stringify(noFact.candidateResults[0].closure),
    );
    expect(local.paths.output_constraint.state).toBe("conflicted");
    expect(local.paths.constraint_subject.state).toBe("conflicted");
    expect(local.interfaces["controls:output>constraint"].contentionFactKeys)
      .toEqual(["icf:shared-output-capacity"]);
    expect(local.interfaces["controls:constraint>subject"].contentionFactKeys)
      .toEqual(["icf:shared-subject-capacity"]);
    expect(local.dimensions.D5).toBe("shared_endpoint_competition");
    expect(e4State(local, "A02")).toBe("conflicted");
    expect(explicit.coreMechanism).toBeNull();
    expect(explicit.finalState).toBe("conflicted");
  });
});

describe("source authorization and isolated fixture route", () => {
  it("hard-fails both ordinary runtime APIs before evaluating non-empty facts", () => {
    const input = inputFor(fixtureCase("CF-013").input);
    expect(() => evaluateContentRebuild(input)).toThrow(
      "interfaceContentionFacts are not authorized for ordinary runtime",
    );
    expect(() => evaluateSingleCandidate(input.candidates[0])).toThrow(
      "interfaceContentionFacts are not authorized for ordinary runtime",
    );
  });

  it("allows omission and an empty list through ordinary runtime", () => {
    const facts = fixture.factSets.F08;
    expect(
      evaluateSingleCandidate(candidate("missing", facts)).candidateState,
    ).toBe("established");
    expect(
      evaluateSingleCandidate({
        ...candidate("empty", facts),
        interfaceContentionFacts: [],
      }).candidateState,
    ).toBe("established");
  });

  it("does not expose the isolated fixture evaluator from the public index", () => {
    expect("evaluateContentRebuildForFixture" in publicApi).toBe(false);
    expect("buildRelationInterfaceProjectionForFixture" in publicApi).toBe(
      false,
    );
  });

  it("hard-fails the fixture evaluator outside the isolated test environment", () => {
    const facts = fixture.factSets.F01;
    const ordinary = evaluateSingleCandidate(candidate("source-gate", facts));
    vi.stubEnv("NODE_ENV", "production");
    try {
      expect(() =>
        evaluateContentRebuildForFixture(inputFor(contractCase("MC-001").input)),
      ).toThrow(
        "Contract fixture evaluation is only authorized in the isolated test harness",
      );
      expect(() =>
        buildRelationInterfaceProjectionForFixture(
          facts.occurrences,
          ordinary.nodeAvailability,
          ordinary.closure,
          [],
        ),
      ).toThrow(
        "Contract fixture projection is only authorized in the isolated test harness",
      );
    } finally {
      vi.unstubAllEnvs();
    }
  });
});

describe("direct, compound, and E4 physical witnesses", () => {
  it("folds aliases into one contributor while preserving both atomic witnesses", () => {
    const result = evaluateContentRebuildForFixture(
      inputFor(contractCase("MC-002").input),
    ).candidateResults[0];
    const contributors = result.contributors["generates:input>subject"];
    expect(contributors).toHaveLength(1);
    expect(contributors[0].atomicRelationKeys).toHaveLength(2);
    expect(result.paths.input_subject.atomicWitnessCount).toBe(2);
    expect(result.paths.input_subject.state).not.toBe("conflicted");
  });

  it("keeps independent contributors neutral and non-voting", () => {
    const result = evaluateContentRebuildForFixture(
      inputFor(contractCase("MC-003").input),
    ).candidateResults[0];
    expect(result.contributors["generates:input>subject"]).toHaveLength(2);
    expect(result.interfaces["generates:input>subject"].state).toBe(
      "effective",
    );
    expect(result.paths.input_subject.state).toBe("effective");
  });

  it("does not fabricate a physical output-resource or A01 witness", () => {
    const result = evaluateContentRebuildForFixture(
      inputFor(contractCase("MC-005").input),
    ).candidateResults[0];
    expect(result.interfaces["generates:output>resource"].state).toBe("absent");
    expect(result.paths.output_resource).toMatchObject({
      state: "absent",
      atomicWitnessCount: 0,
      witnesses: [],
    });
    expect(result.e4Witnesses.A01).toEqual([]);
    expect(e4State(result, "A01")).toBe("not_supported");
    expect(result.dimensions.D6).toBe("resource_interface_blocked");
  });

  it("requires both object and origin equality at every compound join", () => {
    for (const facts of Object.values(allFactSets())) {
      const result = evaluateSingleCandidate(candidate("join-check", facts));
      const relationByKey = new Map(
        result.closure.relations.map((relation) => [
          relation.canonicalRelationKey,
          relation,
        ]),
      );
      for (const pathId of INTERFACE_PATH_IDS.slice(6)) {
        for (const witness of result.paths[pathId].witnesses) {
          expect(witness.objectPath).toHaveLength(witness.atomicRelationKeys.length + 1);
          expect(witness.originPath).toHaveLength(witness.atomicRelationKeys.length + 1);
          witness.atomicRelationKeys.forEach((relationKey, index) => {
            const relation = relationByKey.get(relationKey);
            if (!relation) throw new Error(`Missing relation ${relationKey}`);
            expect(relation.sourceObjectKey, relationKey).toBe(
              witness.objectPath[index],
            );
            expect(relation.targetObjectKey, relationKey).toBe(
              witness.objectPath[index + 1],
            );
            expect(relation.sourceOriginClusterKey, relationKey).toBe(
              witness.originPath[index],
            );
            expect(relation.targetOriginClusterKey, relationKey).toBe(
              witness.originPath[index + 1],
            );
          });
        }
      }
    }
  });

  it("retains every atomic alias in source-deduped relation-node provenance", () => {
    for (const [profileId, facts] of Object.entries(allFactSets())) {
      const result = evaluateSingleCandidate(candidate(profileId, facts));
      const relationNodes = result.evidenceGraph.nodes.filter((node) =>
        node.id.startsWith("relation:"),
      );
      expect(
        [...new Set(relationNodes.flatMap((node) => node.supportRelationKeys))]
          .sort(),
        profileId,
      ).toEqual(
        result.closure.relations
          .map((relation) => relation.canonicalRelationKey)
          .sort(),
      );

      for (const representative of result.closure.sourceDedupedRelations) {
        const atomicRelations = result.closure.relations.filter(
          (relation) =>
            relation.sourceDedupeKey === representative.sourceDedupeKey,
        );
        const node = relationNodes.find(
          (item) =>
            item.id === `relation:${representative.canonicalRelationKey}`,
        );
        if (!node) {
          throw new Error(
            `Missing relation node ${representative.canonicalRelationKey}`,
          );
        }
        expect(node.supportRelationKeys, representative.sourceDedupeKey).toEqual(
          atomicRelations
            .map((relation) => relation.canonicalRelationKey)
            .sort(),
        );
      }
    }
  });

  it("uses only aggregate-state E4 witnesses as decision provenance", () => {
    for (const [profileId, facts] of Object.entries(allFactSets())) {
      const result = evaluateSingleCandidate(candidate(profileId, facts));
      for (const mechanism of MECHANISMS) {
        const state = e4State(result, mechanism);
        const aggregateWitnesses = result.e4Witnesses[mechanism].filter(
          (witness) => witness.state === state,
        );
        const node = result.evidenceGraph.nodes.find(
          (item) => item.id === result.evidenceGraph.e4NodeIds[mechanism],
        );
        if (!node) throw new Error(`Missing E4 node ${mechanism}`);
        expect(node.supportRelationKeys, `${profileId}/${mechanism}`).toEqual(
          [...new Set(
            aggregateWitnesses.flatMap(
              (witness) => witness.atomicRelationKeys,
            ),
          )].sort(),
        );
      }
    }
  });
});

describe("deterministic core equivalence", () => {
  it("is byte-equivalent when ordinary multiplicity occurrences reverse", () => {
    const input = inputFor(contractCase("MC-001").input);
    const reverse: StaticRuleEngineInput = {
      ...structuredClone(input),
      candidates: input.candidates.map((item) => ({
        ...item,
        facts: {
          ...item.facts,
          occurrences: [...item.facts.occurrences].reverse(),
        },
      })),
    };
    expect(JSON.stringify(evaluateContentRebuildForFixture(reverse))).toBe(
      JSON.stringify(evaluateContentRebuildForFixture(input)),
    );
  });

  it("is byte-equivalent when occurrences, facts, and participants reverse", () => {
    const input = inputFor(fixtureCase("CF-013").input);
    const reverse: StaticRuleEngineInput = {
      ...structuredClone(input),
      candidates: input.candidates.map((item) => ({
        ...item,
        facts: {
          ...item.facts,
          occurrences: [...item.facts.occurrences].reverse(),
        },
        interfaceContentionFacts: [...(item.interfaceContentionFacts ?? [])]
          .reverse()
          .map((fact) => ({
            ...fact,
            participantObjectKeys: [...fact.participantObjectKeys].reverse(),
          })),
      })),
    };
    expect(JSON.stringify(evaluateContentRebuildForFixture(reverse))).toBe(
      JSON.stringify(evaluateContentRebuildForFixture(input)),
    );
  });

  it.each([
    ["CF-001", "CF-008"],
    ["CF-009", "CF-016"],
    ["CF-017", "CF-024"],
    ["CF-025", "CF-032"],
  ])("keeps answers_reverse core bytes equal for %s/%s", (positiveId, reverseId) => {
    const positive = evaluateContentRebuildForFixture(
      inputFor(fixtureCase(positiveId).input),
    );
    const reverse = evaluateContentRebuildForFixture(
      inputFor(fixtureCase(reverseId).input),
    );
    expect(coreBytes(reverse)).toBe(coreBytes(positive));
    expect(positive.manifestationVariant).toBe("unselected");
    expect(reverse.manifestationVariant).toBe("reverse");
  });

  it("does not let answers resolve the unknown-hour boundary", () => {
    const plain = evaluateContentRebuildForFixture(
      inputFor(contractCase("MC-004").input),
    );
    const answered = evaluateContentRebuildForFixture(
      inputFor(contractCase("MC-004A").input),
    );
    expect(coreBytes(answered)).toBe(coreBytes(plain));
    expect(plain.finalState).toBe("boundary_sensitive");
    expect(answered.finalState).toBe("boundary_sensitive");
  });

  it("uses ordinal candidate ordering rather than locale ordering", () => {
    const facts = fixture.factSets.F01;
    const result = evaluateContentRebuild({
      timeBasisVersion: "civil_time_v1",
      candidates: [candidate("ä", facts), candidate("z", facts)],
    });
    expect(result.candidateResults.map((item) => item.candidateId)).toEqual([
      "z",
      "ä",
    ]);
  });

  it("does not mutate input, freezes output, and repeats exact bytes", () => {
    const input = inputFor(fixtureCase("CF-025").input);
    const before = structuredClone(input);
    const first = evaluateContentRebuildForFixture(input);
    const second = evaluateContentRebuildForFixture(input);
    expect(input).toEqual(before);
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.candidateResults[0].paths.conversion)).toBe(true);
  });
});

describe("S01-S04 observed diagnostics", () => {
  it("byte-compares all actual diagnostics without target labels", () => {
    expect(fixture.diagnosticCases).toHaveLength(4);
    for (const testCase of fixture.diagnosticCases) {
      expect(JSON.stringify(testCase.input)).not.toMatch(
        /targetMechanism|expected|coverageMechanism/,
      );
      const result = evaluateContentRebuildForFixture(inputFor(testCase.input));
      expectExactProjection(
        diagnosticProjection(result.candidateResults[0], result),
        testCase.observed,
        testCase.id,
      );
    }
  });
});

describe("input validation and frozen subject capacity", () => {
  it("rejects invalid source facts before deterministic evaluation", () => {
    const valid = baseInput();
    const facts = fixture.factSets.F01;
    const invalids: readonly StaticRuleEngineInput[] = [
      { ...valid, timeBasisVersion: "solar_time_v1" } as unknown as StaticRuleEngineInput,
      {
        ...valid,
        candidates: [
          {
            candidateId: "c1",
            facts: {
              ...facts,
              occurrences: [...facts.occurrences, facts.occurrences[0]],
            },
          },
        ],
      },
      {
        ...valid,
        candidates: [candidate("same", facts), candidate("same", facts)],
      },
      {
        ...valid,
        candidates: [
          {
            candidateId: "c1",
            facts: { ...facts, rawRelations: [] },
          } as unknown as ChartCandidate,
        ],
      },
    ];
    for (const input of invalids) expect(() => evaluateContentRebuild(input)).toThrow();
  });

  it("keeps peer-root subject capacity deduped by origin", () => {
    const dayAnchor = {
      role: "subject" as const,
      kind: "day_anchor" as const,
      objectKey: "day-anchor",
      originClusterKey: "day-anchor:甲",
      hiddenStemProportion: null,
      rootOccurrence: false,
    };
    const sameOrigin = evaluateSingleCandidate(
      capacityCandidate([
        dayAnchor,
        peerRoot("peer-a", "branch:month:寅"),
        peerRoot("peer-b", "branch:month:寅"),
      ]),
    );
    const independent = evaluateSingleCandidate(
      capacityCandidate([
        dayAnchor,
        peerRoot("peer-c", "branch:month:寅"),
        peerRoot("peer-d", "branch:year:亥"),
      ]),
    );
    expect(sameOrigin.nodeAvailability.subject).toBe("limited");
    expect(independent.nodeAvailability.subject).toBe("usable");
    expect(independent.nodeAvailability.peer).toBe("limited");
  });
});

function candidate(candidateId: string, facts: ChartFacts): ChartCandidate {
  return { candidateId, facts };
}

function allFactSets(): Readonly<Record<string, ChartFacts>> {
  return {
    ...fixture.factSets,
    ...fixture.contractFactSets,
    ...fixture.diagnosticFactSets,
  };
}

function inputFor(input: FixtureInput): StaticRuleEngineInput {
  const facts = allFactSets();
  return {
    timeBasisVersion: fixture.timeConventionVersion,
    candidates: input.candidates.map((item) => ({
      candidateId: item.candidateId,
      facts: facts[item.factSetRef],
      ...(item.interfaceContentionFacts
        ? { interfaceContentionFacts: item.interfaceContentionFacts }
        : {}),
    })),
    ...(input.manifestationAnswers
      ? { manifestationAnswers: input.manifestationAnswers }
      : {}),
  };
}

function fixtureCase(id: string): FixtureCase {
  const result = fixture.fixtures.find((item) => item.id === id);
  if (!result) throw new Error(`Missing fixture ${id}`);
  return result;
}

function contractCase(id: string): FixtureCase {
  const result = fixture.contractCases.find((item) => item.id === id);
  if (!result) throw new Error(`Missing contract case ${id}`);
  return result;
}

function baseProfileProjection(local: CandidateEvaluation) {
  return {
    nodeAvailability: local.nodeAvailability,
    rawRelationCount: local.closure.rawRelationCount,
    sourceDedupedRelationCount: local.closure.sourceDedupedRelations.length,
    atomicRelations: local.closure.relations,
    sourceDedupedRelationKeys: local.closure.sourceDedupedRelations.map(
      (relation) => relation.canonicalRelationKey,
    ),
    closureDiagnostics: local.closure.diagnostics,
    atomicRelationEffectivenessCounts:
      local.closure.relationEffectivenessCounts,
    contributors: local.contributors,
    interfaces: interfaceAssertions(local),
    paths: local.paths,
    E4: Object.fromEntries(
      MECHANISMS.map((mechanism) => [mechanism, e4State(local, mechanism)]),
    ),
    e4Witnesses: local.e4Witnesses,
    dimensions: local.dimensions,
  };
}

function profileProjection(
  local: CandidateEvaluation,
  aggregate: StaticRuleEngineResult,
) {
  return {
    ...baseProfileProjection(local),
    coreMechanism: aggregate.coreMechanism,
    finalState: aggregate.finalState,
  };
}

function diagnosticProjection(
  local: CandidateEvaluation,
  aggregate: StaticRuleEngineResult,
) {
  const mechanismEvaluations = Object.fromEntries(
    MECHANISMS.map((mechanism) => {
      const evaluation = local.mechanismEvaluations[mechanism];
      return [
        mechanism,
        {
          supportState: evaluation.supportState,
          excluded: evaluation.excluded,
          gateFailures: evaluation.gateFailures,
        },
      ];
    }),
  );
  return {
    ...baseProfileProjection(local),
    evidence: aggregate.evidence,
    tensions: local.tensions,
    tension: local.tension,
    mechanismEvaluations,
    exclusion: local.exclusion,
    nearestNeighbor: local.nearestNeighbor,
    coreCandidates: local.coreCandidates,
    coreMechanism: local.coreMechanism,
    candidateState: local.candidateState,
    finalState: aggregate.finalState,
  };
}

function interfaceAssertions(local: CandidateEvaluation) {
  return Object.fromEntries(
    DECISION_INTERFACE_KEYS.map((interfaceKey) => {
      const relationInterface = local.interfaces[interfaceKey];
      return [
        interfaceKey,
        {
          interfaceKey: relationInterface.interfaceKey,
          state: relationInterface.state,
          contributorKeys: relationInterface.contributorKeys,
          contributorCount: local.contributors[interfaceKey].length,
          atomicRelationCount: relationInterface.atomicRelationKeys.length,
          atomicRelationKeys: relationInterface.atomicRelationKeys,
          originClusterKeys: relationInterface.originClusterKeys,
          contentionFactKeys: relationInterface.contentionFactKeys,
          invalidatedByFactKeys: relationInterface.invalidatedByFactKeys,
        },
      ];
    }),
  ) as Readonly<Record<DecisionInterfaceKey, unknown>>;
}

function e4State(
  local: CandidateEvaluation,
  mechanism: MechanismId,
): CandidateEvaluation["tension"] {
  const node = local.evidenceGraph.nodes.find(
    (item) => item.id === local.evidenceGraph.e4NodeIds[mechanism],
  );
  if (!node || node.status === "boundary_sensitive") {
    throw new Error(`Missing candidate-local E4 node ${mechanism}`);
  }
  return node.status;
}

function coreBytes(result: StaticRuleEngineResult): string {
  return JSON.stringify(
    Object.fromEntries(
      Object.entries(result).filter(([key]) => key !== "manifestationVariant"),
    ),
  );
}

function baseInput(): StaticRuleEngineInput {
  return {
    timeBasisVersion: "civil_time_v1",
    candidates: [candidate("c1", fixture.factSets.F01)],
  };
}

function capacityCandidate(
  occurrences: ChartFacts["occurrences"],
): ChartCandidate {
  return {
    candidateId: "subject-capacity",
    facts: {
      precision: "exact",
      missingPositions: [],
      seasonalStrength: {
        subject: "囚",
        peer: "囚",
        input: "死",
        output: "死",
        resource: "死",
        constraint: "死",
      },
      occurrences,
    },
  };
}

function peerRoot(objectKey: string, originClusterKey: string) {
  return {
    role: "peer" as const,
    kind: "hidden" as const,
    objectKey,
    originClusterKey,
    hiddenStemProportion: 0.3,
    rootOccurrence: true,
  };
}

function expectExactProjection(
  actual: unknown,
  expected: unknown,
  label: string,
): void {
  expect(firstDifference(actual, expected), label).toBeNull();
  expect(JSON.stringify(actual), `${label}: canonical byte order`).toBe(
    JSON.stringify(expected),
  );
}

function firstDifference(
  actual: unknown,
  expected: unknown,
  path = "$",
): string | null {
  if (Object.is(actual, expected)) return null;
  if (Array.isArray(actual) || Array.isArray(expected)) {
    if (!Array.isArray(actual) || !Array.isArray(expected)) {
      return `${path}: array type mismatch`;
    }
    if (actual.length !== expected.length) {
      return `${path}: length ${actual.length} !== ${expected.length}`;
    }
    for (let index = 0; index < actual.length; index += 1) {
      const difference = firstDifference(
        actual[index],
        expected[index],
        `${path}[${index}]`,
      );
      if (difference) return difference;
    }
    return null;
  }
  if (isRecord(actual) || isRecord(expected)) {
    if (!isRecord(actual) || !isRecord(expected)) {
      return `${path}: object type mismatch`;
    }
    const actualKeys = Object.keys(actual);
    const expectedKeys = Object.keys(expected);
    if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) {
      return `${path}: keys ${JSON.stringify(actualKeys)} !== ${JSON.stringify(expectedKeys)}`;
    }
    for (const key of actualKeys) {
      const difference = firstDifference(
        actual[key],
        expected[key],
        `${path}.${key}`,
      );
      if (difference) return difference;
    }
    return null;
  }
  return `${path}: ${JSON.stringify(actual)} !== ${JSON.stringify(expected)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}


describe("subject capacity peer-root contract", () => {
  const seasonalStrength: ChartFacts["seasonalStrength"] = {
    subject: "囚",
    peer: "囚",
    input: "死",
    output: "死",
    resource: "死",
    constraint: "死",
  };

  function subjectCapacityCandidate(
    occurrences: ChartFacts["occurrences"],
    missingPositions: readonly string[] = [],
    subjectStrength: ChartFacts["seasonalStrength"]["subject"] = "囚",
  ): ChartCandidate {
    return {
      candidateId: "subject-capacity",
      facts: {
        precision: missingPositions.length > 0 ? "bounded" : "exact",
        missingPositions,
        seasonalStrength: { ...seasonalStrength, subject: subjectStrength },
        occurrences,
      },
    };
  }

  const dayAnchor = {
    role: "subject" as const,
    kind: "day_anchor" as const,
    objectKey: "day-anchor",
    originClusterKey: "day-anchor:甲",
    hiddenStemProportion: null,
    rootOccurrence: false,
  };

  it("lets independent rooted peer occurrences support subject capacity without changing peer identity", () => {
    const result = evaluateSingleCandidate(
      subjectCapacityCandidate([
        dayAnchor,
        {
role: "peer",
kind: "hidden",
objectKey: "peer-root-1",
originClusterKey: "branch:day:寅",
hiddenStemProportion: 0.6,
rootOccurrence: true,
        },
        {
role: "peer",
kind: "hidden",
objectKey: "peer-root-2",
originClusterKey: "branch:year:亥",
hiddenStemProportion: 0.3,
rootOccurrence: true,
        },
      ]),
    );

    expect(result.nodeAvailability.subject).toBe("usable");
    expect(result.nodeAvailability.peer).toBe("limited");
    expect(result.closure.relations.every((relation) =>
      ["subject", "peer"].includes(relation.sourceRole) &&
      ["subject", "peer"].includes(relation.targetRole),
    )).toBe(true);
  });

  it("deduplicates subject-capacity peer roots by origin cluster", () => {
    const sameOrigin = evaluateSingleCandidate(
      subjectCapacityCandidate([
        dayAnchor,
        {
role: "peer",
kind: "hidden",
objectKey: "peer-root-a",
originClusterKey: "branch:month:寅",
hiddenStemProportion: 0.3,
rootOccurrence: true,
        },
        {
role: "peer",
kind: "hidden",
objectKey: "peer-root-b",
originClusterKey: "branch:month:寅",
hiddenStemProportion: 0.3,
rootOccurrence: true,
        },
      ]),
    );
    const independentOrigins = evaluateSingleCandidate(
      subjectCapacityCandidate([
        dayAnchor,
        {
role: "peer",
kind: "hidden",
objectKey: "peer-root-c",
originClusterKey: "branch:month:寅",
hiddenStemProportion: 0.3,
rootOccurrence: true,
        },
        {
role: "peer",
kind: "hidden",
objectKey: "peer-root-d",
originClusterKey: "branch:year:亥",
hiddenStemProportion: 0.3,
rootOccurrence: true,
        },
      ]),
    );

    expect(sameOrigin.nodeAvailability.subject).toBe("limited");
    expect(independentOrigins.nodeAvailability.subject).toBe("usable");
  });

  it("does not let visible or unrooted peers increase subject capacity", () => {
    const result = evaluateSingleCandidate(
      subjectCapacityCandidate(
        [
dayAnchor,
{
  role: "peer",
  kind: "visible",
  objectKey: "visible-peer",
  originClusterKey: "visible:year:乙",
  hiddenStemProportion: null,
  rootOccurrence: false,
},
        ],
        [],
        "休",
      ),
    );

    expect(result.nodeAvailability.subject).toBe("limited");
  });

  it("preserves unknown handling when a missing hour can change capacity", () => {
    const result = evaluateSingleCandidate(
      subjectCapacityCandidate(
        [dayAnchor],
        ["hour.stem", "hour.branch"],
        "囚",
      ),
    );

    expect(result.nodeAvailability.subject).toBe("unknown");
  });
});

describe("A02 limited regulating triad contract", () => {
  it("accepts the endpoint-qualified limited triad without sample-specific logic", () => {
    const facts: ChartFacts = {
      precision: "exact",
      missingPositions: [],
      seasonalStrength: {
        subject: "囚",
        peer: "囚",
        input: "死",
        output: "旺",
        resource: "死",
        constraint: "休",
      },
      occurrences: [
        {
          role: "subject",
          kind: "day_anchor",
          objectKey: "limited-triad-subject",
          originClusterKey: "limited-triad-subject-origin",
          hiddenStemProportion: null,
          rootOccurrence: false,
        },
        {
          role: "output",
          kind: "visible",
          objectKey: "limited-triad-output",
          originClusterKey: "limited-triad-output-origin",
          hiddenStemProportion: null,
          rootOccurrence: false,
        },
        {
          role: "constraint",
          kind: "visible",
          objectKey: "limited-triad-constraint",
          originClusterKey: "limited-triad-constraint-origin",
          hiddenStemProportion: null,
          rootOccurrence: false,
        },
      ],
    };

    const result = evaluateSingleCandidate({
      candidateId: "limited-regulating-triad",
      facts,
    });

    expect(result.nodeAvailability).toMatchObject({
      subject: "limited",
      output: "usable",
      constraint: "limited",
    });
    expect(result.dimensions.D2).toBe("output_visible_asymmetric");
    expect(result.dimensions.D5).toBe("output_constraint_regulating");
    expect(result.nearestNeighbor.comparisons.find(
      (comparison) => comparison.pair === "A01_A02",
    )?.result).toBe("right");
  });

  it("preserves F05, F07, and F08 frozen outcomes", () => {
    const established = profile("F05");
    const capacityFailure = profile("F07");
    const competition = profile("F08");

    expect(established.dimensions.D5).toBe("output_constraint_regulating");
    expect(established.coreMechanism).toBe("A02");
    expect(established.candidateState).toBe("established");

    expect(capacityFailure.nodeAvailability.output).toBe("limited");
    expect(capacityFailure.dimensions.D5).toBe("unresolved");
    expect(capacityFailure.coreMechanism).toBeNull();
    expect(capacityFailure.candidateState).toBe("candidate");

    expect(competition.dimensions.D5).toBe("shared_endpoint_competition");
    expect(competition.coreMechanism).toBeNull();
    expect(competition.candidateState).toBe("conflicted");
  });
});
