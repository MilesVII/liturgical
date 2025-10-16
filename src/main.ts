import { addDevice } from "./devicecard";
import { updateNotifications } from "./notify";
import { updateScheduleGrid } from "./schedule";
import { define as defineTabs, RampikeTabs } from "./tabs";
import type { Device } from "./types";
import { load, save } from "./utils";

window.addEventListener("DOMContentLoaded", main);

async function main() {
	defineTabs();
	const devices: Device[] = load();

	const container = document.querySelector<HTMLElement>(".devices-list");
	if (!container) return;

	devices.forEach(d => addDevice(container, d, devices, () => updateAndSaveAll(devices)));
	updateScheduleGrid(devices);

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
		addDevice(container, newDevice, devices, () => updateAndSaveAll(devices));
		updateAndSaveAll(devices);
	});

	// document.querySelector("h1")!.addEventListener("click", () => updateNotifications([]));
	const tabs = document.querySelector<RampikeTabs>("#rp-tabs-side")!;
	if (devices.length === 0) tabs.tab = "manage";
	document
		.querySelectorAll<HTMLButtonElement>(".tabs-selector button")
		.forEach(button => {
			const buttonTab = button.dataset.tab;
			if (!buttonTab) return;
			button.addEventListener("click", () => {
				tabs.tab = buttonTab;
			});
		});
}

function updateAndSaveAll(devices: Device[]) {
	save(devices);
	updateScheduleGrid(devices);
	updateNotifications(devices);
}
