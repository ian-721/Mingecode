# Mingecode (命格译码)

**Not telling your fortune. Finding a more useful way to describe you.**

[English](README.md) · [简体中文](README.zh-CN.md)

Mingecode is a **BaZi-inspired cultural personality-interpretation experiment**. It uses a traditional Chinese birth-chart structure to choose which questions to ask, then uses answers about real-life behavior to shape the result. The aim is a short, approachable, shareable experience—not a prediction, diagnosis, or scientific personality assessment.

> **Current status: research candidate + non-production H5 demo implementation.** The repository contains a responsive Next.js/TypeScript prototype, deterministic rules, documentation, fixtures, and tests. Its personality interpretations and underlying research hypotheses have **not** been established through human validation. Public source access is not a production launch.

## The experience

~~~text
Birth date, time, and city
  → Extract five stable cue families from a BaZi chart
  → Use those cues to order four question routes
  → Answer four real-life behavior questions by default
  → Ask up to two more only when the answers remain ambiguous
  → Get a result: aligned / adapted / mixed / unresolved
  → Read the full interpretation or make a privacy-safe share card
~~~

The most important distinction: **the birth chart sets up the questions; it does not decide the person's behavior**. Real-life answers determine the interpretation route. The experience is allowed to say that what a person does today differs from the theme suggested by the chart.

The five internal cue families are `input`, `output`, `peer`, `authority`, and `completion`. They affect question order, not scores. The result may remain unresolved rather than manufacture certainty.

## What is in the repository

| Part | What you can inspect |
| --- | --- |
| **Responsive H5 demo** | Mobile-first Next.js App Router, React, TypeScript, and a static-export configuration |
| **Deterministic interpretation** | Chart/cue extraction, question selection, behavior-based calibration, and four possible result states; no LLM is used to decide an outcome |
| **Privacy-aware sharing** | A result card and share flow that do not carry birth details or individual answers |
| **Research records** | Earlier candidate models, rule/evidence contracts, fixtures, and explicit decision changes |
| **Tests** | Vitest unit tests, Playwright end-to-end tests, and lint/type/build scripts |

This is an implemented demo codebase, **not** evidence that personality validity, user satisfaction, real-world reliability, or a live production service has been demonstrated.

## Run the H5 demo

You will need Node.js and npm.

~~~bash
git clone https://github.com/ian-721/Mingecode.git
cd Mingecode
npm ci
npm run dev
~~~

Then open [http://localhost:3000](http://localhost:3000). The home page links to the interactive flow at [http://localhost:3000/test](http://localhost:3000/test).

To run the repository's configured lint, TypeScript, unit-test, and production-build checks:

~~~bash
npm run check
~~~

The end-to-end suite has a separate command:

~~~bash
npm run test:e2e
~~~

Playwright browser installation may be needed for local E2E execution. The build is configured for static export. A local build is not a production deployment or a human study.

## Product and evidence boundaries

- **Cultural interpretation, not fortune-telling:** no claims about destiny, luck, curing misfortune, or future events.
- **Not psychological or medical advice:** do not use the result as a diagnosis or as a basis for consequential life decisions.
- **No invented precision:** the UI does not present precise personality scores, accuracy percentages, numerical radar charts, hidden rule IDs, or traditional chart data as proof of truth.
- **No LLM arbitration:** the runtime uses deterministic rules, not model-generated judgments of personality.
- **No account or backend data collection:** the demo requires no registration, API, database, payment, or social graph. Birth date, time, and place are processed in the current page's memory and are not stored or placed in a URL.
- **Explicit time convention:** the baseline uses `civil_time_v1`, without defaulting to true solar time. Ambiguous calendar/time inputs have defined handling boundaries.
- **Demo wording:** current user-facing text is `demo-copy-v0.1`, not final production copy.

The prototype has no validated scientific accuracy claim. The share experience is designed to avoid exporting sensitive birth or answer data.

## Naming and research context

**Mingecode / 命格译码** is the accepted internal project and repository name. The public-facing name **八字没一撇** is a **proposal, not a finalized brand**. The content-series title **古人误会你了** is accepted; **东方人格翻译器** remains a candidate description. These labels should not be confused with validation of the product itself.

The decision history matters: an earlier chart-led signature model was replaced by a lighter approach in which chart cues only order questions and behavior answers determine the result. Historical research documents remain accessible as research history, not necessarily as the current runtime contract.

For details:

- [Product vision](docs/PRODUCT_VISION.md) · [Project charter](docs/PROJECT_CHARTER.md)
- [Decision record index](docs/DECISIONS/README.md) · [Current chart/question contract (ADR-0012)](docs/DECISIONS/ADR-0012-chart-prompt-and-light-calibration.md)
- [H5 demo implementation baseline](research/m1br/v0.3/README.md) · [Research archive](research/README.md)
- [Design exploration](design/README.md) · [Contributor record](CONTRIBUTORS.md)
- [Maintainer/agent working rules](AGENTS.md)

## Maintainer and source availability

Created and maintained by **[Yanyang (Ian) Zhao](https://github.com/ian-721)** as an independent product and research prototype.

The source is publicly viewable, but this repository does not currently include a repository-wide open-source license. A public repository is not equivalent to permission to reuse all code or assets.

**Disclaimer:** Mingecode is for cultural exploration and entertainment. It is not a psychological assessment, medical advice, life-decision guidance, or a prediction of fate.
