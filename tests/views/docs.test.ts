import { expect, test } from "playwright-test-coverage";

test("docs page", async ({ page }) => {
	await page.goto("http://localhost:5173/docs");
	await expect(page.getByRole("list")).toContainText("docs");
	// await expect(page.getByRole("heading")).toContainText("JWT Pizza API");
	await expect(page.getByRole("main")).toContainText(
		"service: http://localhost:3000"
	);
	await expect(page.getByRole("main")).toContainText(
		"factory: https://pizza-factory.cs329.click"
	);
});
