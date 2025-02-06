import { expect, test } from "playwright-test-coverage";

test("shoudl load the home page", async ({ page }) => {
	await page.goto("/");
});
