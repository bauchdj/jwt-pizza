import { expect, test } from "playwright-test-coverage";
import { registerAndLogoutAndLogin } from "../utils/utils";

test("franchise dashboard page", async ({ page }) => {
	const mockGetFranchiseResponseFirst = [
		{
			id: 1,
			name: "pizzaPocket",
			admins: [
				{
					id: 4,
					name: "pizza franchisee",
					email: "f@jwt.com",
				},
			],
			stores: [
				{
					id: 1,
					name: "SLC",
				},
			],
		},
	];

	const mockGetFranchiseResponseSecond = [
		{
			id: 1,
			name: "pizzaPocket",
			admins: [
				{
					id: 4,
					name: "pizza franchisee",
					email: "f@jwt.com",
				},
			],
			stores: [
				{
					id: 1,
					name: "SLC",
				},
				{
					id: 2,
					name: "testStore",
				},
			],
		},
	];
	// http://localhost:3000/api/franchise/4

	const mockPostStoreResponse = { id: 2, franchiseId: 1, name: "testStore" };
	// http://localhost:3000/api/franchise/1/store

	{
		let routeCount = 0;

		await page.route("*/**/api/franchise/*", async (route) => {
			const method = route.request().method();
			expect(method).toBe("GET");

			const response =
				routeCount === 0
					? mockGetFranchiseResponseFirst
					: mockGetFranchiseResponseSecond;

			await route.fulfill({ json: response });

			routeCount++;
		});
	}

	await page.route("*/**/api/franchise/*/store", async (route) => {
		const method = route.request().method();
		expect(method).toBe("POST");
		await route.fulfill({ json: mockPostStoreResponse });
	});

	await registerAndLogoutAndLogin(page);

	await expect(page.locator("#navbar-dark")).toContainText("Franchise");
	await page
		.getByLabel("Global")
		.getByRole("link", { name: "Franchise" })
		.click();
	await expect(page.getByRole("list")).toContainText("franchise-dashboard");
	await expect(page.getByRole("main")).toContainText(
		"Everything you need to run an JWT Pizza franchise. Your gateway to success."
	);
	await expect(page.getByRole("main")).toContainText("Create store");
	// await page.goto("http://localhost:5173/franchise-dashboard");
	await expect(page.locator("thead")).toContainText("Name");
	await expect(page.locator("thead")).toContainText("Revenue");
	await expect(page.locator("thead")).toContainText("Action");
	await expect(page.locator("tbody")).toContainText("Close");

	await expect(page.getByRole("heading")).toContainText("pizzaPocket");
	await expect(page.locator("tbody")).toContainText("SLC");

	await page.getByRole("button", { name: "Create store" }).click();
	await page.getByRole("textbox", { name: "store name" }).click();
	await page.getByRole("textbox", { name: "store name" }).fill("testStore");
	await page.getByRole("button", { name: "Create" }).click();
	await expect(page.locator("tbody")).toContainText("testStore");
});
