"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { HeroMark } from "@/components/hero-mark";

const subscribe = () => () => undefined;

export function HomeClient() {
  const fromShare = useSyncExternalStore(
    subscribe,
    () =>
      new URLSearchParams(window.location.search).get("from") === "share",
    () => false,
  );

  return (
    <main className="home-shell">
      <header className="site-header">
        <Link className="brand-lockup" href="/">
          <span className="brand-seal" aria-hidden="true">
            命
          </span>
          <span>命格译码</span>
        </Link>
        <span className="demo-badge">非生产 Demo</span>
      </header>

      <section className="hero-grid">
        <div className="hero-copy">
          {fromShare && (
            <p className="share-return" role="status">
              有人从结果卡给你留了个入口
            </p>
          )}
          <p className="eyebrow">古人误会你了</p>
          <h1>
            不是替你算命，
            <br />
            是重新翻译你。
          </h1>
          <p className="hero-lede">
            填一次生辰，再答四到六道很具体的小问题。看看你平时到底怎么把事情往前推。
          </p>
          <div className="hero-actions">
            <Link className="button button-primary button-large" href="/test">
              开始译码
              <span aria-hidden="true">↗</span>
            </Link>
            <span className="microcopy">不用登录 · 出生资料不会保存</span>
          </div>
        </div>
        <HeroMark />
      </section>

      <section className="home-notes" aria-label="Demo 说明">
        <article>
          <span>01</span>
          <h2>生辰只安排起题</h2>
          <p>它只给出几条可能路线，不抢着替现实下结论。</p>
        </article>
        <article>
          <span>02</span>
          <h2>四到六道题来校准</h2>
          <p>都问具体场景，没有“更优秀”的标准答案。</p>
        </article>
        <article>
          <span>03</span>
          <h2>结果可以不一致</h2>
          <p>你后来练出的办法，也算真实的你。</p>
        </article>
      </section>

      <footer className="site-footer">
        <p>文化研究与娱乐表达，不是预测、诊断或人生建议。</p>
        <p>demo-copy-v0.1</p>
      </footer>
    </main>
  );
}
