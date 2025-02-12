import { expect, test } from "playwright-test-coverage";
import { registerAndLogoutAndLogin } from "../utils/utils";

test("should register new user, lougout, and login as that user successfully", async ({
	page,
}) => {
	await registerAndLogoutAndLogin(page);
});
