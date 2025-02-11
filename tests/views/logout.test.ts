import { expect, test } from "playwright-test-coverage";
import { registerAndLogout } from "../utils/utils";

test("should register a new user and logout successfully", async ({ page }) => {
	await registerAndLogout(page);
});
