import { expect, test, type Page } from "@playwright/test";

type PreviewWitness = {
  readonly id: string;
  readonly date: string;
  readonly time: string | null;
  readonly precision?: "exact" | "unknown";
  readonly stateLabel: string;
  readonly title: string;
};

const WITNESSES: readonly PreviewWitness[] = [
  {
    id: "A01-established",
    date: "1964-02-15",
    time: "22:30",
    stateLabel: "核心结构已成立",
    title: "自带坐标系的人",
  },
  {
    id: "A02-established",
    date: "1964-02-09",
    time: "16:30",
    stateLabel: "核心结构已成立",
    title: "会发光，也会过热的人",
  },
  {
    id: "A03-established",
    date: "1964-02-21",
    time: "16:30",
    stateLabel: "核心结构已成立",
    title: "内置质检部的人",
  },
  {
    id: "A04-established",
    date: "1964-02-14",
    time: "16:30",
    stateLabel: "核心结构已成立",
    title: "灵感也要过验收的人",
  },
  {
    id: "unique-candidate",
    date: "1964-02-07",
    time: "04:30",
    stateLabel: "最接近的结构候选",
    title: "方向已经出现，但还没有定型",
  },
  {
    id: "multi-candidate",
    date: "1964-02-05",
    time: "08:30",
    stateLabel: "并列结构候选",
    title: "几个方向都在，但不该替它们排队",
  },
  {
    id: "conflicted",
    date: "1964-02-05",
    time: "12:30",
    stateLabel: "结构冲突",
    title: "证据很活跃，但正在互相拉扯",
  },
  {
    id: "not-supported",
    date: "1964-02-05",
    time: "00:30",
    stateLabel: "暂不支持可靠归类",
    title: "这四种结构，这次都不该硬套",
  },
  {
    id: "boundary-sensitive",
    date: "1964-02-15",
    time: null,
    precision: "unknown",
    stateLabel: "时间边界敏感",
    title: "合理的时间候选，改变了核心方向",
  },
] as const;

test("all established and formal non-established results render as products", async ({
  page,
}, testInfo) => {
  test.setTimeout(150_000);

  for (const witness of WITNESSES) {
    await submitWitness(page, witness);
    await expect(page.getByText(witness.stateLabel, { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: witness.title })).toBeVisible();
    await expect(page.getByText("运行异常", { exact: true })).toHaveCount(0);
    await expect(page).toHaveURL(/\/content-preview$/);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);

    const screenshotPath = testInfo.outputPath(
      `${witness.id}-${testInfo.project.name}.png`,
    );
    await page.screenshot({
      path: screenshotPath,
      animations: "disabled",
      scale: "css",
      style: "nextjs-portal { display: none !important; }",
    });
    await testInfo.attach(`${witness.id}-${testInfo.project.name}`, {
      path: screenshotPath,
      contentType: "image/png",
    });
  }
});

test("established result is immediate and questions only add manifestation", async ({
  page,
}) => {
  await submitWitness(page, WITNESSES[0]);

  const title = page.getByRole("heading", { name: WITNESSES[0].title });
  const core = page.getByText(
    "别人拿到问题会找答案，你常常先检查：这真的是问题吗？在没有现成地图时，这套内部供能能支持你先建立坐标。",
  );
  await expect(title).toBeVisible();
  await expect(core).toBeVisible();
  await expect(page.getByText("0/2 条现实补充", { exact: true })).toBeVisible();

  await page
    .getByRole("button", { name: "再问我一两句，把现实走法补上" })
    .click();
  await expect(page.getByText("核心结果保持不变", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "先重构问题" }).click();
  await page.getByRole("button", { name: "失去自由" }).click();

  await expect(title).toBeVisible();
  await expect(core).toBeVisible();
  await expect(page.getByText("2/2 条现实补充", { exact: true })).toBeVisible();
  await expect(page.getByText("你会先重写问题", { exact: true })).toBeVisible();
  await expect(page.getByText("亲近不能没收方向盘", { exact: true })).toBeVisible();
});

test("privacy boundary and safe share card exclude birth and internal data", async ({
  page,
}) => {
  const consoleMessages: string[] = [];
  page.on("console", (message) => consoleMessages.push(message.text()));
  await submitWitness(page, WITNESSES[1]);

  await page.getByRole("button", { name: "生成分享卡" }).click();
  const shareCard = page.getByTestId("preview-share-card");
  await expect(shareCard).toBeVisible();
  const text = await shareCard.innerText();
  for (const forbidden of [
    "1964-02-09",
    "16:30",
    "北京",
    "甲辰",
    "A02",
    "D1",
    "E1",
    "S02",
  ]) {
    expect(text).not.toContain(forbidden);
    expect(consoleMessages.join("\n")).not.toContain(forbidden);
  }

  expect(new URL(page.url()).search).toBe("");
  const storage = await page.evaluate(() =>
    JSON.stringify({
      local: { ...localStorage },
      session: { ...sessionStorage },
    }),
  );
  for (const forbidden of ["1964-02-09", "16:30", "北京", "beijing"]) {
    expect(storage).not.toContain(forbidden);
  }

  await page.reload();
  await expect(page.getByLabel("出生日期")).toHaveValue("");
  await expect(page.getByLabel("出生城市")).toHaveValue("");
});

test("a true runtime failure stays distinct from honest product states", async ({
  page,
}) => {
  await page.goto("/content-preview");
  await page.getByLabel("出生日期").fill("2024-03-10");
  await page.getByLabel("出生时间").fill("02:30");
  await chooseCity(page, "纽约", "纽约");
  await page.getByRole("button", { name: /直接看命盘核心结果/ }).click();

  await expect(page.getByText("运行异常", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "这个当地时间刚好被夏令时跳过去了。请把时间前后调整一小时再试。",
    ),
  ).toBeVisible();
  await expect(page.getByText("这是正式结果，不是错误页")).toHaveCount(0);
});

async function submitWitness(page: Page, witness: PreviewWitness) {
  await page.goto("/content-preview");
  await page.getByLabel("出生日期").fill(witness.date);

  if (witness.precision === "unknown") {
    await page.getByText("不清楚", { exact: true }).click();
  } else {
    await page.getByLabel("出生时间").fill(witness.time ?? "");
  }

  await chooseCity(page, "北京", "北京");
  await page.getByRole("button", { name: /直接看命盘核心结果/ }).click();

  const continueButton = page.getByRole("button", {
    name: "保留边界，继续译码",
  });
  await page.getByRole("heading", { level: 1, name: witness.title })
    .or(continueButton)
    .first()
    .waitFor({ state: "visible", timeout: 15_000 });
  if (await continueButton.isVisible().catch(() => false)) {
    await continueButton.click();
  }

  await expect(
    page.getByRole("heading", { level: 1, name: witness.title }),
  ).toBeVisible({ timeout: 15_000 });
}

async function chooseCity(page: Page, query: string, optionName: string) {
  await page.getByLabel("出生城市").fill(query);
  await page
    .getByRole("option")
    .filter({ hasText: optionName })
    .first()
    .click();
}
