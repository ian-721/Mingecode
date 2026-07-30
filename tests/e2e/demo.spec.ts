import { expect, test, type Locator, type Page } from "@playwright/test";

test("share return opens a generic invitation without personal payload", async ({
  page,
}) => {
  await page.goto("/?from=share");
  await expect(
    page.getByText("有人从结果卡给你留了个入口"),
  ).toBeVisible();
  expect(page.url()).toMatch(/\/\?from=share$/);
});

test("standard birth input completes four questions and creates a safe share card", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await startStandardFlow(page);

  await chooseMainAnswer(page);
  await chooseMainAnswer(page);
  await chooseMainAnswer(page);
  await chooseMainAnswer(page);

  await expect(page.getByText("你的本次结果")).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText("第 5 / 5 题")).toHaveCount(0);

  await page.getByRole("button", { name: /生成分享卡/ }).click();
  const card = page.getByTestId("share-card");
  await expect(card).toBeVisible();
  const cardText = await card.innerText();
  expect(cardText).not.toContain("2024-02-10");
  expect(cardText).not.toContain("北京");
  expect(cardText).not.toContain("甲辰");
  expect(cardText).not.toContain("SIG-");

  await page
    .getByRole("button", { name: /复制“测测你的”链接/ })
    .click();
  await expect(page.getByText(/通用链接已复制/)).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toMatch(/\/\?from=share$/);
  expect(copied).not.toContain("2024");
  expect(copied).not.toContain("result");
});

test("conflicting answers use the six-question cap and stay unresolved", async ({
  page,
}) => {
  await startStandardFlow(page);
  await chooseUncertain(page);
  await chooseUncertain(page);
  await chooseUncertain(page);
  await expect(page.getByText("第 4 / 4 题")).toBeVisible();
  await chooseUncertain(page);
  await expect(page.getByText("第 5 / 5 题")).toBeVisible();
  await chooseUncertain(page);
  await expect(page.getByText("第 6 / 6 题")).toBeVisible();
  await chooseUncertain(page);

  await expect(page.getByRole("heading", { name: "这次先不定稿" })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText("第 7")).toHaveCount(0);
});

test("going back changes the route and restarting clears the old result", async ({
  page,
}) => {
  await startStandardFlow(page);
  await chooseMainAnswer(page);
  await chooseMainAnswer(page);
  await expect(page.getByText("第 3 / 4 题")).toBeVisible();

  await page.getByRole("button", { name: "返回上一题" }).click();
  await expect(page.getByText("第 2 / 4 题")).toBeVisible();
  await answerAndWait(
    page,
    page.locator(".answer-option").nth(1),
  );
  await finishWithMainAnswers(page);

  await expect(page.getByText("你的本次结果")).toBeVisible({
    timeout: 15_000,
  });
  await page.getByRole("button", { name: "再测一次" }).click();
  await expect(page.getByLabel("出生日期")).toBeVisible();
  await expect(page.getByText("你的本次结果")).toHaveCount(0);
  await expect(page.locator(".question-stage")).toHaveCount(0);
});

test("nonexistent DST time returns a minimal actionable error", async ({
  page,
}) => {
  await page.goto("/test");
  await page.getByLabel("出生日期").fill("2024-03-10");
  await page.getByLabel("出生时间").fill("02:30");
  await chooseCity(page, "纽约", "纽约");
  await page.getByRole("button", { name: /安排起题/ }).click();

  await expect(
    page.getByText("这个当地时间刚好被夏令时跳过去了。请把时间前后调整一小时再试。"),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("button", { name: "返回输入" })).toBeVisible();
});

async function startStandardFlow(page: Page) {
  await page.goto("/test");
  await page.getByLabel("出生日期").fill("2024-02-10");
  await page.getByLabel("出生时间").fill("14:20");
  await chooseCity(page, "北京", "北京");
  await page.getByRole("button", { name: /安排起题/ }).click();

  await page.waitForSelector(
    ".question-stage, .notice-stage, .result-page",
    { timeout: 15_000 },
  );
  const noticeContinue = page.getByRole("button", { name: "明白，继续" });
  if (await noticeContinue.isVisible().catch(() => false)) {
    await noticeContinue.click();
  }
  await expect(page.locator(".question-stage")).toBeVisible();
}

async function chooseCity(page: Page, query: string, optionName: string) {
  await page.getByLabel("出生城市").fill(query);
  await page
    .getByRole("option")
    .filter({ hasText: optionName })
    .first()
    .click();
}

async function chooseMainAnswer(page: Page) {
  return answerAndWait(page, page.locator(".answer-option").first());
}

async function chooseUncertain(page: Page) {
  return answerAndWait(
    page,
    page.getByRole("button", { name: /都不太像/ }),
  );
}

async function answerAndWait(
  page: Page,
  answer: Locator,
): Promise<"question" | "result"> {
  const currentQuestionNumber = await page
    .getByRole("progressbar")
    .getAttribute("aria-valuenow");
  if (currentQuestionNumber === null) {
    throw new Error("Expected an active question before answering");
  }

  const nextQuestionNumber = Number(currentQuestionNumber) + 1;
  await answer.click();
  await page
    .locator(
      `.result-page, .question-stage [role="progressbar"][aria-valuenow="${nextQuestionNumber}"]`,
    )
    .waitFor({ state: "visible" });

  return (await page.locator(".result-page").isVisible())
    ? "result"
    : "question";
}

async function finishWithMainAnswers(page: Page) {
  for (let index = 0; index < 5; index += 1) {
    if ((await chooseMainAnswer(page)) === "result") {
      return;
    }
  }
}
