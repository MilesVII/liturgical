import { Device } from "./types";

const PERSIST_KEY = "devices"

export function unixTimeToDateString(unixTime: number): string {
	const date = new Date(unixTime * 1000);
	const murica = date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
	const [m, d, y] = murica.split("/");
	return `${y}-${m}-${d}`;
}

export function dateStringToUnixTime(raw: string): number {
	const [y, m, d] = raw.split("-").map(e => parseInt(e, 10));
	const date = new Date(y, m - 1, d);
	return Math.floor(date.getTime() / 1000)
}

export function save(devices: Device[]) {
	window.localStorage.setItem(PERSIST_KEY, JSON.stringify(devices));
}

export function load(): Device[] {
	return JSON.parse(window.localStorage.getItem(PERSIST_KEY) ?? "[]");
}
