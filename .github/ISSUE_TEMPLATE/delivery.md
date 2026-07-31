---
name: Delivery
about: Define one Owner-verifiable product or system outcome
title: ""
labels: ""
assignees: ""
---

# Outcome

<!-- Describe one result the Owner can directly verify, use, or experience. Do not describe activities or phases. -->

# Why Now

<!-- State the user value, current bottleneck, defect, or opportunity that makes this the next priority. -->

# Authorization

<!-- Keep exactly one active value: DISCOVERY | PLAN | IMPLEMENT | MERGE | RELEASE -->

`DISCOVERY`

# Status

<!-- Keep exactly one active value: READY | RUNNING | OWNER_REVIEW | BLOCKED | DONE -->

`READY`

# Source of Truth

<!-- Link only the product, ADR, contract, specification, design reference, issue, or prior accepted result needed for this delivery. Follow docs/HARNESS.md precedence. -->

- `docs/HARNESS.md`
-

# Scope

## Allowed

-

## Not Allowed

-

# Product Quality Bar

<!-- Define the approved content, visual, interaction, animation, audio, usability, readability, or experience level. “Minimum sufficient” must not reduce approved product quality. -->

-

# Acceptance

## Engineering

-

## Product Candidate

<!-- Define what must be directly inspectable before Owner review. -->

-

## Owner Review Artifact

<!-- Preview URL, screenshots, recording, APK, packaged build, document, or another directly accessible artifact. -->

-

# Stop or Escalate Only If

- The root cause or approved solution materially changes.
- The task requires an unapproved dependency, service, purchase, permission, infrastructure change, or irreversible action.
- The approved quality cannot be achieved within the allowed scope.
- The required change exceeds the current authorization level.

# Completion Rule

- Pull Requests provide implementation evidence but do not redefine authorization or Status.
- Engineering checks do not equal product acceptance.
- Before Owner acceptance, report: `Candidate ready for Owner review.`
- After the Owner explicitly accepts the result, set Status to `DONE` and stop.
- Do not create a next phase or adjacent task unless it has already been selected as the next priority.
