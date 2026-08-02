import { describe, expect, it } from "vitest";
import fixtureJson from "@/research/content-rebuild/v0.5/fixtures/archetype-fixtures.v0.3.json";
import { evaluateContentRebuildForFixture } from "@/lib/content-rebuild/engine";
import type {
  ChartFacts,
  DecisionInterfaceKey,
  InterfacePath,
  InterfaceContentionFact,
  InterfacePathId,
  MechanismId,
  StaticRuleEngineInput,
} from "@/lib/content-rebuild/types";

interface CandidateInput {
  readonly candidateId: string;
  readonly factSetRef: string;
  readonly interfaceContentionFacts?: readonly InterfaceContentionFact[];
}

interface CaseInput {
  readonly candidates: readonly CandidateInput[];
  readonly manifestationAnswers?: StaticRuleEngineInput["manifestationAnswers"];
}

interface ContractCase {
  readonly id: string;
  readonly input: CaseInput;
  readonly expected?: unknown;
}

interface PathInvalidatingExpected {
  readonly matchedWitnessKeys: readonly string[];
  readonly unmatchedWitnessKeys: readonly string[];
  readonly unchangedDirectPathKeys: readonly InterfacePathId[];
  readonly unchangedCompoundPathKeys: readonly InterfacePathId[];
  readonly unchangedE4Mechanisms: readonly MechanismId[];
  readonly contentionFactKeysByInterface: Partial<
    Readonly<Record<DecisionInterfaceKey, readonly string[]>>
  >;
  readonly invalidatedByFactKeysByInterface: Partial<
    Readonly<Record<DecisionInterfaceKey, readonly string[]>>
  >;
}

interface InvalidCase extends ContractCase {
  readonly expectedError: string;
}

interface FixtureDocument {
  readonly timeConventionVersion: "civil_time_v1";
  readonly factSets: Readonly<Record<string, ChartFacts>>;
  readonly contractFactSets: Readonly<Record<string, ChartFacts>>;
  readonly diagnosticFactSets: Readonly<Record<string, ChartFacts>>;
  readonly fixtures: readonly ContractCase[];
  readonly contractCases: readonly ContractCase[];
  readonly invalidContentionCases: readonly InvalidCase[];
}

const fixture = fixtureJson as unknown as FixtureDocument;

