import { expect, test } from "playwright-test-coverage";
import { registerAndLogout } from "../utils/utils";

test("should register new user, lougout, and login as that user successfully", async ({
	page,
}) => {
	const { email, password } = await registerAndLogout(page);

	await page.getByRole("link", { name: "Login" }).click();
	await page.getByRole("textbox", { name: "Email address" }).fill(email);
	await page.getByRole("textbox", { name: "Password" }).fill(password);
	await page.getByRole("button", { name: "Login" }).click();

	await expect(page.getByRole("link", { name: "Logout" })).toBeVisible();
	await expect(
		page.getByRole("link", { name: "t", exact: true })
	).toBeVisible();
});
