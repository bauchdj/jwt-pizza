import { expect, test } from "playwright-test-coverage";
import { registerUser } from "../utils/utils";

test("should register a new user successfully", async ({ page }) => {
	await registerUser(page);

	await expect(page.locator("#navbar-dark")).toContainText("Logout");
	await expect(
		page.getByRole("link", { name: "t", exact: true })
	).toBeVisible();
});
