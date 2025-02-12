import { expect, test } from "playwright-test-coverage";
import { registerAndLogoutAndLogin } from "../utils/utils";

test("menu page as guest", async ({ page }) => {
	await page.goto("http://localhost:5173/");
	await page.getByRole("button", { name: "Order now" }).click();
	await page.getByRole("link", { name: "Order" }).click();
	// await expect(page.getByRole("heading")).toContainText(
	// 	"Awesome is a click away"
	// );
	await expect(page.locator("form")).toContainText(
		"Pick your store and pizzas from below. Remember to order extra for a midnight party."
	);
	await expect(page.locator("form")).toContainText(
		"What are you waiting for? Pick a store and then add some pizzas!"
	);
	await expect(page.locator("form div").first()).toBeVisible();
	await expect(page.getByRole("button", { name: "Checkout" })).toBeVisible();
});

test("checkout flow as diner user", async ({ page }) => {
	const mockGetOrderMenuResponse = [
		{
			id: 1,
			title: "Veggie",
			image: "pizza1.png",
			price: 0.0038,
			description: "A garden of delight",
		},
		{
			id: 2,
			title: "Pepperoni",
			image: "pizza2.png",
			price: 0.0042,
			description: "Spicy treat",
		},
		{
			id: 3,
			title: "Margarita",
			image: "pizza3.png",
			price: 0.0042,
			description: "Essential classic",
		},
		{
			id: 4,
			title: "Crusty",
			image: "pizza4.png",
			price: 0.0028,
			description: "A dry mouthed favorite",
		},
		{
			id: 5,
			title: "Charred Leopard",
			image: "pizza5.png",
			price: 0.0099,
			description: "For those with a darker side",
		},
	];

	const mockGetFranchiseReponse = [
		{
			id: 1,
			name: "pizzaPocket",
			stores: [
				{
					id: 1,
					name: "Provo",
				},
			],
		},
	];

	const mockPostOrderResponse = {
		order: {
			items: [
				{
					menuId: 2,
					description: "Pepperoni",
					price: 0.0042,
				},
				{
					menuId: 3,
					description: "Margarita",
					price: 0.0042,
				},
			],
			storeId: "1",
			franchiseId: 1,
			id: 2,
		},
		jwt: "eyJpYXQiOjE3MzkzMzcxODYsImV4cCI6MTczOTQyMzU4NiwiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6IjE0bk5YT21jaWt6emlWZWNIcWE1UmMzOENPM1BVSmJuT2MzazJJdEtDZlEifQ.eyJ2ZW5kb3IiOnsiaWQiOiJkYmF1Y2giLCJuYW1lIjoiRGF2aWQgQmF1Y2gifSwiZGluZXIiOnsiaWQiOjYsIm5hbWUiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QGVtYWlsLmNvbSJ9LCJvcmRlciI6eyJpdGVtcyI6W3sibWVudUlkIjoyLCJkZXNjcmlwdGlvbiI6IlBlcHBlcm9uaSIsInByaWNlIjowLjAwNDJ9LHsibWVudUlkIjozLCJkZXNjcmlwdGlvbiI6Ik1hcmdhcml0YSIsInByaWNlIjowLjAwNDJ9XSwic3RvcmVJZCI6IjEiLCJmcmFuY2hpc2VJZCI6MSwiaWQiOjJ9fQ.BYH-AV_f-grbxoa5XqOGR0xxAllNqCiZ9hJ8t4Vl1_nWWDCwIFUXIR4n-L_sL1TB7wg507GTlDIPFPOsTs1NVLicBpOTZdEcTjld7kkaj-IP7nSzYj1ibl-DKMxQuMHkDYskKaY0sF91tR_lfpspXMu5lSmMLXUoMMWStA-gAgy_LVQ89URBGRfXoYb4IhETsyYSJgT2z6GSM4i_SVDShl-kIwL6KjeqasZhPYKz7fXXpUSSfZIYGDi7-qe1nFeGY12MhGlUD4HvW4HIpPjCVpbKmp30UsYeev7TjS4fiCesPB1XEN56xyI85kaY8lLGyQ1xlKXOII4HR3EI2ui2_qYSgTqPql9pW2-gBFq8gC8JPi8h7jsGLpjHiJZhEXTzYKAabXJO5-kfZKvdURKMdCSxstwiJdvArjh7BhvA9M6xA-Inkze4sSi6ZiuTfTkahvowuandPFlGJHtIMIx-RBVE7HXZmoMen9_NiLU7X43V3-meZoOGvq6iahVZaAi6bbntg8dzHMRnpYydi2mxahXPU4GvlKX3Ulwena6akaubQ08ryj9C9WULZSyt_Sb1AE4HYdfjxOuEqCwS-L2HZ1qTq4weoTNW-Mb5uHwxpCl92QyXSMx8lu1Rbj-5NbIyiKdfMBYKWbaYe-4bFIczkFuLSf4desboL0FrjrOJKjU",
	};

	await page.route("*/**/api/order/menu", async (route) => {
		const method = route.request().method();
		expect(method).toBe("GET");
		await route.fulfill({ json: mockGetOrderMenuResponse });
	});

	await page.route("*/**/api/franchise", async (route) => {
		const method = route.request().method();
		expect(method).toBe("GET");
		await route.fulfill({ json: mockGetFranchiseReponse });
	});

	await page.route("*/**/api/order", async (route) => {
		const method = route.request().method();
		expect(method).toBe("POST");
		await route.fulfill({ json: mockPostOrderResponse });
	});

	await registerAndLogoutAndLogin(page);

	await page.getByRole("link", { name: "Order" }).click();

	await page.getByRole("link", { name: "Order" }).click();
	await expect(
		page
			.locator("#root div")
			.filter({ hasText: "Pick your store and pizzas" })
			.nth(3)
	).toBeVisible();
	await expect(page.getByRole("combobox")).toBeVisible();
	await page.getByRole("combobox").selectOption("1");
	await expect(page.getByRole("combobox")).toContainText("choose storeProvo");
	await page
		.getByRole("link", { name: "Image Description Pepperoni" })
		.click();
	await expect(page.locator("form")).toContainText("Selected pizzas: 1");
	await page
		.getByRole("link", { name: "Image Description Margarita" })
		.click();
	await expect(page.locator("form")).toContainText("Selected pizzas: 2");

	await expect(page.locator("form")).toContainText(
		"VeggieA garden of delight"
	);
	await expect(page.locator("form")).toContainText(
		"MargaritaEssential classic"
	);
	await expect(page.locator("form")).toContainText("PepperoniSpicy treat");
	await expect(page.locator("form")).toContainText(
		"CrustyA dry mouthed favorite"
	);
	await expect(page.locator("form")).toContainText(
		"Charred LeopardFor those with a darker side"
	);
	await expect(
		page.getByRole("link", { name: "Image Description Pepperoni" })
	).toBeVisible();
	await expect(
		page.getByRole("link", { name: "Image Description Margarita" })
	).toBeVisible();
	await expect(
		page.getByRole("link", { name: "Image Description Crusty A" })
	).toBeVisible();
	await expect(
		page.getByRole("link", { name: "Image Description Charred" })
	).toBeVisible();
	await expect(
		page.getByRole("link", { name: "Image Description Veggie A" })
	).toBeVisible();

	await expect(page.getByRole("combobox")).toHaveValue("1");
	await page.getByRole("button", { name: "Checkout" }).click();
	await expect(page.getByRole("heading")).toContainText("So worth it");
	await expect(page.getByRole("main")).toContainText(
		"Send me those 2 pizzas right now!"
	);
	await expect(page.locator("tfoot")).toContainText("2 pies");
	await expect(page.getByRole("list")).toContainText("payment");
	await expect(page.locator("thead")).toContainText("Pie");
	await expect(page.locator("thead")).toContainText("Price");
	await expect(page.getByRole("main")).toContainText("Pay now");
	await expect(page.getByRole("main")).toContainText("Cancel");
	await page.getByRole("button", { name: "Pay now" }).click();

	await expect(page.getByRole("heading")).toContainText(
		"Here is your JWT Pizza!"
	);
	await expect(page.getByRole("main")).toContainText("Order more");
	await expect(page.getByRole("main")).toContainText("Verify");
	await expect(page.getByRole("main")).toContainText("2");
	await expect(page.getByRole("main")).toContainText("total:");
	await expect(page.getByRole("main").getByRole("img")).toBeVisible();
	await page.getByRole("button", { name: "Verify" }).click();
});
