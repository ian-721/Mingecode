import {
  DECISION_INTERFACE_KEYS,
  INTERFACE_PATH_IDS,
  MECHANISMS,
  type AtomicPathWitness,
  type ContentionBasis,
  type ContentionValidationErrorCode,
  type DecisionInterfaceKey,
  type E4AtomicWitness,
  type InterfaceBaseState,
  type InterfaceContentionFact,
  type InterfaceContributor,
  type InterfacePath,
  type InterfacePathId,
  type MechanismId,
  type NodeAvailabilityByRole,
  type NormalizedRelation,
  type Occurrence,
  type RelationClosure,
  type RelationInterface,
  type RelationInterfaceProjection,
  type RelationKind,
  type Role,
  type TensionState,
  type WitnessState,
} from "./types";

interface InterfaceDefinition {
  readonly interfaceKey: DecisionInterfaceKey;
  readonly pathId: InterfacePathId;
  readonly kind: RelationKind;
  readonly sourceRole: Role;
  readonly targetRole: Role;
}

interface CompoundPathDefinition {
  readonly pathId: InterfacePathId;
  readonly interfaceKeys: readonly DecisionInterfaceKey[];
}

interface ValidatedContention {
  readonly facts: readonly InterfaceContentionFact[];
  readonly matchingWitnessKeys: ReadonlyMap<string, ReadonlySet<string>>;
}

interface PathInvalidationWitness {
  readonly witnessKey: string;
  readonly atomicRelationKeys: readonly string[];
  readonly objectPath: readonly string[];
  readonly originPath: readonly string[];
}

interface PathInvalidationTopology {
  readonly interfaceKeys: readonly DecisionInterfaceKey[];
  readonly witnesses: readonly PathInvalidationWitness[];
}

const INTERFACE_DEFINITIONS: readonly InterfaceDefinition[] = [
  {
    interfaceKey: "generates:input>subject",
    pathId: "input_subject",
    kind: "generates",
    sourceRole: "input",
    targetRole: "subject",
  },
  {
    interfaceKey: "generates:subject>output",
    pathId: "subject_output",
    kind: "generates",
    sourceRole: "subject",
    targetRole: "output",
  },
  {
    interfaceKey: "generates:output>resource",
    pathId: "output_resource",
    kind: "generates",
    sourceRole: "output",
    targetRole: "resource",
  },
  {
    interfaceKey: "controls:output>constraint",
    pathId: "output_constraint",
    kind: "controls",
    sourceRole: "output",
    targetRole: "constraint",
  },
  {
    interfaceKey: "controls:constraint>subject",
    pathId: "constraint_subject",
    kind: "controls",
    sourceRole: "constraint",
    targetRole: "subject",
  },
  {
    interfaceKey: "generates:constraint>input",
    pathId: "constraint_input",
    kind: "generates",
    sourceRole: "constraint",
    targetRole: "input",
  },
] as const;

const COMPOUND_PATH_DEFINITIONS: readonly CompoundPathDefinition[] = [
  {
    pathId: "output_mediated",
    interfaceKeys: [
      "generates:subject>output",
      "controls:output>constraint",
    ],
  },
  {
    pathId: "input_mediated",
    interfaceKeys: [
      "generates:constraint>input",
      "generates:input>subject",
    ],
  },
  {
    pathId: "conversion",
    interfaceKeys: [
      "generates:input>subject",
      "generates:subject>output",
      "generates:output>resource",
    ],
  },
  {
    pathId: "output_constraint_feedback",
    interfaceKeys: [
      "generates:subject>output",
      "controls:output>constraint",
      "controls:constraint>subject",
    ],
  },
] as const;

const E4_TOPOLOGY_INTERFACE_KEYS = {
  A01: ["generates:subject>output", "generates:output>resource"],
  A02: [
    "generates:subject>output",
    "controls:output>constraint",
    "controls:constraint>subject",
  ],
  A03: [
    "generates:subject>output",
    "controls:output>constraint",
    "controls:constraint>subject",
  ],
  A04: ["generates:subject>output", "generates:output>resource"],
} as const satisfies Readonly<
  Record<MechanismId, readonly DecisionInterfaceKey[]>
>;

const BANNED_SEMANTIC_TOKENS = new Set([
  "mechanism",
  "archetype",
  "sample",
  "profile",
  "expected",
  "expectation",
  "target",
  "answer",
  "answers",
  "result",
  "outcome",
]);

const CONTENTION_FIELDS = [
  "factKey",
  "interfaceKey",
  "basis",
  "sharedEndpointObjectKey",
  "participantObjectKeys",
  "invalidatedInterfaceKeys",
  "derivationVersion",
] as const;

export function buildRelationInterfaceProjection(
  occurrences: readonly Occurrence[],
  availability: NodeAvailabilityByRole,
  closure: RelationClosure,
): RelationInterfaceProjection {
  return buildRelationInterfaceProjectionInternal(
    occurrences,
    availability,
    closure,
    [],
  );
}

// Deliberately not re-exported by lib/content-rebuild/index.ts. The environment
// gate keeps non-empty contention unreachable from ordinary runtime modules.
export function buildRelationInterfaceProjectionForFixture(
  occurrences: readonly Occurrence[],
  availability: NodeAvailabilityByRole,
  closure: RelationClosure,
  contentionInput: unknown,
): RelationInterfaceProjection {
  if (process.env.NODE_ENV !== "test") {
    throw new Error(
      "Contract fixture projection is only authorized in the isolated test harness",
    );
  }
  return buildRelationInterfaceProjectionInternal(
    occurrences,
    availability,
    closure,
    contentionInput,
  );
}

