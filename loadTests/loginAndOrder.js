import { check, fail, group, sleep } from "k6";
import http from "k6/http";

export const options = {
	cloud: {
		distribution: {
			"amazon:us:ashburn": {
				loadZone: "amazon:us:ashburn",
				percent: 100,
			},
		},
		apm: [],
	},
	thresholds: {},
	scenarios: {
		Scenario_1: {
			executor: "ramping-vus",
			gracefulStop: "30s",
			stages: [
				{ target: 5, duration: "30s" },
				{ target: 15, duration: "1m" },
				{ target: 10, duration: "30s" },
				{ target: 0, duration: "30s" },
			],
			gracefulRampDown: "30s",
			exec: "scenario_1",
		},
	},
};

function failIfStatusCodeNot(response, statusCode = "200") {
	if (
		!check(response, {
			[`status equals ${statusCode}`]: (response) =>
				response.status.toString() === statusCode,
		})
	) {
		console.log(response.body);
		fail(`Login was *not* ${statusCode}`);
	}
}

export function scenario_1() {
	let response;

	const vars = {};

	group("page_3 - https://pizza.borea.io/", function () {
		response = http.get("https://pizza.borea.io/", {
			headers: {
				accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
				"accept-encoding": "gzip, deflate, br, zstd",
				"accept-language": "en-US,en;q=0.9",
				"cache-control": "no-cache",
				dnt: "1",
				priority: "u=0, i",
				"sec-ch-ua": '"Not:A-Brand";v="24", "Chromium";v="134"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"macOS"',
				"sec-fetch-dest": "document",
				"sec-fetch-mode": "navigate",
				"sec-fetch-site": "same-origin",
				"sec-fetch-user": "?1",
				"upgrade-insecure-requests": "1",
			},
		});

		failIfStatusCodeNot(response);
		sleep(3);

		response = http.put(
			"https://pizza-service.borea.io/api/auth",
			'{"email":"a@jwt.com","password":"admin"}',
			{
				headers: {
					accept: "*/*",
					"accept-encoding": "gzip, deflate, br, zstd",
					"accept-language": "en-US,en;q=0.9",
					"cache-control": "no-cache",
					"content-type": "application/json",
					dnt: "1",
					origin: "https://pizza.borea.io",
					priority: "u=1, i",
					"sec-ch-ua": '"Not:A-Brand";v="24", "Chromium";v="134"',
					"sec-ch-ua-mobile": "?0",
					"sec-ch-ua-platform": '"macOS"',
					"sec-fetch-dest": "empty",
					"sec-fetch-mode": "cors",
					"sec-fetch-site": "same-site",
				},
			}
		);

		failIfStatusCodeNot(response);
		sleep(3);

		vars["token1"] = response.json().token;

		response = http.get("https://pizza-service.borea.io/api/order/menu", {
			headers: {
				accept: "*/*",
				"accept-encoding": "gzip, deflate, br, zstd",
				"accept-language": "en-US,en;q=0.9",
				authorization: `Bearer ${vars["token1"]}`,
				"cache-control": "no-cache",
				"content-type": "application/json",
				dnt: "1",
				origin: "https://pizza.borea.io",
				priority: "u=1, i",
				"sec-ch-ua": '"Not:A-Brand";v="24", "Chromium";v="134"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"macOS"',
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-site",
			},
		});

		failIfStatusCodeNot(response);

		response = http.get("https://pizza-service.borea.io/api/franchise", {
			headers: {
				accept: "*/*",
				"accept-encoding": "gzip, deflate, br, zstd",
				"accept-language": "en-US,en;q=0.9",
				authorization: `Bearer ${vars["token1"]}`,
				"cache-control": "no-cache",
				"content-type": "application/json",
				dnt: "1",
				origin: "https://pizza.borea.io",
				priority: "u=1, i",
				"sec-ch-ua": '"Not:A-Brand";v="24", "Chromium";v="134"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"macOS"',
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-site",
			},
		});

		failIfStatusCodeNot(response);
		sleep(3);

		response = http.post(
			"https://pizza-service.borea.io/api/order",
			'{"items":[{"menuId":1,"description":"Veggie","price":0.0038}],"storeId":"1","franchiseId":1}',
			{
				headers: {
					accept: "*/*",
					"accept-encoding": "gzip, deflate, br, zstd",
					"accept-language": "en-US,en;q=0.9",
					authorization: `Bearer ${vars["token1"]}`,
					"cache-control": "no-cache",
					"content-type": "application/json",
					dnt: "1",
					origin: "https://pizza.borea.io",
					priority: "u=1, i",
					"sec-ch-ua": '"Not:A-Brand";v="24", "Chromium";v="134"',
					"sec-ch-ua-mobile": "?0",
					"sec-ch-ua-platform": '"macOS"',
					"sec-fetch-dest": "empty",
					"sec-fetch-mode": "cors",
					"sec-fetch-site": "same-site",
				},
			}
		);

		failIfStatusCodeNot(response);
		sleep(3);

		vars.jwt = response.json().jwt;

		response = http.post(
			"https://pizza-factory.cs329.click/api/order/verify",
			`{"jwt": "${vars.jwt}"}`,
			{
				headers: {
					accept: "*/*",
					"accept-encoding": "gzip, deflate, br, zstd",
					"accept-language": "en-US,en;q=0.9",
					authorization: `Bearer ${vars["token1"]}`,
					"cache-control": "no-cache",
					"content-type": "application/json",
					dnt: "1",
					origin: "https://pizza.borea.io",
					priority: "u=1, i",
					"sec-ch-ua": '"Not:A-Brand";v="24", "Chromium";v="134"',
					"sec-ch-ua-mobile": "?0",
					"sec-ch-ua-platform": '"macOS"',
					"sec-fetch-dest": "empty",
					"sec-fetch-mode": "cors",
					"sec-fetch-site": "cross-site",
					"sec-fetch-storage-access": "active",
				},
			}
		);
	});

	failIfStatusCodeNot(response);

	// Automatically added sleep
	sleep(1);
}