describe("InterfaceContentionFact exact validator", () => {
  it("returns all six fixture-defined stable provenance errors", () => {
    expect(fixture.invalidContentionCases).toHaveLength(6);
    for (const testCase of fixture.invalidContentionCases) {
      expect(() => evaluateContentRebuildForFixture(inputFor(testCase.input)), testCase.id)
        .toThrow(testCase.expectedError);
    }
  });

  it("returns schema_error for an eighth caller-trust field", () => {
    const input = inputFor(fixtureCase("CF-013").input);
    const first = input.candidates[0].interfaceContentionFacts?.[0];
    if (!first) throw new Error("Missing CF-013 contention fact");
    const modified = replaceContentionFacts(input, [
      { ...first, trusted: true } as unknown as InterfaceContentionFact,
    ]);
    expect(() => evaluateContentRebuildForFixture(modified)).toThrow("schema_error");
  });

  it("returns duplicate_fact_key before basis validation", () => {
    const input = inputFor(fixtureCase("CF-013").input);
    const facts = input.candidates[0].interfaceContentionFacts;
    if (!facts || facts.length !== 2) throw new Error("Missing CF-013 facts");
    const modified = replaceContentionFacts(input, [
        facts[0],
        { ...facts[1], factKey: facts[0].factKey },
      ]);
    expect(() => evaluateContentRebuildForFixture(modified)).toThrow(
      "duplicate_fact_key",
    );
  });

  it("returns participant_cardinality for duplicate or short participants", () => {
    const input = inputFor(fixtureCase("CF-013").input);
    const first = input.candidates[0].interfaceContentionFacts?.[0];
    if (!first) throw new Error("Missing CF-013 fact");
    const modified = replaceContentionFacts(input, [
        { ...first, participantObjectKeys: ["f08-c1", "f08-c1"] },
      ]);
    expect(() => evaluateContentRebuildForFixture(modified)).toThrow(
      "participant_cardinality",
    );
  });

  it("returns participant_interface_mismatch for existing off-interface objects", () => {
    const input = inputFor(fixtureCase("CF-013").input);
    const first = input.candidates[0].interfaceContentionFacts?.[0];
    if (!first) throw new Error("Missing CF-013 fact");
    const modified = replaceContentionFacts(input, [
        { ...first, participantObjectKeys: ["f08-c1", "f08-s"] },
      ]);
    expect(() => evaluateContentRebuildForFixture(modified)).toThrow(
      "participant_interface_mismatch",
    );
  });

  it("runs recursive banned semantics across all facts before schema or basis", () => {
    const input = inputFor(fixtureCase("CF-013").input);
    const facts = input.candidates[0].interfaceContentionFacts;
    if (!facts || facts.length !== 2) throw new Error("Missing CF-013 facts");
    const invalidBasis = {
      ...facts[0],
      sharedEndpointObjectKey: "f08-s",
    };
    const laterBanned = {
      ...facts[1],
      metadata: { target: "neutral" },
    } as unknown as InterfaceContentionFact;
    const modified = replaceContentionFacts(input, [invalidBasis, laterBanned]);
    expect(() => evaluateContentRebuildForFixture(modified)).toThrow(
      "banned_semantic_field",
    );
  });

  it("runs banned semantics before rejecting a non-array payload", () => {
    const input = inputFor(fixtureCase("CF-013").input);
    const modified = {
      ...input,
      candidates: [
        {
          ...input.candidates[0],
          interfaceContentionFacts: { target: "neutral" },
        },
      ],
    } as unknown as StaticRuleEngineInput;
    expect(() => evaluateContentRebuildForFixture(modified)).toThrow(
      "banned_semantic_field",
    );
  });

  it("detects camelCase banned tokens inside factKey after NFKC normalization", () => {
    const input = inputFor(fixtureCase("CF-013").input);
    const first = input.candidates[0].interfaceContentionFacts?.[0];
    if (!first) throw new Error("Missing CF-013 fact");
    const modified = replaceContentionFacts(input, [
        { ...first, factKey: "icf:ｅｘｐｅｃｔｅｄResult" },
      ]);
    expect(() => evaluateContentRebuildForFixture(modified)).toThrow(
      "banned_semantic_field",
    );
  });

  it("detects banned tokens after an acronym-to-Pascal boundary", () => {
    const input = inputFor(fixtureCase("CF-013").input);
    const first = input.candidates[0].interfaceContentionFacts?.[0];
    if (!first) throw new Error("Missing CF-013 fact");
    const modified = replaceContentionFacts(input, [
      { ...first, factKey: "icf:fooURLTarget" },
    ]);
    expect(() => evaluateContentRebuildForFixture(modified)).toThrow(
      "banned_semantic_field",
    );
  });

  it("rejects a path_invalidating topology subset", () => {
    const input = inputFor(contractCase("MC-007").input);
    const first = input.candidates[0].interfaceContentionFacts?.[0];
    if (!first) throw new Error("Missing MC-007 contention fact");
    const modified = replaceContentionFacts(input, [
      {
        ...first,
        invalidatedInterfaceKeys: ["generates:subject>output"],
      },
    ]);
    expect(() => evaluateContentRebuildForFixture(modified)).toThrow(
      "path_invalidation_mismatch",
    );
  });
});