function buildRelationInterfaceProjectionInternal(
  occurrences: readonly Occurrence[],
  availability: NodeAvailabilityByRole,
  closure: RelationClosure,
  contentionInput: unknown,
): RelationInterfaceProjection {
  const relationByKey = new Map(
    closure.relations.map((relation) => [relation.canonicalRelationKey, relation]),
  );
  const contributors = buildContributors(closure.relations);
  const baseInterfaces = buildBaseInterfaces(availability, contributors);
  const basePaths = buildBasePaths(
    closure.relations,
    contributors,
    baseInterfaces,
  );
  const validated = validateContentionFacts(
    contentionInput,
    occurrences,
    contributors,
    basePaths,
    relationByKey,
  );
  const directCoverage = buildDirectCoverage(validated.facts, basePaths);
  const paths = applyPathOverlay(basePaths, validated, directCoverage);
  const interfaces = applyInterfaceProvenance(baseInterfaces, validated.facts);
  const { e4Witnesses, E4 } = buildE4Witnesses(
    basePaths,
    relationByKey,
    validated,
    directCoverage,
  );

  return { contributors, interfaces, paths, e4Witnesses, E4 };
}

function buildContributors(
  relations: readonly NormalizedRelation[],
): Readonly<Record<DecisionInterfaceKey, readonly InterfaceContributor[]>> {
  const entries = INTERFACE_DEFINITIONS.map((definition) => {
    const groups = new Map<string, NormalizedRelation[]>();
    for (const relation of relations) {
      if (!relationMatchesDefinition(relation, definition)) continue;
      const group = groups.get(relation.sourceDedupeKey) ?? [];
      group.push(relation);
      groups.set(relation.sourceDedupeKey, group);
    }
    const projected = [...groups.entries()]
      .sort(([left], [right]) => ordinalCompare(left, right))
      .map(([sourceDedupeKey, group]): InterfaceContributor => {
        const sorted = [...group].sort((left, right) =>
          ordinalCompare(
            left.canonicalRelationKey,
            right.canonicalRelationKey,
          ),
        );
        const state = combineAtomicBaseStates(
          sorted.map((relation) => atomicWitnessBaseState(relation)),
        );
        return {
          interfaceKey: definition.interfaceKey,
          sourceDedupeKey,
          representativeRelationKey: sorted[0].canonicalRelationKey,
          atomicRelationKeys: sorted.map(
            (relation) => relation.canonicalRelationKey,
          ),
          sourceOriginClusterKey: sorted[0].sourceOriginClusterKey,
          targetOriginClusterKey: sorted[0].targetOriginClusterKey,
          originClusterKeys: ordinalUnique(
            sorted.flatMap((relation) => relation.originClusterKeys),
          ),
          sourceObjectKeys: ordinalUnique(
            sorted.map((relation) => relation.sourceObjectKey),
          ),
          targetObjectKeys: ordinalUnique(
            sorted.map((relation) => relation.targetObjectKey),
          ),
          state,
        };
      });
    return [definition.interfaceKey, projected] as const;
  });
  return Object.fromEntries(entries) as unknown as Readonly<
    Record<DecisionInterfaceKey, readonly InterfaceContributor[]>
  >;
}

function buildBaseInterfaces(
  availability: NodeAvailabilityByRole,
  contributors: Readonly<
    Record<DecisionInterfaceKey, readonly InterfaceContributor[]>
  >,
): Readonly<Record<DecisionInterfaceKey, RelationInterface>> {
  return Object.fromEntries(
    INTERFACE_DEFINITIONS.map((definition) => {
      const projected = contributors[definition.interfaceKey];
      const source = availability[definition.sourceRole];
      const target = availability[definition.targetRole];
      let state: InterfaceBaseState;
      if (source === "absent" || target === "absent") {
        if (projected.length > 0) {
          throw new Error(
            `Relation interface ${definition.interfaceKey} has contributors for an absent endpoint`,
          );
        }
        state = "absent";
      } else if (source === "unknown" || target === "unknown") {
        state = "unknown";
      } else {
        if (projected.length === 0) {
          throw new Error(
            `Relation interface ${definition.interfaceKey} is missing a deterministic contributor`,
          );
        }
        state =
          source === "usable" && target === "usable" ? "effective" : "limited";
      }
      const result: RelationInterface = {
        interfaceKey: definition.interfaceKey,
        state,
        contributorKeys: projected.map(
          (contributor) => contributor.sourceDedupeKey,
        ),
        atomicRelationKeys: ordinalUnique(
          projected.flatMap((contributor) => contributor.atomicRelationKeys),
        ),
        originClusterKeys: ordinalUnique(
          projected.flatMap((contributor) => contributor.originClusterKeys),
        ),
        contentionFactKeys: [],
        invalidatedByFactKeys: [],
      };
      return [definition.interfaceKey, result] as const;
    }),
  ) as unknown as Readonly<Record<DecisionInterfaceKey, RelationInterface>>;
}

