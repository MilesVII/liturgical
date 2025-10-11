import { active, cancelAll, channels, isPermissionGranted, pending, removeAllActive, requestPermission, Schedule, ScheduleEvery, sendNotification } from "@tauri-apps/plugin-notification";
import type { Device } from "./types";

export async function updateNotifications(devices: Device[]) {
	if (!await permission()) return;

	await prepare();
	// for (const device of devices) {
	// 	for (const ritual of device.rituals) {
	// 		sendNotification({
	// 			title: `🕯️${device.name}`,
	// 			body: ritual.name,
	// 			schedule: Schedule.interval({
	// 				day: ritual.days
	// 			}, true)
	// 		})
	// 	}
	// }
	// sendNotification({
	// 	title: `🕯️${"title"}`,
	// 	body: "body",
	// 	schedule: {
	// 		at: undefined,
	// 		every: {
	// 			allowWhileIdle: true,
	// 			count: 5,
	// 			interval: ScheduleEvery.Second
	// 		},
	// 		interval: undefined
	// 	}
	// });
}

async function prepare() {

	await removeAllActive();
	await cancelAll();
}


async function permission() {
	// Do you have permission to send a notification?
	let permissionGranted = await isPermissionGranted();

	// If not we need to request it
	if (!permissionGranted) {
		const permission = await requestPermission();
		permissionGranted = permission === 'granted';
	}

	return permissionGranted;
}
