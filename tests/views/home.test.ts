import { expect, test } from "playwright-test-coverage";

test("home page", async ({ page }) => {
	await page.goto("http://localhost:5173/");
	expect(await page.title()).toBe("JWT Pizza");
	await expect(page.getByRole("heading")).toContainText(
		"The web's best pizza"
	);
	await expect(page.getByRole("button", { name: "Order now" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Order now" })).toBeVisible();
	await expect(page.getByRole("banner")).toBeVisible();
	await expect(page.getByRole("list")).toBeVisible();
});