function buildBasePaths(
  relations: readonly NormalizedRelation[],
  contributors: Readonly<
    Record<DecisionInterfaceKey, readonly InterfaceContributor[]>
  >,
  interfaces: Readonly<Record<DecisionInterfaceKey, RelationInterface>>,
): Readonly<Record<InterfacePathId, InterfacePath>> {
  const witnessSets = new Map<InterfacePathId, readonly AtomicPathWitness[]>();
  for (const definition of INTERFACE_DEFINITIONS) {
    const contributorByRelation = new Map<string, string>();
    for (const contributor of contributors[definition.interfaceKey]) {
      for (const relationKey of contributor.atomicRelationKeys) {
        contributorByRelation.set(relationKey, contributor.sourceDedupeKey);
      }
    }
    const witnesses = relations
      .filter((relation) => relationMatchesDefinition(relation, definition))
      .map((relation): AtomicPathWitness => {
        const contributorKey = contributorByRelation.get(
          relation.canonicalRelationKey,
        );
        if (!contributorKey) {
          throw new Error(
            `Missing contributor for ${relation.canonicalRelationKey}`,
          );
        }
        const atomicRelationKeys = [relation.canonicalRelationKey];
        return {
          witnessKey: JSON.stringify([
            definition.pathId,
            ...atomicRelationKeys,
          ]),
          pathId: definition.pathId,
          interfaceKeys: [definition.interfaceKey],
          contributorKeys: [contributorKey],
          atomicRelationKeys,
          objectPath: [relation.sourceObjectKey, relation.targetObjectKey],
          originPath: [
            relation.sourceOriginClusterKey,
            relation.targetOriginClusterKey,
          ],
          baseState: atomicWitnessBaseState(relation),
          state: atomicWitnessBaseState(relation),
          contentionFactKeys: [],
          counterRelationKeys: [],
        };
      })
      .sort((left, right) => ordinalCompare(left.witnessKey, right.witnessKey));
    witnessSets.set(definition.pathId, witnesses);
  }
  for (const definition of COMPOUND_PATH_DEFINITIONS) {
    const directWitnessSets = definition.interfaceKeys.map((interfaceKey) => {
      const directDefinition = definitionForInterface(interfaceKey);
      return witnessSets.get(directDefinition.pathId) ?? [];
    });
    witnessSets.set(
      definition.pathId,
      joinWitnesses(definition, directWitnessSets),
    );
  }

  return Object.fromEntries(
    INTERFACE_PATH_IDS.map((pathId) => {
      const definition = pathDefinition(pathId);
      const witnesses = witnessSets.get(pathId) ?? [];
      const baseState = calculatePathBaseState(
        definition.interfaceKeys.map((key) => interfaces[key].state),
        witnesses.length,
      );
      return [
        pathId,
        summarizePath(pathId, definition.interfaceKeys, baseState, witnesses),
      ] as const;
    }),
  ) as unknown as Readonly<Record<InterfacePathId, InterfacePath>>;
}

function joinWitnesses(
  definition: CompoundPathDefinition,
  witnessSets: readonly (readonly AtomicPathWitness[])[],
): readonly AtomicPathWitness[] {
  if (witnessSets.length === 0) return [];
  let joined = witnessSets[0].map((witness) => ({ ...witness }));
  for (const rightSet of witnessSets.slice(1)) {
    const next: AtomicPathWitness[] = [];
    for (const left of joined) {
      for (const right of rightSet) {
        if (!witnessesJoin(left, right)) continue;
        const atomicRelationKeys = [
          ...left.atomicRelationKeys,
          ...right.atomicRelationKeys,
        ];
        const objectPath = [...left.objectPath, ...right.objectPath.slice(1)];
        const originPath = [...left.originPath, ...right.originPath.slice(1)];
        const baseState = combineAtomicBaseStates([
          left.baseState,
          right.baseState,
        ]);
        next.push({
          witnessKey: JSON.stringify([
            definition.pathId,
            ...atomicRelationKeys,
          ]),
          pathId: definition.pathId,
          interfaceKeys: definition.interfaceKeys,
          contributorKeys: [
            ...left.contributorKeys,
            ...right.contributorKeys,
          ],
          atomicRelationKeys,
          objectPath,
          originPath,
          baseState,
          state: baseState,
          contentionFactKeys: [],
          counterRelationKeys: [],
        });
      }
    }
    joined = next;
  }
  return dedupeWitnesses(joined);
}

function summarizePath(
  pathId: InterfacePathId,
  interfaceKeys: readonly DecisionInterfaceKey[],
  baseState: InterfaceBaseState,
  witnesses: readonly AtomicPathWitness[],
): InterfacePath {
  const sortedWitnesses = [...witnesses].sort((left, right) =>
    ordinalCompare(left.witnessKey, right.witnessKey),
  );
  const representative = sortedWitnesses[0];
  return {
    pathKey: pathId,
    interfaceKeys,
    baseState,
    state: sortedWitnesses.some((witness) => witness.state === "conflicted")
      ? "conflicted"
      : baseState,
    witnessKeys: sortedWitnesses.map((witness) => witness.witnessKey),
    witnesses: sortedWitnesses,
    atomicWitnessCount: sortedWitnesses.length,
    representativeAtomicWitness: representative?.atomicRelationKeys ?? [],
    contributorKeys: ordinalUnique(
      sortedWitnesses.flatMap((witness) => witness.contributorKeys),
    ),
    atomicRelationKeys: ordinalUnique(
      sortedWitnesses.flatMap((witness) => witness.atomicRelationKeys),
    ),
    originClusterKeys: ordinalUnique(
      sortedWitnesses.flatMap((witness) => witness.originPath),
    ),
    involvedObjectKeys: ordinalUnique(
      sortedWitnesses.flatMap((witness) => witness.objectPath),
    ),
    contentionFactKeys: ordinalUnique(
      sortedWitnesses.flatMap((witness) => witness.contentionFactKeys),
    ),
    counterRelationKeys: ordinalUnique(
      sortedWitnesses.flatMap((witness) => witness.counterRelationKeys),
    ),
  };
}

