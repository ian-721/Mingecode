import { describe, expect, it } from "vitest";
import fixtureJson from "@/research/content-rebuild/v0.4/fixtures/archetype-fixtures.v0.2.json";
import {
  evaluateContentRebuild,
  evaluateSingleCandidate,
  type CandidateEvaluation,
  type ChartCandidate,
  type ChartFacts,
  type EvidenceStates,
  type EvidencePath,
  type EvidencePathId,
  type EvidenceFamily,
  type FinalState,
  type MechanismId,
  type NodeAvailabilityByRole,
  type RelationEffectiveness,
  type StaticRuleEngineInput,
} from "@/lib/content-rebuild";
import {
  evaluatePairBoundaries,
  evaluateProvenanceGate,
} from "@/lib/content-rebuild/decision";
import {
  calculateDimensionsFromEvidence,
  findE4Witness,
} from "@/lib/content-rebuild/evidence";

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
  it("reproduces the complete 16/16 forward chain without expected as input", () => {
    const profileIds = Object.keys(fixtureDocument.factSets).sort();
    expect(profileIds).toHaveLength(16);

    for (const profileId of profileIds) {
      const expected = fixtureDocument.expectedProfiles[profileId];
      const candidate: ChartCandidate = {
        candidateId: profileId,
        facts: fixtureDocument.factSets[profileId],
      };
      const local = evaluateSingleCandidate(candidate);
      const aggregate = evaluateContentRebuild({
        timeBasisVersion: "civil_time_v1",
        candidates: [candidate],
      });
      const criticalRelationStates = Object.fromEntries(
        Object.keys(expected.criticalRelationStates).map((relationKey) => [
          relationKey,
          local.closure.relations.find(
            (relation) => relation.canonicalRelationKey === relationKey,
          )?.effectiveness,
        ]),
      );

      expect(local.nodeAvailability, profileId).toEqual(
        expected.nodeAvailability,
      );
      expect(local.closure.rawRelationCount, profileId).toBe(
        expected.rawRelationCount,
      );
      expect(local.closure.relationEffectivenessCounts, profileId).toEqual(
        expected.relationEffectivenessCounts,
      );
      expect(criticalRelationStates, profileId).toEqual(
        expected.criticalRelationStates,
      );
      expect(local.closure.diagnostics, profileId).toEqual({
        invalidRoleRelationCount: 0,
        missingDeterministicRelationCount: 0,
        duplicateRelationAfterSourceDedupeCount: 0,
        unexpectedManuallySelectedRelationCount: 0,
      });
      expect(local.evidence, profileId).toEqual(withoutE6(expected.evidence));
      expect(aggregate.evidence, profileId).toEqual(expected.evidence);
      expect(local.dimensions, profileId).toEqual(expected.dimensions);
      expect(local.evidenceFamilies, profileId).toEqual(
        expected.evidenceFamilies,
      );
      expect(local.originClusterKeys, profileId).toEqual(
        expected.originClusterKeys,
      );
      expect(local.tension, profileId).toBe(expected.tension);
      expect(local.exclusion, profileId).toBe(expected.exclusion);
      expect(aggregate.coreMechanism, profileId).toBe(expected.coreMechanism);
      expect(aggregate.finalState, profileId).toBe(expected.finalState);
      expect(local.evidenceGraph.nodes.some((node) => node.layer === "E4"))
        .toBe(true);
      expect(Object.keys(local.evidence)).not.toContain("E6");
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

  it("materializes provenance on every executable node and path", () => {
    const result = profile("F09");
    const sources = [...result.evidenceGraph.nodes, ...result.evidenceGraph.paths];

    expect(result.evidenceGraph.paths.some((path) => path.id === "output_mediated"))
      .toBe(true);
    for (const source of sources) {
      expect(source.evidenceFamily).toBeTypeOf("string");
      expect(Array.isArray(source.originClusterKeys)).toBe(true);
      expect(Array.isArray(source.involvedObjectKeys)).toBe(true);
      expect(Array.isArray(source.supportRelationKeys)).toBe(true);
      expect(Array.isArray(source.counterRelationKeys)).toBe(true);
      expect(source.status).toBeTypeOf("string");
    }
  });

  it("computes D1-D6 solely from executable EvidenceGraph paths", () => {
    const result = profile("F13");
    const changedGraph = {
      ...result.evidenceGraph,
      paths: result.evidenceGraph.paths.map((path) =>
        path.id === "conversion"
          ? { ...path, structuralStatus: "limited" as const }
          : path,
      ),
    };

    expect(result.dimensions.D4).toBe("conversion_continuous");
    expect(calculateDimensionsFromEvidence(changedGraph).states.D4).toBe(
      "conversion_limited",
    );
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

  it("keeps all answers_reverse core layers identical to positive", () => {
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

  it("creates E6 only at candidate aggregation and detects changed cores", () => {
    const stableResult = evaluateContentRebuild(inputForFixture(fixtureById("CF-006")));
    const changingResult = evaluateContentRebuild(
      inputForFixture(fixtureById("CF-007")),
    );

    expect(stableResult.coreMechanism).toBe("A01");
    expect(stableResult.finalState).toBe("established");
    expect(stableResult.evidence.E6).toBe("established");
    expect(stableResult.candidateStabilityEvidence).toMatchObject({
      evidenceFamily: "candidate_stability",
      status: "established",
    });
    expect(stableResult.candidateResults.every((result) => !("E6" in result.evidence)))
      .toBe(true);
    expect(changingResult.coreMechanism).toBeNull();
    expect(changingResult.finalState).toBe("boundary_sensitive");
    expect(changingResult.evidence.E6).toBe("boundary_sensitive");
    expect(changingResult.finalState).toBe(
      changingResult.candidateStabilityEvidence.status,
    );
  });
});

describe("executable E4 and independent-family gates", () => {
  it("does not establish with two origins but one actual evidence family", () => {
    const gate = evaluateProvenanceGate(
      [
        evidenceSource("complete_relation_closure", ["origin-1"]),
        evidenceSource("complete_relation_closure", ["origin-2"]),
      ],
      ["D1", "D6"],
    );

    expect(gate.originClusterKeys).toEqual(["origin-1", "origin-2"]);
    expect(gate.evidenceFamilies).toEqual(["complete_relation_closure"]);
    expect(gate.failures).toContain("fewer_than_two_evidence_families");
  });

  it("does not count a not-supported decoy family as actual support", () => {
    const gate = evaluateProvenanceGate(
      [
        evidenceSource("node_availability", ["origin-1", "origin-2"]),
        {
          ...evidenceSource("same_origin_tension", ["fake-origin"]),
          status: "not_supported",
        },
      ],
      ["D1", "D6"],
    );

    expect(gate.evidenceFamilies).toEqual(["node_availability"]);
    expect(gate.originClusterKeys).toEqual(["origin-1", "origin-2"]);
    expect(gate.failures).toContain("fewer_than_two_evidence_families");
  });

  it("rejects dimension-like edges whose E4 paths lack a shared endpoint", () => {
    const relations = [
      path("subject_output", "subject", "output", "s", "o-left", "os", "ol", "effective"),
      path("output_resource", "output", "resource", "o-right", "r", "or", "rr", "effective"),
    ];

    expect(findE4Witness("A04", relations)).toBeNull();
  });

  it("rejects an E4 join that shares object text but not origin cluster", () => {
    const relations = [
      path("subject_output", "subject", "output", "s", "o", "os", "left-origin", "effective"),
      path("output_resource", "output", "resource", "o", "r", "right-origin", "rr", "effective"),
    ];

    expect(findE4Witness("A04", relations)).toBeNull();
  });

  it("accepts only the concrete shared endpoint and matching origin witness", () => {
    const relations = [
      path("subject_output", "subject", "output", "s", "o", "os", "shared", "effective"),
      path("output_resource", "output", "resource", "o", "r", "shared", "rr", "effective"),
    ];

    expect(findE4Witness("A04", relations)).toMatchObject({
      status: "established",
      involvedObjectKeys: ["o", "r", "s"],
      originClusterKeys: ["os", "rr", "shared"].sort(),
    });
  });

  it("keeps frozen A01 E4 strict when D1 is merely limited", () => {
    const local = profile("F15");
    const e4 = local.evidenceGraph.nodes.find((node) => node.id === "e4:A01");

    expect(e4?.status).toBe("established");
    expect(e4?.supportRelationKeys).toEqual([
      "generates:f15-o>f15-r",
      "generates:f15-s>f15-o",
    ]);
    expect(local.evidenceGraph.layers.E4).toBe("established");
    expect(local.evidence.E4).toBe("candidate");
    expect(local.dimensions.D1).toBe("supply_limited");
    expect(local.tensions.A01).toBe("candidate");
    expect(local.mechanismEvaluations.A01.supportState).toBe("candidate");
  });

  it.each([
    ["hardcoded evidence families", { evidenceFamilies: ["same_origin_tension"] }],
    ["target-derived mechanism", { targetMechanism: "A01" }],
  ])("fails schema validation for %s", (_label, injected) => {
    const facts = { ...fixtureDocument.factSets.F01, ...injected };
    const input = {
      ...baseInput(),
      candidates: [{ candidateId: "c1", facts }],
    } as unknown as StaticRuleEngineInput;
    expect(() => evaluateContentRebuild(input)).toThrow(/unsupported field/);
  });
});

describe("six frozen pair boundaries", () => {
  it.each([
    ["A01_A04", "F01", "left"],
    ["A01_A04", "F13", "right"],
    ["A02_A04", "F05", "left"],
    ["A02_A04", "F13", "right"],
    ["A03_A04", "F09", "left"],
    ["A03_A04", "F13", "right"],
    ["A01_A03", "F01", "left"],
    ["A01_A03", "F09", "right"],
    ["A02_A03", "F05", "left"],
    ["A02_A03", "F09", "right"],
    ["A01_A02", "F01", "left"],
    ["A01_A02", "F05", "right"],
  ] as const)("directs %s with %s to %s", (pair, profileId, expected) => {
    const comparison = profile(profileId).nearestNeighbor.comparisons.find(
      (item) => item.pair === pair,
    );
    expect(comparison?.result).toBe(expected);
    expect(
      expected === "left"
        ? comparison?.leftMatched
        : comparison?.rightMatched,
    ).toBe(true);
    expect(
      expected === "left"
        ? comparison?.leftSupport
        : comparison?.rightSupport,
    ).toBe("strong");
  });

  it("preserves a genuine unresolved A02/A03 dual candidate", () => {
    const local = profile("F07");
    const comparison = local.nearestNeighbor.comparisons.find(
      (item) => item.pair === "A02_A03",
    );

    expect(comparison).toMatchObject({
      result: "unresolved",
      leftSupport: "weak",
      rightSupport: "weak",
    });
    expect(local.nearestNeighbor.status).toBe("ambiguous");
    expect(local.nearestNeighbor.passingMechanisms).toEqual(["A02", "A03"]);
    expect(local.coreCandidates).toEqual(["A02", "A03"]);
    expect(local.candidateState).toBe("candidate");
  });

  it("is invariant when the occurrence input order is reversed", () => {
    const facts = fixtureDocument.factSets.F07;
    const forward = evaluateSingleCandidate({ candidateId: "same", facts });
    const reverse = evaluateSingleCandidate({
      candidateId: "same",
      facts: { ...facts, occurrences: [...facts.occurrences].reverse() },
    });

    expect(reverse).toEqual(forward);
    expect(JSON.stringify(reverse)).toBe(JSON.stringify(forward));
  });

  it("resolves a boundary even when provenance prevents establishment", () => {
    const local = profile("F02");
    const comparison = local.nearestNeighbor.comparisons.find(
      (item) => item.pair === "A01_A04",
    );

    expect(local.mechanismEvaluations.A01.supportState).toBe("not_supported");
    expect(local.mechanismEvaluations.A01.gateFailures).toContain(
      "fewer_than_two_origin_clusters",
    );
    expect(comparison?.result).toBe("left");
    expect(local.nearestNeighbor.uniqueMechanism).toBe("A01");
    expect(local.candidateState).toBe("not_supported");
  });

  it("requires the frozen executable path even when D and E4 remain exact", () => {
    const local = profile("F13");
    const graph = {
      ...local.evidenceGraph,
      paths: local.evidenceGraph.paths.map((item) =>
        item.id === "conversion"
          ? { ...item, structuralStatus: "limited" as const }
          : item,
      ),
    };
    const result = evaluatePairBoundaries(
      graph,
      local.dimensions,
      noExclusions(),
    );
    const comparison = result.comparisons.find(
      (item) => item.pair === "A03_A04",
    );

    expect(local.dimensions.D4).toBe("conversion_continuous");
    expect(local.evidenceGraph.nodes.find((node) => node.id === "e4:A04")?.status)
      .toBe("established");
    expect(comparison).toMatchObject({
      result: "unresolved",
      rightMatched: false,
      rightSupport: "weak",
    });
  });

  it("distinguishes proved no-mediation from unresolved mediation", () => {
    const local = profile("F01");
    const directOnly = evaluatePairBoundaries(
      local.evidenceGraph,
      { ...local.dimensions, D3: "direct_only" },
      noExclusions(),
    );
    const unresolved = evaluatePairBoundaries(
      local.evidenceGraph,
      { ...local.dimensions, D3: "unresolved" },
      noExclusions(),
    );

    expect(
      directOnly.comparisons.find((item) => item.pair === "A01_A03")?.result,
    ).toBe("left");
    expect(
      unresolved.comparisons.find((item) => item.pair === "A01_A03")?.result,
    ).toBe("unresolved");
  });

  it("keeps single-sided weak support unresolved", () => {
    const local = profile("F15");
    const comparison = local.nearestNeighbor.comparisons.find(
      (item) => item.pair === "A01_A03",
    );

    expect(comparison).toMatchObject({
      leftSupport: "weak",
      rightSupport: "none",
      result: "unresolved",
    });
  });

  it("records pair D/path provenance as exclusion-boundary evidence", () => {
    const node = profile("F01").decisionEvidence.find(
      (item) => item.id === "e5:boundary:A01_A04",
    );

    expect(node?.evidenceFamily).toBe("exclusion_boundary");
    expect(node?.supportRelationKeys).toEqual(
      expect.arrayContaining([
        "generates:f01-i>f01-s",
        "generates:f01-s>f01-o",
        "generates:f01-o>f01-r",
      ]),
    );
  });
});

describe("relation closure, failures, and deterministic output", () => {
  it("dedupes same-origin source aliases before competition", () => {
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
    const all = result.closure.relations.filter(
      (relation) =>
        relation.kind === "generates" &&
        relation.sourceRole === "input" &&
        relation.targetRole === "subject",
    );
    const deduped = result.closure.sourceDedupedRelations.filter(
      (relation) =>
        relation.kind === "generates" &&
        relation.sourceRole === "input" &&
        relation.targetRole === "subject",
    );

    expect(result.nodeAvailability.input).toBe("usable");
    expect(all).toHaveLength(2);
    expect(deduped).toHaveLength(1);
    expect(all.every((relation) => !relation.limitedByCompetition)).toBe(true);
  });

  it("represents competition, blocked paths, and unknown paths explicitly", () => {
    const competition = profile("F08");
    expect(
      competition.closure.relations
        .filter((relation) => relation.limitedByCompetition)
        .map((relation) => relation.canonicalRelationKey),
    ).toEqual(["controls:f08-o>f08-c1", "controls:f08-o>f08-c2"]);
    expect(competition.dimensions.D5).toBe("shared_endpoint_competition");
    expect(competition.candidateState).toBe("conflicted");

    expect(profile("F05").dimensions.D1).toBe("supply_blocked");
    expect(profile("F09").dimensions.D4).toBe("conversion_blocked");

    const base = fixtureDocument.factSets.F01;
    const unknown = evaluateSingleCandidate({
      candidateId: "unknown",
      facts: {
        ...base,
        missingPositions: ["hour"],
        seasonalStrength: { ...base.seasonalStrength, resource: "unknown" },
      },
    });
    expect(unknown.nodeAvailability.resource).toBe("unknown");
    expect(unknown.dimensions.D6).toBe("unresolved");
  });

  it("propagates unknown same-role evidence as boundary-sensitive E3", () => {
    const base = fixtureDocument.factSets.F08;
    const local = evaluateSingleCandidate({
      candidateId: "unknown-same-role",
      facts: {
        ...base,
        seasonalStrength: {
          ...base.seasonalStrength,
          constraint: "unknown",
        },
      },
    });

    expect(
      local.evidenceGraph.nodes
        .filter((node) => node.layer === "E3")
        .map((node) => node.status),
    ).toContain("boundary_sensitive");
    expect(local.evidenceGraph.layers.E3).toBe("boundary_sensitive");
  });

  it("does not fabricate an E4 relation path for an absent resource", () => {
    const base = fixtureDocument.factSets.F01;
    const local = evaluateSingleCandidate({
      candidateId: "absent-resource",
      facts: {
        ...base,
        occurrences: base.occurrences.filter(
          (occurrence) => occurrence.role !== "resource",
        ),
      },
    });

    expect(local.nodeAvailability.resource).toBe("absent");
    expect(local.dimensions.D6).toBe("resource_interface_blocked");
    expect(
      local.evidenceGraph.paths.some((path) => path.id === "output_resource"),
    ).toBe(false);
    expect(local.evidenceGraph.nodes.find((node) => node.id === "e4:A01")?.status)
      .toBe("not_supported");
    expect(local.candidateState).toBe("not_supported");
  });

  it.each([
    ["invalid time basis", invalidTimeBasis()],
    ["missing seasonal role", missingSeasonalRole()],
    ["duplicate occurrence", duplicateOccurrence()],
    ["duplicate candidate", duplicateCandidate()],
    ["manually injected relation", manuallyInjectedRelation()],
    ["unsupported contact", unsupportedContact()],
  ])("fails explicitly for %s", (_label, input) => {
    expect(() => evaluateContentRebuild(input)).toThrow();
  });

  it("applies exclusions generated by legal F04/F08/F12/F16 occurrences", () => {
    for (const profileId of ["F04", "F08", "F12", "F16"]) {
      const result = profile(profileId);
      expect(result.exclusion, profileId).toBe(true);
      expect(result.candidateState, profileId).toBe("conflicted");
      expect(result.decisionEvidence.some((node) => node.id.startsWith("e5:exclusion:")))
        .toBe(true);
    }
  });

  it("records actual D3 counterpaths on A01/A04 exclusion evidence", () => {
    const A01 = profile("F04").decisionEvidence.find(
      (node) => node.id === "e5:exclusion:A01",
    );
    const A04 = profile("F16").decisionEvidence.find(
      (node) => node.id === "e5:exclusion:A04",
    );

    expect(A01?.counterRelationKeys).toEqual(
      expect.arrayContaining([
        "controls:f04-o>f04-c",
        "generates:f04-c>f04-i",
      ]),
    );
    expect(A04?.counterRelationKeys).toEqual(
      expect.arrayContaining([
        "controls:f16-o>f16-c",
        "generates:f16-c>f16-i",
      ]),
    );
  });

  it("does not mutate input, freezes output, and repeats byte-equivalent output", () => {
    const input = inputForFixture(fixtureById("CF-025"));
    const before = structuredClone(input);
    const first = evaluateContentRebuild(input);
    const second = evaluateContentRebuild(input);

    expect(input).toEqual(before);
    expect(first).toEqual(second);
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.candidateResults[0])).toBe(true);
    expect(Object.isFrozen(first.candidateResults[0].evidenceGraph.paths[0]))
      .toBe(true);
  });
});

function profile(profileId: string): CandidateEvaluation {
  return evaluateSingleCandidate({
    candidateId: profileId,
    facts: fixtureDocument.factSets[profileId],
  });
}

function withoutE6(evidence: EvidenceStates): CandidateEvaluation["evidence"] {
  return {
    E1: evidence.E1,
    E2: evidence.E2,
    E3: evidence.E3,
    E4: evidence.E4,
    E5: evidence.E5,
  };
}

function evidenceSource(
  evidenceFamily: EvidenceFamily,
  originClusterKeys: readonly string[],
) {
  return {
    evidenceFamily,
    originClusterKeys,
    involvedObjectKeys: ["object"],
    supportRelationKeys: ["relation"],
    counterRelationKeys: [],
    status: "established" as const,
  };
}

function noExclusions(): Readonly<Record<MechanismId, boolean>> {
  return { A01: false, A02: false, A03: false, A04: false };
}

function path(
  id: EvidencePathId,
  sourceRole: EvidencePath["roleSequence"][number],
  targetRole: EvidencePath["roleSequence"][number],
  sourceObjectKey: string,
  targetObjectKey: string,
  sourceOriginClusterKey: string,
  targetOriginClusterKey: string,
  effectiveness: RelationEffectiveness,
): EvidencePath {
  const relationKey = `${id}:${sourceObjectKey}>${targetObjectKey}`;
  return {
    key: `path:${relationKey}`,
    id,
    evidenceFamily: "complete_relation_closure",
    originClusterKeys: [sourceOriginClusterKey, targetOriginClusterKey].sort(),
    involvedObjectKeys: [sourceObjectKey, targetObjectKey].sort(),
    supportRelationKeys: [relationKey],
    counterRelationKeys: [],
    status:
      effectiveness === "effective"
        ? "established"
        : effectiveness === "limited"
          ? "candidate"
          : effectiveness === "blocked"
            ? "not_supported"
            : "boundary_sensitive",
    structuralStatus: effectiveness,
    roleSequence: [sourceRole, targetRole],
    objectPath: [sourceObjectKey, targetObjectKey],
    originPath: [sourceOriginClusterKey, targetOriginClusterKey],
    competesForInterface: false,
    limitedByCompetition: false,
  };
}

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
    candidates: [{ candidateId: "c1", facts: fixtureDocument.factSets.F01 }],
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
        facts: { ...fixtureDocument.factSets.F01, seasonalStrength: incomplete },
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
        facts: { ...facts, occurrences: [...facts.occurrences, facts.occurrences[0]] },
      },
    ],
  };
}

function duplicateCandidate(): StaticRuleEngineInput {
  return {
    ...baseInput(),
    candidates: [
      { candidateId: "same", facts: fixtureDocument.factSets.F01 },
      { candidateId: "same", facts: fixtureDocument.factSets.F01 },
    ],
  };
}

function manuallyInjectedRelation(): StaticRuleEngineInput {
  return {
    ...baseInput(),
    candidates: [
      {
        candidateId: "c1",
        facts: { ...fixtureDocument.factSets.F01, rawRelations: [] },
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
