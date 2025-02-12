import { expect, test } from "playwright-test-coverage";

test("not found page", async ({ page }) => {
	await page.goto("http://localhost:5173/idk");
	await expect(page.getByRole("heading")).toContainText("Oops");
	await expect(page.getByRole("main")).toContainText(
		"It looks like we have dropped a pizza on the floor. Please try another page."
	);
	await expect(page.getByRole("list")).toContainText("idk");
});