function validateContentionFacts(
  input: unknown,
  occurrences: readonly Occurrence[],
  contributors: Readonly<
    Record<DecisionInterfaceKey, readonly InterfaceContributor[]>
  >,
  paths: Readonly<Record<InterfacePathId, InterfacePath>>,
  relationByKey: ReadonlyMap<string, NormalizedRelation>,
): ValidatedContention {
  scanBannedSemantics(input);
  if (!Array.isArray(input)) fail("schema_error");
  const facts = input.map(validateContentionSchema).sort((left, right) =>
    ordinalCompare(left.factKey, right.factKey),
  );

  const factKeys = new Set<string>();
  const objectKeys = new Set(
    occurrences.map((occurrence) => occurrence.objectKey),
  );
  for (const fact of facts) {
    if (factKeys.has(fact.factKey)) fail("duplicate_fact_key");
    factKeys.add(fact.factKey);
    if (
      fact.participantObjectKeys.length < 2 ||
      new Set(fact.participantObjectKeys).size !==
        fact.participantObjectKeys.length
    ) {
      fail("participant_cardinality");
    }
    if (fact.participantObjectKeys.some((key) => !objectKeys.has(key))) {
      fail("unknown_participant");
    }
  }

  const matchingWitnessKeys = new Map<string, ReadonlySet<string>>();
  for (const fact of facts) {
    if (fact.basis === "mutually_exclusive") {
      validateMutuallyExclusive(fact, contributors, paths);
    } else if (fact.basis === "shared_capacity") {
      validateSharedCapacity(fact, contributors, paths);
    } else {
      matchingWitnessKeys.set(
        fact.factKey,
        validatePathInvalidation(fact, paths, relationByKey),
      );
    }
  }
  return { facts, matchingWitnessKeys };
}

function validateContentionSchema(value: unknown): InterfaceContentionFact {
  if (!isRecord(value)) fail("schema_error");
  const keys = Object.keys(value);
  if (
    keys.length !== CONTENTION_FIELDS.length ||
    keys.some((key) => !(CONTENTION_FIELDS as readonly string[]).includes(key))
  ) {
    fail("schema_error");
  }
  if (typeof value.factKey !== "string" || value.factKey.trim().length === 0) {
    fail("schema_error");
  }
  if (
    typeof value.interfaceKey !== "string" ||
    !(DECISION_INTERFACE_KEYS as readonly string[]).includes(value.interfaceKey)
  ) {
    fail("schema_error");
  }
  if (
    typeof value.basis !== "string" ||
    ![
      "mutually_exclusive",
      "shared_capacity",
      "path_invalidating",
    ].includes(value.basis)
  ) {
    fail("schema_error");
  }
  if (
    value.sharedEndpointObjectKey !== null &&
    (typeof value.sharedEndpointObjectKey !== "string" ||
      value.sharedEndpointObjectKey.trim().length === 0)
  ) {
    fail("schema_error");
  }
  if (
    !isNonEmptyStringArray(value.participantObjectKeys) ||
    !isStringArray(value.invalidatedInterfaceKeys) ||
    value.invalidatedInterfaceKeys.some(
      (key) => !(DECISION_INTERFACE_KEYS as readonly string[]).includes(key),
    ) ||
    value.derivationVersion !== "interface_contention_v1"
  ) {
    fail("schema_error");
  }
  return {
    factKey: value.factKey,
    interfaceKey: value.interfaceKey as DecisionInterfaceKey,
    basis: value.basis as ContentionBasis,
    sharedEndpointObjectKey: value.sharedEndpointObjectKey as string | null,
    participantObjectKeys: [...value.participantObjectKeys].sort(ordinalCompare),
    invalidatedInterfaceKeys: interfaceOrderSort(
      value.invalidatedInterfaceKeys as DecisionInterfaceKey[],
    ),
    derivationVersion: "interface_contention_v1",
  };
}

function validateMutuallyExclusive(
  fact: InterfaceContentionFact,
  contributors: Readonly<
    Record<DecisionInterfaceKey, readonly InterfaceContributor[]>
  >,
  paths: Readonly<Record<InterfacePathId, InterfacePath>>,
): void {
  if (
    fact.sharedEndpointObjectKey !== null ||
    fact.invalidatedInterfaceKeys.length !== 0
  ) {
    fail("schema_error");
  }
  const direct = directPathForInterface(fact.interfaceKey, paths);
  const contributorKeys = participantContributorKeys(fact, direct);
  if (contributorKeys === null) fail("participant_interface_mismatch");
  if (new Set(contributorKeys).size < 2) fail("alias_only_contention");
  if (contributors[fact.interfaceKey].length < 2) {
    fail("alias_only_contention");
  }
}

