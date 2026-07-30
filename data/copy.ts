import type { SignatureId, VerdictRelation } from "@/lib/types";

export const RESULT_COPY: Record<
  SignatureId,
  {
    name: string;
    recognition: string;
    crash: string;
    operation: string;
    highlight: string;
    advice: string;
  }
> = {
  "SIG-A1": {
    name: "先搭脚手架的人",
    recognition: "你通常要先知道手里有什么，才肯认真做第一版。",
    crash: "麻烦在于：材料永远还能再补一点，开工日期就会一路往后挪。",
    operation: "先收窄输入，再把零散信息压成一个能继续改的版本。",
    highlight: "别人还在被杂乱信息淹没时，你能先找出真正缺的那几块。",
    advice: "下次只给准备阶段一个明确截止点，到了就交第一版。",
  },
  "SIG-A2": {
    name: "先摆上桌的人",
    recognition: "你更相信看得见的版本：先做出来，很多问题才有资格出现。",
    crash: "有时桌上是热闹了，版本却还没来得及长出骨头。",
    operation: "先把判断变成能被看见、被回应的东西，再用反馈修它。",
    highlight: "讨论打转时，你能迅速给大家一个具体对象。",
    advice: "公开之前先写下一条：这版最不该被误会成什么。",
  },
  "SIG-B1": {
    name: "先把规矩说清的人",
    recognition: "一旦大家各说各话，你会先找决定权和标准到底在哪儿。",
    crash: "规矩没理顺时，你可能连一件小事都不愿意糊里糊涂地推进。",
    operation: "先确认谁能决定、按什么判断，再划出能执行的边界。",
    highlight: "多人合作开始混乱时，你很快能看见是哪两套标准撞车。",
    advice: "先解决会真正改变结果的那条权限，别一次清完所有边界。",
  },
  "SIG-C1": {
    name: "要把句号落下的人",
    recognition: "对你来说，有东西不等于做完；有人接、标准清楚才算。",
    crash: "当终点没人定义，你容易替整件事多背一截。",
    operation: "先把完成对象、接收人和后续责任连起来。",
    highlight: "项目快散架时，你能把“差不多”重新变成可交接的结果。",
    advice: "开始前只问一次：最后谁接走它？没有答案就先别替人兜底。",
  },
};

export const RELATION_COPY: Record<
  VerdictRelation,
  { label: string; description: string }
> = {
  aligned: {
    label: "起题方向和现实路线同向",
    description: "命盘先引出的话题，也正是你在几个现实场景里反复选择的做法。",
  },
  adapted: {
    label: "现实里你更常走另一条路",
    description: "命盘先引出一个话题，但你的现实选择稳定地集中在另一条路线。",
  },
  mixed: {
    label: "你会按场景换挡",
    description: "两条路线分别在不同场景成立，不需要硬挤成一个单一标签。",
  },
  unresolved: {
    label: "这次先不强行定稿",
    description: "现有时间或回答还不足以稳定区分近邻路线，保留未决比硬猜更诚实。",
  },
};

export const COPY_VERSION = "demo-copy-v0.1";
