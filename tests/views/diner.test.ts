import { expect, test } from "playwright-test-coverage";
import { registerAndLogoutAndLogin } from "../utils/utils";

test("diner dashboard page", async ({ page }) => {
	const mockGetOrderResponseFirst = { dinerId: 4, orders: [], page: 1 };
	const mockGetOrderResponseSecond = {
		dinerId: 6,
		orders: [
			{
				id: 1,
				franchiseId: 1,
				storeId: 1,
				date: "2025-02-12T05:04:32.000Z",
				items: [
					{
						id: 1,
						menuId: 2,
						description: "Pepperoni",
						price: 0.0042,
					},
					{
						id: 2,
						menuId: 1,
						description: "Veggie",
						price: 0.0038,
					},
				],
			},
			{
				id: 2,
				franchiseId: 1,
				storeId: 1,
				date: "2025-02-12T05:13:05.000Z",
				items: [
					{
						id: 3,
						menuId: 2,
						description: "Pepperoni",
						price: 0.0042,
					},
					{
						id: 4,
						menuId: 3,
						description: "Margarita",
						price: 0.0042,
					},
				],
			},
		],
		page: 1,
	};
	//http://localhost:3000/api/order

	{
		let routeCount = 0;

		await page.route("*/**/api/order", async (route) => {
			const method = route.request().method();
			expect(method).toBe("GET");

			const response =
				routeCount === 0
					? mockGetOrderResponseFirst
					: mockGetOrderResponseSecond;

			await route.fulfill({ json: response });

			routeCount++;
		});
	}

	await registerAndLogoutAndLogin(page);

	await page.getByRole("link", { name: "t", exact: true }).click();
	await expect(page.getByRole("list")).toContainText("diner-dashboard");
	await expect(page.getByRole("heading")).toContainText("Your pizza kitchen");
	await expect(page.getByRole("main")).toContainText("name:");
	await expect(page.getByRole("main")).toContainText("email:");
	await expect(page.getByRole("main")).toContainText("role:");
	await expect(page.getByRole("main")).toContainText(
		"How have you lived this long without having a pizza? Buy one now!"
	);
	await expect(
		page.getByRole("img", { name: "Employee stock photo" })
	).toBeVisible();

	await page.goto("http://localhost:5173/");
	await page.getByRole("link", { name: "t", exact: true }).click();
	await expect(page.getByRole("main")).toContainText("test");
	await expect(page.getByRole("main")).toContainText("test@email.com");
	await expect(page.getByRole("main")).toContainText("diner");
	await expect(page.locator("thead")).toContainText("ID");
	await expect(page.locator("thead")).toContainText("Price");
	await expect(page.locator("thead")).toContainText("Date");

	await page
		.locator("div")
		.filter({ hasText: "Your pizza kitchenname:" })
		.nth(2)
		.click();
	await expect(page.locator("tbody")).toContainText(
		"2025-02-12T05:04:32.000Z"
	);
	await expect(page.locator("tbody")).toContainText(
		"2025-02-12T05:13:05.000Z"
	);
	await expect(page.locator("tbody")).toContainText("0.008 ₿");
	await expect(page.locator("tbody")).toContainText("0.008 ₿");
	await expect(page.locator("tbody")).toContainText("1");
	await expect(page.locator("tbody")).toContainText("2");
	await expect(
		page
			.locator("div")
			.filter({ hasText: "Your pizza kitchenname:" })
			.nth(2)
	).toBeVisible();
});