function validateSharedCapacity(
  fact: InterfaceContentionFact,
  contributors: Readonly<
    Record<DecisionInterfaceKey, readonly InterfaceContributor[]>
  >,
  paths: Readonly<Record<InterfacePathId, InterfacePath>>,
): void {
  if (fact.invalidatedInterfaceKeys.length !== 0) fail("schema_error");
  const direct = directPathForInterface(fact.interfaceKey, paths);
  const contributorKeys = participantContributorKeys(fact, direct);
  if (contributorKeys === null) fail("participant_interface_mismatch");
  const endpoint = fact.sharedEndpointObjectKey;
  if (endpoint === null) fail("shared_endpoint_mismatch");
  const pairedContributorKeys: string[] = [];
  for (const participant of fact.participantObjectKeys) {
    const match = direct.witnesses.find((witness) =>
      endpointsMatch(witness.objectPath, endpoint, participant),
    );
    if (!match) fail("shared_endpoint_mismatch");
    pairedContributorKeys.push(...match.contributorKeys);
  }
  if (
    new Set(pairedContributorKeys).size < 2 ||
    contributors[fact.interfaceKey].length < 2
  ) {
    fail("alias_only_contention");
  }
}

function validatePathInvalidation(
  fact: InterfaceContentionFact,
  paths: Readonly<Record<InterfacePathId, InterfacePath>>,
  relationByKey: ReadonlyMap<string, NormalizedRelation>,
): ReadonlySet<string> {
  if (
    fact.invalidatedInterfaceKeys.length === 0 ||
    new Set(fact.invalidatedInterfaceKeys).size !==
      fact.invalidatedInterfaceKeys.length ||
    fact.invalidatedInterfaceKeys.includes(fact.interfaceKey)
  ) {
    fail("path_invalidation_mismatch");
  }
  const claimed = new Set([
    fact.interfaceKey,
    ...fact.invalidatedInterfaceKeys,
  ]);
  const physicalE4 = buildPhysicalE4Witnesses(paths, relationByKey);
  const topologies: readonly PathInvalidationTopology[] = [
    ...COMPOUND_PATH_DEFINITIONS.map((definition) => ({
      interfaceKeys: definition.interfaceKeys,
      witnesses: paths[definition.pathId].witnesses,
    })),
    ...MECHANISMS.map((mechanism) => ({
      interfaceKeys: E4_TOPOLOGY_INTERFACE_KEYS[mechanism],
      witnesses: physicalE4[mechanism],
    })),
  ];
  const candidates = topologies.filter(
    (topology) =>
      topology.interfaceKeys.length === claimed.size &&
      topology.interfaceKeys.every((key) => claimed.has(key)),
  );
  const matching = new Set<string>();
  for (const topology of candidates) {
    for (const witness of topology.witnesses) {
      if (
        !pathInvalidationMatchesWitness(
          fact,
          topology,
          witness,
          relationByKey,
        )
      ) {
        continue;
      }
      matching.add(witness.witnessKey);
    }
  }
  if (matching.size === 0) fail("path_invalidation_mismatch");
  return matching;
}

function pathInvalidationMatchesWitness(
  fact: InterfaceContentionFact,
  topology: PathInvalidationTopology,
  witness: PathInvalidationWitness,
  relationByKey: ReadonlyMap<string, NormalizedRelation>,
): boolean {
  if (
    witness.atomicRelationKeys.length !== topology.interfaceKeys.length ||
    witness.objectPath.length !== witness.atomicRelationKeys.length + 1 ||
    witness.originPath.length !== witness.atomicRelationKeys.length + 1 ||
    fact.participantObjectKeys.some(
      (participant) => !witness.objectPath.includes(participant),
    )
  ) {
    return false;
  }

  const relations: NormalizedRelation[] = [];
  for (let index = 0; index < topology.interfaceKeys.length; index += 1) {
    const relation = relationByKey.get(witness.atomicRelationKeys[index]);
    if (
      relation === undefined ||
      interfaceKeyForRelation(relation) !== topology.interfaceKeys[index] ||
      relation.sourceObjectKey !== witness.objectPath[index] ||
      relation.targetObjectKey !== witness.objectPath[index + 1] ||
      relation.sourceOriginClusterKey !== witness.originPath[index] ||
      relation.targetOriginClusterKey !== witness.originPath[index + 1] ||
      !fact.participantObjectKeys.some(
        (participant) =>
          participant === relation.sourceObjectKey ||
          participant === relation.targetObjectKey,
      )
    ) {
      return false;
    }
    relations.push(relation);
  }

  const endpoint = fact.sharedEndpointObjectKey;
  if (endpoint === null) return true;
  for (let index = 1; index < witness.objectPath.length - 1; index += 1) {
    if (witness.objectPath[index] !== endpoint) continue;
    const left = relations[index - 1];
    const right = relations[index];
    if (
      left.targetObjectKey === endpoint &&
      right.sourceObjectKey === endpoint &&
      left.targetOriginClusterKey === right.sourceOriginClusterKey &&
      left.targetOriginClusterKey === witness.originPath[index]
    ) {
      return true;
    }
  }
  return false;
}

