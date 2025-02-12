import { expect, test } from "playwright-test-coverage";

test("about page", async ({ page }) => {
	await page.goto("http://localhost:5173/");
	await page.getByRole("link", { name: "About" }).click();
	await expect(page.getByRole("main")).toContainText("The secret sauce");
	await expect(page.getByRole("contentinfo")).toContainText("About");
});
