import { addDevice } from "./devicecard";
import type { Device } from "./types";
import { load, save } from "./utils";

window.addEventListener("DOMContentLoaded", main);

async function main() {
	const devices: Device[] = load();

	const container = document.querySelector<HTMLElement>(".devices-list");
	if (!container) return;

	devices.forEach(d => addDevice(container, d, devices));

	const addDeviceButton = document.querySelector("#add-device-button")!;
	const addDeviceInput = document.querySelector<HTMLInputElement>("#add-device-name")!;
	addDeviceButton.addEventListener("click", () => {
		const name = addDeviceInput.value.trim();
		if (!name) return;

		addDeviceInput.value = "";
		const newDevice: Device = {
			id: Math.max(-1, ...devices.map(d => d.id)) + 1,
			name,
			rituals: []
		};
		devices.push(newDevice);
		addDevice(container, newDevice, devices);
		save(devices);
	});
}