function buildDirectCoverage(
  facts: readonly InterfaceContentionFact[],
  paths: Readonly<Record<InterfacePathId, InterfacePath>>,
): ReadonlyMap<string, ReadonlySet<string>> {
  const coverage = new Map<string, ReadonlySet<string>>();
  for (const fact of facts) {
    if (fact.basis === "path_invalidating") {
      coverage.set(fact.factKey, new Set());
      continue;
    }
    const direct = directPathForInterface(fact.interfaceKey, paths);
    const covered = new Set<string>();
    for (const witness of direct.witnesses) {
      if (fact.basis === "mutually_exclusive") {
        if (
          witness.objectPath.some((objectKey) =>
            fact.participantObjectKeys.includes(objectKey),
          )
        ) {
          covered.add(witness.atomicRelationKeys[0]);
        }
      } else {
        const endpoint = fact.sharedEndpointObjectKey;
        if (
          endpoint !== null &&
          fact.participantObjectKeys.some((participant) =>
            endpointsMatch(witness.objectPath, endpoint, participant),
          )
        ) {
          covered.add(witness.atomicRelationKeys[0]);
        }
      }
    }
    coverage.set(fact.factKey, covered);
  }
  return coverage;
}

function applyPathOverlay(
  basePaths: Readonly<Record<InterfacePathId, InterfacePath>>,
  validated: ValidatedContention,
  directCoverage: ReadonlyMap<string, ReadonlySet<string>>,
): Readonly<Record<InterfacePathId, InterfacePath>> {
  return Object.fromEntries(
    INTERFACE_PATH_IDS.map((pathId) => {
      const basePath = basePaths[pathId];
      const witnesses = basePath.witnesses.map((witness) => {
        const factKeys = validated.facts
          .filter((fact) => {
            if (fact.basis === "path_invalidating") {
              return (
                validated.matchingWitnessKeys
                  .get(fact.factKey)
                  ?.has(witness.witnessKey) ?? false
              );
            }
            const covered = directCoverage.get(fact.factKey) ?? new Set();
            return witness.atomicRelationKeys.some((key) => covered.has(key));
          })
          .map((fact) => fact.factKey);
        if (factKeys.length === 0) return witness;
        return {
          ...witness,
          state: "conflicted" as const,
          contentionFactKeys: ordinalUnique(factKeys),
          counterRelationKeys: ordinalUnique(witness.atomicRelationKeys),
        };
      });
      return [
        pathId,
        summarizePath(
          pathId,
          basePath.interfaceKeys,
          basePath.baseState,
          witnesses,
        ),
      ] as const;
    }),
  ) as unknown as Readonly<Record<InterfacePathId, InterfacePath>>;
}

function applyInterfaceProvenance(
  interfaces: Readonly<Record<DecisionInterfaceKey, RelationInterface>>,
  facts: readonly InterfaceContentionFact[],
): Readonly<Record<DecisionInterfaceKey, RelationInterface>> {
  return Object.fromEntries(
    DECISION_INTERFACE_KEYS.map((interfaceKey) => [
      interfaceKey,
      {
        ...interfaces[interfaceKey],
        contentionFactKeys: facts
          .filter((fact) => fact.interfaceKey === interfaceKey)
          .map((fact) => fact.factKey),
        invalidatedByFactKeys: facts
          .filter((fact) => fact.invalidatedInterfaceKeys.includes(interfaceKey))
          .map((fact) => fact.factKey),
      },
    ]),
  ) as unknown as Readonly<Record<DecisionInterfaceKey, RelationInterface>>;
}

function buildE4Witnesses(
  basePaths: Readonly<Record<InterfacePathId, InterfacePath>>,
  relationByKey: ReadonlyMap<string, NormalizedRelation>,
  validated: ValidatedContention,
  directCoverage: ReadonlyMap<string, ReadonlySet<string>>,
): Pick<RelationInterfaceProjection, "e4Witnesses" | "E4"> {
  const physical = buildPhysicalE4Witnesses(basePaths, relationByKey);

  const e4Witnesses = Object.fromEntries(
    MECHANISMS.map((mechanism) => {
      const witnesses = physical[mechanism]
        .map((witness) => {
          const factKeys = validated.facts
            .filter((fact) => {
              if (fact.basis !== "path_invalidating") {
                const covered = directCoverage.get(fact.factKey) ?? new Set();
                return witness.atomicRelationKeys.some((key) => covered.has(key));
              }
              return (
                validated.matchingWitnessKeys
                  .get(fact.factKey)
                  ?.has(witness.witnessKey) ?? false
              );
            })
            .map((fact) => fact.factKey);
          if (factKeys.length === 0) return witness;
          return {
            ...witness,
            state: "conflicted" as const,
            contentionFactKeys: ordinalUnique(factKeys),
            counterRelationKeys: ordinalUnique(witness.atomicRelationKeys),
          };
        })
        .sort((left, right) => ordinalCompare(left.witnessKey, right.witnessKey));
      return [mechanism, witnesses] as const;
    }),
  ) as unknown as Readonly<Record<MechanismId, readonly E4AtomicWitness[]>>;
  const E4 = Object.fromEntries(
    MECHANISMS.map((mechanism) => [
      mechanism,
      aggregateE4States(e4Witnesses[mechanism].map((witness) => witness.state)),
    ]),
  ) as unknown as Readonly<Record<MechanismId, TensionState>>;
  return { e4Witnesses, E4 };
}

