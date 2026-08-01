import type {
  ManifestationBlock,
  PreviewContentDefinition,
} from "@/lib/content-rebuild/preview-types";
import type { MechanismId } from "@/lib/content-rebuild/types";

export const CONTENT_REBUILD_PREVIEW_VERSION =
  "content-rebuild-preview-v0.1" as const;

const A01_BLOCKS: readonly ManifestationBlock[] = [
  {
    id: "A01.reality.reframe",
    section: "reality",
    eyebrow: "你确认的现实走法",
    title: "你会先重写问题",
    body: "要求本身不成立时，你很难只靠服从把它做完。你通常先争取重新定义，再决定怎样交付。",
  },
  {
    id: "A01.reality.deliver",
    section: "reality",
    eyebrow: "你确认的现实走法",
    title: "你会先交一版，再保留判断",
    body: "你并非每次都推翻框架。现实压力足够明确时，你会先交付，再把真正的问题留到下一轮修正。",
  },
  {
    id: "A01.relationship.autonomy",
    section: "relationship",
    eyebrow: "关系里的你",
    title: "亲近不能没收方向盘",
    body: "你可以投入得很深，但仍需要保留自己的判断权。对你而言，关系成立不等于主体合并。",
  },
  {
    id: "A01.relationship.understanding",
    section: "relationship",
    eyebrow: "关系里的你",
    title: "你更怕一直没人真正听懂",
    body: "你要的不只是自由，也希望有人能进入你的逻辑。长期只有表面陪伴，会让你比明确分歧更孤独。",
  },
];

const A02_BLOCKS: readonly ManifestationBlock[] = [
  {
    id: "A02.highlight.feedback",
    section: "highlight",
    eyebrow: "你确认的现实走法",
    title: "回应会继续给你供电",
    body: "得到真实回应后，你通常会更快进入状态。连接感能把表达变成持续的创造力。",
  },
  {
    id: "A02.crash.rumination",
    section: "crash",
    eyebrow: "你确认的现实走法",
    title: "认可之后，考核才刚开始",
    body: "一次做得好，可能立刻变成下一次必须维持的标准。外界还在鼓掌，你已经开始担心掉下来。",
  },
  {
    id: "A02.reality.direct",
    section: "reality",
    eyebrow: "冲突里的你",
    title: "你更常当场把温度说出来",
    body: "气氛改变时，你很难完全装作没事。及时表达能保护连接，也可能让现场瞬间升温。",
  },
  {
    id: "A02.crash.delayed",
    section: "crash",
    eyebrow: "冲突里的你",
    title: "你会先把场面托住，之后突然没电",
    body: "你能短时间维持气氛，但消耗不会消失。真正的疲惫常在所有人都走后才出现。",
  },
];

const A03_BLOCKS: readonly ManifestationBlock[] = [
  {
    id: "A03.crash.review",
    section: "crash",
    eyebrow: "你确认的现实走法",
    title: "标准不清时，内部审查会先接管",
    body: "你不是没有行动意愿，而是不愿在验收口径不存在时盲目下注。问题越模糊，启动成本越高。",
  },
  {
    id: "A03.highlight.iterate",
    section: "highlight",
    eyebrow: "你确认的现实走法",
    title: "你能先放出粗稿，再用方法逼近可靠",
    body: "当你允许版本逐步成立时，质检能力会变成迭代引擎，而不是第一版的拦截器。",
  },
  {
    id: "A03.reality.method",
    section: "reality",
    eyebrow: "失败之后",
    title: "你会先修改方法",
    body: "你倾向把失败拆成可复现的问题：哪里断了、标准哪里错了、下一次怎样验证。",
  },
  {
    id: "A03.crash.self",
    section: "crash",
    eyebrow: "失败之后",
    title: "一次失败容易被扩大成能力审判",
    body: "当内部标准过于严厉，当前方案的问题可能被误读为你整个人不适合。",
  },
];

const A04_BLOCKS: readonly ManifestationBlock[] = [
  {
    id: "A04.reality.value",
    section: "reality",
    eyebrow: "你确认的现实走法",
    title: "你更怕喜欢的东西在现实里活不下去",
    body: "价值、使用和投入会很早进入判断。你希望灵感不只动人，也能真正被接住。",
  },
  {
    id: "A04.relationship.feeling",
    section: "relationship",
    eyebrow: "你确认的现实走法",
    title: "你会先保护它原本的感觉",
    body: "当现实要求开始改变作品或关系的灵魂，你宁可慢一点，也不愿只剩下一个能卖、却不再属于你的版本。",
  },
  {
    id: "A04.highlight.accept",
    section: "highlight",
    eyebrow: "面对反馈",
    title: "你能先接住认可，再决定是否继续改",
    body: "你并非永远追求终审。安全感足够时，你可以允许一个版本先成立。",
  },
  {
    id: "A04.crash.final",
    section: "crash",
    eyebrow: "面对反馈",
    title: "一句“挺好”会自动触发下一轮终审",
    body: "你会追问具体哪里好、哪里还能更好。精细度因此提高，试用期也因此不断缩短。",
  },
];

