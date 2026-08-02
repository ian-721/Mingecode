import { expect, test } from "@playwright/test";

test("chart-led preview shows a result before any questions", async ({ page }) => {
  await page.goto("/content-preview");

  await expect(
    page.getByRole("heading", { name: "这次，先让命盘说完整。" }),
  ).toBeVisible();

  await page.getByLabel("出生日期").fill("1990-01-01");
  await page.getByLabel("出生时间").fill("12:00");
  await page.getByLabel("出生城市").fill("悉尼");
  await page.getByRole("option").filter({ hasText: "悉尼" }).first().click();
  await page.getByRole("button", { name: /直接看命盘核心结果/ }).click();

  const boundaryHeading = page.getByRole("heading", {
    name: "先把不确定性摆在桌上。",
  });
  if (await boundaryHeading.isVisible().catch(() => false)) {
    await page.getByRole("button", { name: "保留边界，继续译码" }).click();
  }

  await expect(
    page.getByText(/命盘核心已冻结|命盘边界诚实输出/).first(),
  ).toBeVisible();
  await expect(page.getByText("安排起题，去答四到六题")).toHaveCount(0);
  await expect(page.getByText(/0\/2 条现实补充|这次先不替你定型|时间边界改变了核心方向|这条结构有支持/).first()).toBeVisible();
});

test("share surface contains no birth data", async ({ page }) => {
  await page.goto("/content-preview");
  await page.getByLabel("出生日期").fill("1990-01-01");
  await page.getByLabel("出生时间").fill("12:00");
  await page.getByLabel("出生城市").fill("悉尼");
  await page.getByRole("option").filter({ hasText: "悉尼" }).first().click();
  await page.getByRole("button", { name: /直接看命盘核心结果/ }).click();

  const continueButton = page.getByRole("button", {
    name: "保留边界，继续译码",
  });
  if (await continueButton.isVisible().catch(() => false)) {
    await continueButton.click();
  }

  await page.getByRole("button", { name: /生成.*分享卡/ }).click();
  await expect(page.getByText("不是替你算命，而是重新翻译你。")).toBeVisible();
  await expect(page.getByText("1990-01-01")).toHaveCount(0);
  await expect(page.getByText("12:00")).toHaveCount(0);
  await expect(page.getByText("悉尼")).toHaveCount(0);
});