function buildPhysicalE4Witnesses(
  basePaths: Readonly<Record<InterfacePathId, InterfacePath>>,
  relationByKey: ReadonlyMap<string, NormalizedRelation>,
): Readonly<Record<MechanismId, readonly E4AtomicWitness[]>> {
  return {
    A01: joinE4DirectWitnesses(
      "A01",
      [basePaths.subject_output.witnesses, basePaths.output_resource.witnesses],
      relationByKey,
    ),
    A02: joinE4DirectWitnesses(
      "A02",
      [
        basePaths.subject_output.witnesses,
        basePaths.output_constraint.witnesses,
        basePaths.constraint_subject.witnesses,
      ],
      relationByKey,
      true,
    ),
    A03: joinE4DirectWitnesses(
      "A03",
      [
        basePaths.subject_output.witnesses,
        basePaths.output_constraint.witnesses,
        basePaths.constraint_subject.witnesses,
      ],
      relationByKey,
    ),
    A04: joinE4DirectWitnesses(
      "A04",
      [basePaths.subject_output.witnesses, basePaths.output_resource.witnesses],
      relationByKey,
    ),
  } satisfies Record<MechanismId, readonly E4AtomicWitness[]>;
}

function joinE4DirectWitnesses(
  mechanism: MechanismId,
  witnessSets: readonly (readonly AtomicPathWitness[])[],
  relationByKey: ReadonlyMap<string, NormalizedRelation>,
  requireCycle = false,
): readonly E4AtomicWitness[] {
  const compound = joinWitnesses(
    {
      pathId:
        witnessSets.length === 2 ? "conversion" : "output_constraint_feedback",
      interfaceKeys:
        witnessSets.length === 2
          ? ["generates:subject>output", "generates:output>resource"]
          : [
              "generates:subject>output",
              "controls:output>constraint",
              "controls:constraint>subject",
            ],
    },
    witnessSets,
  );
  return compound
    .filter(
      (witness) =>
        !requireCycle ||
        (witness.objectPath[0] === witness.objectPath.at(-1) &&
          witness.originPath[0] === witness.originPath.at(-1)),
    )
    .map((witness): E4AtomicWitness => {
      const states = witness.atomicRelationKeys.map((key) => {
        const relation = relationByKey.get(key);
        if (!relation) throw new Error(`Missing E4 atomic relation: ${key}`);
        return atomicWitnessBaseState(relation);
      });
      return {
        witnessKey: JSON.stringify([
          `e4:${mechanism}`,
          ...witness.atomicRelationKeys,
        ]),
        mechanism,
        contributorKeys: witness.contributorKeys,
        atomicRelationKeys: witness.atomicRelationKeys,
        objectPath: witness.objectPath,
        originPath: witness.originPath,
        absenceInterfaceKeys: [],
        baseState: combineAtomicBaseStates(states),
        contentionFactKeys: [],
        counterRelationKeys: [],
        state: calculateE4WitnessState(mechanism, states),
      };
    })
    .sort((left, right) => ordinalCompare(left.witnessKey, right.witnessKey));
}

function calculateE4WitnessState(
  mechanism: MechanismId,
  states: readonly Exclude<InterfaceBaseState, "absent">[],
): TensionState {
  if (states.includes("unknown")) return "not_supported";
  if (
    mechanism === "A01" &&
    states[0] === "effective" &&
    states[1] === "limited"
  ) {
    return "established";
  }
  if (
    mechanism === "A02" &&
    states[0] === "limited" &&
    states[1] === "effective" &&
    states[2] === "limited"
  ) {
    return "established";
  }
  if (mechanism === "A03" && states.every((state) => state === "effective")) {
    return "established";
  }
  if (
    mechanism === "A04" &&
    states[0] === "effective" &&
    states[1] === "effective"
  ) {
    return "established";
  }
  if (
    mechanism === "A01" &&
    states[0] === "limited" &&
    states[1] === "limited"
  ) {
    return "candidate";
  }
  if (
    mechanism === "A02" &&
    states[0] === "limited" &&
    states.every(
      (state) => state === "effective" || state === "limited",
    )
  ) {
    return "candidate";
  }
  if (
    (mechanism === "A03" || mechanism === "A04") &&
    states.every(
      (state) => state === "effective" || state === "limited",
    ) &&
    states.includes("limited")
  ) {
    return "candidate";
  }
  return "not_supported";
}

function aggregateE4States(states: readonly TensionState[]): TensionState {
  if (states.includes("conflicted")) return "conflicted";
  if (states.includes("established")) return "established";
  if (states.includes("candidate")) return "candidate";
  return "not_supported";
}

function participantContributorKeys(
  fact: InterfaceContentionFact,
  direct: InterfacePath,
): readonly string[] | null {
  const keys: string[] = [];
  for (const participant of fact.participantObjectKeys) {
    const matches = direct.witnesses.filter((witness) =>
      witness.objectPath.includes(participant),
    );
    if (matches.length === 0) return null;
    keys.push(...matches.flatMap((witness) => witness.contributorKeys));
  }
  return ordinalUnique(keys);
}

function directPathForInterface(
  interfaceKey: DecisionInterfaceKey,
  paths: Readonly<Record<InterfacePathId, InterfacePath>>,
): InterfacePath {
  return paths[definitionForInterface(interfaceKey).pathId];
}