export const CONTENT_REBUILD_PREVIEW: Readonly<
  Record<MechanismId, PreviewContentDefinition>
> = {
  A01: {
    mechanism: "A01",
    title: "自带坐标系的人",
    chartEntry:
      "你的结构里，方向更多从内部长出来；外部标准更像修路标，不太像发动机。",
    recognition:
      "你最强的能力不是坚持某条路，而是发现路本身可能画错了。",
    corePersonality:
      "别人拿到问题会找答案，你常常先检查：这真的是问题吗？在没有现成地图时，这套内部供能能支持你先建立坐标。",
    structuralTension:
      "同一股持续生长的力量，也让收束接口相对吃力。新可能一出现，旧版本就容易被要求重新投胎。",
    staticHighlight:
      "没有现成路径、信息彼此冲突时，你能先建立一套可继续判断的坐标。",
    staticCrash:
      "方向会继续生长，版本不容易停下；执行现场偶尔会被改造成制宪会议。",
    modernMisread:
      "旧语境容易把这种主体性写成固执或争夺。现代翻译更接近：你需要确认自己仍是人生的署名人。",
    recognitionLine:
      "我不是总想换方向，我只是经常发现地图是别人随手画的。",
    counterexample:
      "若你长期依赖明确权威替你定标，面对开放问题会明显失去方向，也很少主动重构框架，则这条判断不成立。",
    questions: [
      {
        id: "A01.task.response",
        prompt: "面对逻辑不通但必须完成的任务，你更常怎么做？",
        options: [
          {
            id: "reframe_first",
            label: "先重构问题",
            blockIds: ["A01.reality.reframe"],
          },
          {
            id: "deliver_first",
            label: "先按要求交付",
            blockIds: ["A01.reality.deliver"],
          },
          { id: "depends", label: "看具体代价", blockIds: [] },
        ],
      },
      {
        id: "A01.relationship.need",
        prompt: "关系很近时，你更担心什么？",
        options: [
          {
            id: "autonomy",
            label: "失去自由",
            blockIds: ["A01.relationship.autonomy"],
          },
          {
            id: "understanding",
            label: "始终不被理解",
            blockIds: ["A01.relationship.understanding"],
          },
          { id: "both", label: "两者都在", blockIds: [] },
        ],
      },
    ],
    blocks: A01_BLOCKS,
  },
  A02: {
    mechanism: "A02",
    title: "会发光，也会过热的人",
    chartEntry:
      "你的结构里，输出很容易进入现场；外在亮度与内部承载并不总是同步。",
    recognition:
      "你不只是爱表达。你能迅速点亮一个空间，空间的反馈也会迅速进入你的后台。",
    corePersonality:
      "表达一旦有了对象，你会很快让空气流动起来。冷场、停滞和没有入口的时刻，往往能被你率先打破。",
    structuralTension:
      "亮度很容易被误认成电量。现场仍然觉得你状态正好时，内部余量可能已经开始下降。",
    staticHighlight:
      "输出能迅速形成可见影响，让停滞的现场重新有节奏。",
    staticCrash:
      "外在亮度可能先于内部承载；继续加大输出，并不总能解决掉电。",
    modernMisread:
      "旧说法容易把可见表达写成爱出风头。现代翻译是：你通过回应确认连接，也需要学会不靠现场供电。",
    recognitionLine: "我看起来像在发光，后台风扇其实已经转疯了。",
    counterexample:
      "若你长期对气氛和评价都不敏感，表达之后很少反刍，持续高强度输出也不会明显消耗，则这条判断不成立。",
    questions: [
      {
        id: "A02.feedback.after",
        prompt: "被认可后，你更常出现哪种反应？",
        options: [
          {
            id: "continue",
            label: "继续兴奋输出",
            blockIds: ["A02.highlight.feedback"],
          },
          {
            id: "worry",
            label: "担心下次做不到",
            blockIds: ["A02.crash.rumination"],
          },
          { id: "both", label: "两种都会", blockIds: [] },
        ],
      },
      {
        id: "A02.conflict.style",
        prompt: "冲突出现时，你更常怎么处理？",
        options: [
          {
            id: "direct",
            label: "当场说出来",
            blockIds: ["A02.reality.direct"],
          },
          {
            id: "delay",
            label: "先维持气氛",
            blockIds: ["A02.crash.delayed"],
          },
          { id: "depends", label: "看关系安全度", blockIds: [] },
        ],
      },
    ],
    blocks: A02_BLOCKS,
  },
  A03: {
    mechanism: "A03",
    title: "内置质检部的人",
    chartEntry:
      "你的结构显示，压力不只直接落在主体上，也能经过输出路径被处理。",
    recognition:
      "模糊要求落到你手里，通常会被拆成步骤、定义和检查点。",
    corePersonality:
      "你对“差不多”的警觉，常来自一种可靠性要求：至少要知道它凭什么成立、哪里可能坏。",
    structuralTension:
      "处理压力的反馈回路，也可能反过来占据行动。方法原本用于降低风险，最后却可能先拦住第一版。",
    staticHighlight:
      "压力可以经过输出路径被处理，而不只直接压在主体上。",
    staticCrash:
      "反馈回路持续存在时，处理机制也可能反过来接管行动。",
    modernMisread:
      "旧语境常把规则压力解释成服从与受制。现代翻译更接近：你会把外部压力消化成自己的方法。",
    recognitionLine:
      "我不是没想法，我只是每个想法都先被内部评审委员会驳回三轮。",
    counterexample:
      "若你长期不在意细节和可验证性，面对模糊要求也能轻松行动，并且失败后极少复盘，则这条判断不成立。",
    questions: [
      {
        id: "A03.draft.threshold",
        prompt: "重要任务标准不清时，你更常怎么开始？",
        options: [
          {
            id: "stuck",
            label: "先卡住，等标准清楚",
            blockIds: ["A03.crash.review"],
          },
          {
            id: "rough",
            label: "先做一个粗糙版本",
            blockIds: ["A03.highlight.iterate"],
          },
          { id: "depends", label: "看返工成本", blockIds: [] },
        ],
      },
      {
        id: "A03.failure.attribution",
        prompt: "一次失败后，你更常先做什么？",
        options: [
          {
            id: "method",
            label: "修改方法",
            blockIds: ["A03.reality.method"],
          },
          {
            id: "self",
            label: "怀疑自己不适合",
            blockIds: ["A03.crash.self"],
          },
          { id: "both", label: "先怀疑，再复盘", blockIds: [] },
        ],
      },
    ],
    blocks: A03_BLOCKS,
  },
  A04: {
    mechanism: "A04",
    title: "灵感也要过验收的人",
    chartEntry:
      "你的结构让输入、表达和现实接口形成连续转换；生成与验收会很早坐到同一张桌上。",
    recognition:
      "你很少满足于只有灵感，也很少满足于只有实用。你想让东西既有感觉，又能成立。",
    corePersonality:
      "你有一种编辑能力：能从大量可能里挑出真正有质感、也有现实生命力的部分。",
    structuralTension:
      "现实接口来得很早。一个想法刚学会站立，就会被问完成度、价值和别人是否愿意接住。",
    staticHighlight:
      "输入、表达和现实接口能够形成连续转换，让概念逐渐拥有现实生命。",
    staticCrash:
      "转换链很早接入现实标准，生成与验收容易同时发生。",
    modernMisread:
      "旧说法容易把现实价值接口写成逐利，把高标准写成挑剔。现代翻译是：你想让喜欢的东西在现实里活下去。",
    recognitionLine: "我的灵感不是没有童年，只是刚出生就被问能不能落地。",
    counterexample:
      "若你长期对完成度、审美和实际价值都不敏感，也很少用外部反馈校准作品或关系，则这条判断不成立。",
    questions: [
      {
        id: "A04.value.feeling",
        prompt: "做喜欢的事时，你更怕什么？",
        options: [
          {
            id: "value",
            label: "它没有现实价值",
            blockIds: ["A04.reality.value"],
          },
          {
            id: "feeling",
            label: "它失去原本感觉",
            blockIds: ["A04.relationship.feeling"],
          },
          { id: "both", label: "两者都不能丢", blockIds: [] },
        ],
      },
      {
        id: "A04.feedback.detail",
        prompt: "别人说“挺好的”时，你更常怎么反应？",
        options: [
          {
            id: "accept",
            label: "先接受这份认可",
            blockIds: ["A04.highlight.accept"],
          },
          {
            id: "detail",
            label: "立刻追问哪里要改",
            blockIds: ["A04.crash.final"],
          },
          { id: "depends", label: "看对方是否懂行", blockIds: [] },
        ],
      },
    ],
    blocks: A04_BLOCKS,
  },
};