describe("witness-level contention overlays", () => {
  it("covers direct and containing compound witnesses for mutually_exclusive", () => {
    const result = evaluateContentRebuildForFixture(
      inputFor(contractCase("MC-006").input),
    ).candidateResults[0];
    expect(result.paths.input_subject.state).toBe("conflicted");
    expect(result.paths.conversion.state).toBe("conflicted");
    expect(result.interfaces["generates:input>subject"].contentionFactKeys)
      .toEqual(["icf:independent-input-mutual-exclusion"]);
    for (const key of Object.keys(result.interfaces)) {
      if (key === "generates:input>subject") continue;
      expect(result.interfaces[key as keyof typeof result.interfaces].contentionFactKeys)
        .toEqual([]);
    }
  });

  it("limits path_invalidating to the exact concrete witness", () => {
    const testCase = contractCase("MC-007");
    const expected = testCase.expected as PathInvalidatingExpected;
    const overlayInput = inputFor(testCase.input);
    const baseInput = replaceContentionFacts(overlayInput, []);
    const overlay = evaluateContentRebuildForFixture(overlayInput)
      .candidateResults[0];
    const base = evaluateContentRebuildForFixture(baseInput).candidateResults[0];
    const factKey = overlayInput.candidates[0].interfaceContentionFacts?.[0]
      ?.factKey;
    if (!factKey) throw new Error("Missing MC-007 factKey");

    expect(overlay.paths.conversion.witnessKeys).toEqual(
      [...expected.matchedWitnessKeys, ...expected.unmatchedWitnessKeys].sort(),
    );
    for (const witnessKey of expected.matchedWitnessKeys) {
      const witness = overlay.paths.conversion.witnesses.find(
        (item) => item.witnessKey === witnessKey,
      );
      if (!witness) throw new Error(`Missing matched witness ${witnessKey}`);
      expect(witness.state).toBe("conflicted");
      expect(witness.contentionFactKeys).toEqual([factKey]);
      expect(witness.counterRelationKeys).toEqual(
        [...witness.atomicRelationKeys].sort(),
      );
    }
    for (const witnessKey of expected.unmatchedWitnessKeys) {
      const witness = overlay.paths.conversion.witnesses.find(
        (item) => item.witnessKey === witnessKey,
      );
      const baseWitness = base.paths.conversion.witnesses.find(
        (item) => item.witnessKey === witnessKey,
      );
      expect(JSON.stringify(witness), witnessKey).toBe(
        JSON.stringify(baseWitness),
      );
    }
    expect(overlay.paths.conversion.state).toBe("conflicted");
    expect(withoutPathOverlay(overlay.paths.conversion)).toEqual(
      base.paths.conversion,
    );

    for (const pathId of [
      ...expected.unchangedDirectPathKeys,
      ...expected.unchangedCompoundPathKeys,
    ]) {
      expect(JSON.stringify(overlay.paths[pathId]), pathId).toBe(
        JSON.stringify(base.paths[pathId]),
      );
    }
    for (const mechanism of expected.unchangedE4Mechanisms) {
      expect(JSON.stringify(overlay.e4Witnesses[mechanism]), mechanism).toBe(
        JSON.stringify(base.e4Witnesses[mechanism]),
      );
      expect(e4State(overlay, mechanism), mechanism).toBe(
        e4State(base, mechanism),
      );
    }

    for (const interfaceKey of Object.keys(
      overlay.interfaces,
    ) as DecisionInterfaceKey[]) {
      expect(overlay.interfaces[interfaceKey].contentionFactKeys).toEqual(
        expected.contentionFactKeysByInterface[interfaceKey] ?? [],
      );
      expect(overlay.interfaces[interfaceKey].invalidatedByFactKeys).toEqual(
        expected.invalidatedByFactKeysByInterface[interfaceKey] ?? [],
      );
      expect({
        ...overlay.interfaces[interfaceKey],
        contentionFactKeys: [],
        invalidatedByFactKeys: [],
      }).toEqual(base.interfaces[interfaceKey]);
    }
  });

  it("covers only exact E4-topology witnesses without changing any path", () => {
    const baseInput = inputFor({
      candidates: [
        { candidateId: "candidate", factSetRef: "M01_ALIAS" },
      ],
    });
    const factKey = "icf:two-edge-invalidation";
    const overlayInput = replaceContentionFacts(baseInput, [
      {
        factKey,
        interfaceKey: "generates:subject>output",
        basis: "path_invalidating",
        sharedEndpointObjectKey: "f13-o",
        participantObjectKeys: ["f13-o", "f13-r", "f13-s"],
        invalidatedInterfaceKeys: ["generates:output>resource"],
        derivationVersion: "interface_contention_v1",
      },
    ]);
    const base = evaluateContentRebuildForFixture(baseInput).candidateResults[0];
    const overlay = evaluateContentRebuildForFixture(overlayInput)
      .candidateResults[0];

    for (const pathId of Object.keys(base.paths) as InterfacePathId[]) {
      expect(JSON.stringify(overlay.paths[pathId]), pathId).toBe(
        JSON.stringify(base.paths[pathId]),
      );
    }
    for (const mechanism of ["A01", "A04"] as const) {
      expect(overlay.e4Witnesses[mechanism]).not.toHaveLength(0);
      expect(
        overlay.e4Witnesses[mechanism].every(
          (witness) =>
            witness.state === "conflicted" &&
            witness.contentionFactKeys.length === 1 &&
            witness.contentionFactKeys[0] === factKey,
        ),
      ).toBe(true);
      expect(e4State(overlay, mechanism)).toBe("conflicted");
    }
    for (const mechanism of ["A02", "A03"] as const) {
      expect(JSON.stringify(overlay.e4Witnesses[mechanism])).toBe(
        JSON.stringify(base.e4Witnesses[mechanism]),
      );
    }
    expect(
      overlay.interfaces["generates:subject>output"].contentionFactKeys,
    ).toEqual([factKey]);
    expect(
      overlay.interfaces["generates:output>resource"].invalidatedByFactKeys,
    ).toEqual([factKey]);
  });

  it("does not rewrite base path, interface, or atomic states", () => {
    const result = evaluateContentRebuildForFixture(
      inputFor(fixtureCase("CF-013").input),
    ).candidateResults[0];
    expect(result.paths.output_constraint).toMatchObject({
      baseState: "effective",
      state: "conflicted",
    });
    expect(result.paths.constraint_subject).toMatchObject({
      baseState: "limited",
      state: "conflicted",
    });
    expect(result.interfaces["controls:output>constraint"].state).toBe(
      "effective",
    );
    expect(
      result.closure.relations.every(
        (relation) => !Object.hasOwn(relation, "competesForInterface"),
      ),
    ).toBe(true);
  });
});