function relationMatchesDefinition(
  relation: NormalizedRelation,
  definition: InterfaceDefinition,
): boolean {
  return (
    relation.kind === definition.kind &&
    relation.sourceRole === definition.sourceRole &&
    relation.targetRole === definition.targetRole
  );
}

function interfaceKeyForRelation(
  relation: NormalizedRelation,
): DecisionInterfaceKey | null {
  return (
    INTERFACE_DEFINITIONS.find((definition) =>
      relationMatchesDefinition(relation, definition),
    )?.interfaceKey ?? null
  );
}

function definitionForInterface(
  interfaceKey: DecisionInterfaceKey,
): InterfaceDefinition {
  const definition = INTERFACE_DEFINITIONS.find(
    (item) => item.interfaceKey === interfaceKey,
  );
  if (!definition) throw new Error(`Missing interface definition: ${interfaceKey}`);
  return definition;
}

function pathDefinition(
  pathId: InterfacePathId,
): Pick<CompoundPathDefinition, "interfaceKeys"> {
  const direct = INTERFACE_DEFINITIONS.find((item) => item.pathId === pathId);
  if (direct) return { interfaceKeys: [direct.interfaceKey] };
  const compound = COMPOUND_PATH_DEFINITIONS.find(
    (item) => item.pathId === pathId,
  );
  if (!compound) throw new Error(`Missing path definition: ${pathId}`);
  return compound;
}

function witnessesJoin(
  left: AtomicPathWitness,
  right: AtomicPathWitness,
): boolean {
  return (
    left.objectPath.at(-1) === right.objectPath[0] &&
    left.originPath.at(-1) === right.originPath[0]
  );
}

function endpointsMatch(
  objectPath: readonly string[],
  left: string,
  right: string,
): boolean {
  return (
    (objectPath[0] === left && objectPath.at(-1) === right) ||
    (objectPath[0] === right && objectPath.at(-1) === left)
  );
}

function calculatePathBaseState(
  states: readonly InterfaceBaseState[],
  witnessCount: number,
): InterfaceBaseState {
  if (states.includes("absent")) return "absent";
  if (states.includes("unknown")) return "unknown";
  if (witnessCount === 0) return "absent";
  if (states.includes("limited")) return "limited";
  return "effective";
}

function atomicWitnessBaseState(
  relation: NormalizedRelation,
): Exclude<InterfaceBaseState, "absent"> {
  if (relation.effectiveness === "blocked") {
    throw new Error(
      `Atomic interface witness cannot be blocked: ${relation.canonicalRelationKey}`,
    );
  }
  return relation.effectiveness;
}

function combineAtomicBaseStates(
  states: readonly Exclude<InterfaceBaseState, "absent">[],
): Exclude<InterfaceBaseState, "absent"> {
  if (states.includes("unknown")) return "unknown";
  if (states.includes("limited")) return "limited";
  return "effective";
}

function dedupeWitnesses(
  witnesses: readonly AtomicPathWitness[],
): readonly AtomicPathWitness[] {
  const byKey = new Map<string, AtomicPathWitness>();
  for (const witness of witnesses) {
    if (!byKey.has(witness.witnessKey)) byKey.set(witness.witnessKey, witness);
  }
  return [...byKey.values()].sort((left, right) =>
    ordinalCompare(left.witnessKey, right.witnessKey),
  );
}

function scanBannedSemantics(value: unknown): void {
  if (Array.isArray(value)) {
    for (const item of value) scanBannedSemantics(item);
    return;
  }
  if (!isRecord(value)) return;
  for (const [key, child] of Object.entries(value)) {
    if (containsBannedToken(key)) fail("banned_semantic_field");
    if (key === "factKey" && typeof child === "string" && containsBannedToken(child)) {
      fail("banned_semantic_field");
    }
    scanBannedSemantics(child);
  }
}

function containsBannedToken(value: string): boolean {
  const normalized = value
    .normalize("NFKC")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase();
  return normalized
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .some((token) => BANNED_SEMANTIC_TOKENS.has(token));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNonEmptyStringArray(value: unknown): value is string[] {
  return (
    isStringArray(value) && value.every((item) => item.trim().length > 0)
  );
}

function fail(code: ContentionValidationErrorCode): never {
  throw new Error(code);
}

export function ordinalCompare(left: string, right: string): number {
  return left === right ? 0 : left < right ? -1 : 1;
}

function ordinalUnique<T extends string>(values: readonly T[]): T[] {
  return [...new Set(values)].sort(ordinalCompare);
}

function interfaceOrderSort(
  values: readonly DecisionInterfaceKey[],
): DecisionInterfaceKey[] {
  const rank = new Map(
    DECISION_INTERFACE_KEYS.map((key, index) => [key, index] as const),
  );
  return [...values].sort(
    (left, right) => (rank.get(left) ?? 0) - (rank.get(right) ?? 0),
  );
}

export function interfacePathStateToEffectiveness(
  state: InterfacePath["state"],
): "effective" | "limited" | "blocked" | "unknown" | "conflicted" {
  if (state === "absent") return "blocked";
  return state;
}

export function interfacePathStateToWitnessState(
  state: Exclude<InterfacePath["state"], "absent">,
): WitnessState {
  return state;
}
