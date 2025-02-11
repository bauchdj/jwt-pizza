import { type Page } from "@playwright/test";
import { expect, test } from "playwright-test-coverage";
import { Role, type User } from "../../src/service/pizzaService";

interface MockUserResponseData {
	mock: boolean;
	user: User;
	token: string;
}

async function registerAndLogout(page: Page) {
	const registerUserData = await registerUser(page);

	await expect(page.locator("#navbar-dark")).toContainText("Logout");
	await page.getByRole("link", { name: "Logout" }).click();
	await expect(page.locator("#navbar-dark")).toContainText("Register");
	await expect(page.locator("#navbar-dark")).toContainText("Login");

	return registerUserData;
}

async function registerUser(page: Page) {
	await mockApiAuthRoute(page);

	await page.goto("http://localhost:5173/");

	const name = "test";
	const email = "test@email.com";
	const password = "testPWD";

	await page.getByRole("link", { name: "Register" }).click();
	await page.getByRole("textbox", { name: "Full name" }).fill(name);
	await page.getByRole("textbox", { name: "Email address" }).fill(email);
	await page.getByRole("textbox", { name: "Password" }).fill(password);
	await page.getByRole("button", { name: "Register" }).click();

	return {
		page,
		name,
		email,
		password,
	};
}

async function mockApiAuthRoute(page: Page): Promise<void> {
	await page.route("*/**/api/auth", async (route) => {
		const method = route.request().method();
		let response;

		switch (method) {
			case "POST":
				response = mockApiAuthPost();
				break;
			case "PUT":
				response = mockApiAuthPut();
				break;
			case "DELETE":
				response = mockApiAuthDelete();
				break;
			default:
				response = route.continue();
				return;
		}

		await route.fulfill({ json: response });
	});
}

function mockApiAuthPost() {
	const data: MockUserResponseData = createUserResponseData();

	return data;
}

function mockApiAuthPut() {
	const data: MockUserResponseData = createUserResponseData();

	return data;
}

function mockApiAuthDelete() {
	const data = { message: "logout successful" };

	return data;
}

function createUserResponseData() {
	const user = createUserInstance();

	const data: MockUserResponseData = {
		mock: true,
		user,
		token: "test-token",
	};

	return data;
}

function createUserInstance(
	name = "test",
	email = "test@email.com",
	password = "testPWD"
) {
	const user: User = {
		id: 19,
		name,
		email,
		password,
		roles: [
			{
				role: "diner" as Role,
				objectId: 0,
			},
		],
	};

	return user;
}

export { registerAndLogout, registerUser };
