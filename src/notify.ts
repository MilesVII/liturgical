import { isPermissionGranted, requestPermission } from "@tauri-apps/plugin-notification";
import type { Device } from "./types";
import { invoke } from '@tauri-apps/api/core';
import { closestLiturgy } from "./utils";

export async function updateNotifications(devices: Device[]) {
	if (!await permission()) return;

	await cancel();

	for (const device of devices)
	for (const ritual of device.rituals) {
		await schedule({
			title: `🕯️${device.name}`,
			body: ritual.name,
			start: closestLiturgy(ritual.from, ritual.days),
			days: ritual.days
		});
	}
}

async function permission() {
	let permissionGranted = await isPermissionGranted();

	if (!permissionGranted) {
		const permission = await requestPermission();
		permissionGranted = permission === 'granted';
	}

	return permissionGranted;
}

type Args = {
	start: number,
	days: number,
	title: String,
	body: String
}

export async function schedule(value: Args): Promise<void> {
	await invoke<Args>("plugin:litnot|scheduleNotification", value);
}

export async function cancel(): Promise<void> {
	await invoke("plugin:litnot|cancelAll");
}
