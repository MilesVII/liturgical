import { Device, TwistedRitual } from "./types";

const PERSIST_KEY = "devices"

const MIN_MS = 60 * 1000;
const HOUR_MS = 60 * MIN_MS;
export const DAY_MS = 24 * HOUR_MS;
export const DEFAULT_TIME = 10 * HOUR_MS;

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

export function closestLiturgy(startMS: number, days: number, now: Date = new Date()) {
	const today = stripTime(now).getTime() + DEFAULT_TIME;
	const step = days * DAY_MS;
	let offset = 0;
	while ((startMS + offset) < today) {
		offset += step;
	}
	return startMS + offset;
}

export function stripTime(d: Date): Date;
export function stripTime(d: number): Date;

export function stripTime(dRaw: Date | number) {
	const msMode = typeof dRaw === "number";
	const d = msMode ? new Date(dRaw) : dRaw;
	d.setHours(0);
	d.setMinutes(0);
	d.setSeconds(0);
	d.setMilliseconds(0);
	return d;
}

export function allRituals(devices: Device[]) {
	const r: TwistedRitual[] = [];

	for (const device of devices)
	for (const ritual of device.rituals) {
		r.push({
			...ritual,
			device: {
				id: device.id,
				name: device.name
			}
		});
	}

	return r;
}
