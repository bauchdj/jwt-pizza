import { expect, test } from "playwright-test-coverage";
import {
	mockApiAuthPost,
	mockApiAuthRoute,
	registerUser,
} from "../utils/utils";

test("should register a new user successfully", async ({ page }) => {
	await registerUser(page);

	// await page.getByRole("link", { name: "Register" }).click();
	// await page.getByRole("textbox", { name: "Full name" }).fill("test");
	// await page.getByRole("textbox", { name: "Email address" }).fill("test");
	// await page.getByRole("textbox", { name: "Password" }).fill("test");
	// await page.getByRole("button", { name: "Register" }).click();
	// await page
	// 	.getByRole("textbox", { name: "Email address" })
	// 	.fill("test@email.com");
	// await page.getByRole("button", { name: "Register" }).click();

	await expect(page.locator("#navbar-dark")).toContainText("Logout");
	await expect(
		page.getByRole("link", { name: "t", exact: true })
	).toBeVisible();
});