describe("source-deduped contributor keys", () => {
  it("uses the exact collision-free five-item JSON tuple", () => {
    for (const facts of Object.values({
      ...fixture.factSets,
      ...fixture.contractFactSets,
      ...fixture.diagnosticFactSets,
    })) {
      const result = evaluateContentRebuildForFixture({
        timeBasisVersion: "civil_time_v1",
        candidates: [{ candidateId: "tuple", facts }],
      }).candidateResults[0];
      for (const relation of result.closure.relations) {
        expect(relation.sourceDedupeKey).toBe(
          JSON.stringify([
            relation.kind,
            relation.sourceRole,
            relation.targetRole,
            relation.sourceOriginClusterKey,
            relation.targetOriginClusterKey,
          ]),
        );
      }
    }
  });
});

function inputFor(input: CaseInput): StaticRuleEngineInput {
  const factSets = {
    ...fixture.factSets,
    ...fixture.contractFactSets,
    ...fixture.diagnosticFactSets,
  };
  return {
    timeBasisVersion: fixture.timeConventionVersion,
    candidates: input.candidates.map((item) => ({
      candidateId: item.candidateId,
      facts: factSets[item.factSetRef],
      ...(item.interfaceContentionFacts
        ? { interfaceContentionFacts: item.interfaceContentionFacts }
        : {}),
    })),
    ...(input.manifestationAnswers
      ? { manifestationAnswers: input.manifestationAnswers }
      : {}),
  };
}

function fixtureCase(id: string): ContractCase {
  const result = fixture.fixtures.find((item) => item.id === id);
  if (!result) throw new Error(`Missing fixture ${id}`);
  return result;
}

function contractCase(id: string): ContractCase {
  const result = fixture.contractCases.find((item) => item.id === id);
  if (!result) throw new Error(`Missing contract case ${id}`);
  return result;
}

function replaceContentionFacts(
  input: StaticRuleEngineInput,
  facts: readonly InterfaceContentionFact[],
): StaticRuleEngineInput {
  return {
    ...input,
    candidates: input.candidates.map((candidate, index) =>
      index === 0 ? { ...candidate, interfaceContentionFacts: facts } : candidate,
    ),
  };
}

function withoutPathOverlay(path: InterfacePath): InterfacePath {
  return {
    ...path,
    state: path.baseState,
    contentionFactKeys: [],
    counterRelationKeys: [],
    witnesses: path.witnesses.map((witness) => ({
      ...witness,
      state: witness.baseState,
      contentionFactKeys: [],
      counterRelationKeys: [],
    })),
  };
}

function e4State(
  candidate: ReturnType<typeof evaluateContentRebuildForFixture>["candidateResults"][number],
  mechanism: MechanismId,
) {
  const node = candidate.evidenceGraph.nodes.find(
    (item) => item.id === candidate.evidenceGraph.e4NodeIds[mechanism],
  );
  if (!node) throw new Error(`Missing E4 node ${mechanism}`);
  return node.status;
}
