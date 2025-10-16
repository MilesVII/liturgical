import { strings } from "./config";
import { mudcrack } from "./mudcrack";
import { fromTemplate, rampike } from "./rampike";
import type { Device, Ritual } from "./types";
import { dateStringToUnixTime, unixTimeToDateString } from "./utils";

export function addDevice(container: HTMLElement, device: Device, devices: Device[], updateAll: () => void) {
	const rename = (name: string) => {
		device.name = name;
		updateAll();
	}
	const remove = () => {
		const index = devices.findIndex(d => d.id === device.id);
		if (index === -1) return;
		devices.splice(index, 1);
		updateAll();
	}
	const addRitual = (ritual: Ritual) => {
		device.rituals.push(ritual);
		updateAll();
	}
	const removeRitual = (r: number) => {
		device.rituals.splice(r, 1);
		updateAll();
	}
	const root = renderDevice(device, rename, remove, addRitual, removeRitual)
	container.append(root)
}

function renderDevice(
	device: Device,
	rename: (name: string) => void,
	remove: () => void,
	addRitual: (ritual: Ritual) => void,
	removeRitual: (ritualIndex: number) => void
) {
	const template = document.querySelector<HTMLTemplateElement>("#template-device")!;
	const node = fromTemplate(template);
	const title = node.querySelector("h2")!;
	const startDate = node.querySelector<HTMLInputElement>(".date-input")!;
	const titleEdible = () => !(!title.contentEditable || title.contentEditable === "false" || title.contentEditable === "inherit");
	const root = rampike(node, device, (params, root) => {
		title.textContent = params.name;

		const ritualsList = root.querySelector(".device-rituals-list")!;
		ritualsList.innerHTML = "";
		if (params.rituals.length) {
			params.rituals.forEach((ritual, i) => {
				const r = ritualView(ritual, () => {
					removeRitual(i);
					root.rampike.render();
				});
				ritualsList.append(r);
			})
		} else {
			const template = document.querySelector<HTMLTemplateElement>("template#template-rituals-placeholder")!;
			const placeholder = fromTemplate(template);
			ritualsList.append(placeholder);
		}
	});
	const today = unixTimeToDateString(Date.now() / 1000);

	const [renameButton, removeButton] = root.querySelectorAll("button");
	const saveName = () => {
		title.contentEditable = "false";
		rename(title.textContent!);
		root.rampike.render();
	};
	renameButton.addEventListener("click", () => {
		if (titleEdible()) {
			saveName();
		} else {
			title.contentEditable = "plaintext-only";
			title.focus();
		}
	});
	title.addEventListener("blur", () => {
		if (titleEdible()) saveName();
	});
	removeButton.addEventListener("click", () => {
		if (!confirm(strings.removeDeviceConfirm(device.name))) return;
		root.remove();
		remove();
	});
	const ritualButton = node.querySelector("#device-rituals-form button")!;
	ritualButton.addEventListener("click", () => {
		const form = node.querySelector("#device-rituals-form")!;
		const name = form.querySelector<HTMLInputElement>   (`[data-id="name"]`)!;
		const desc = form.querySelector<HTMLTextAreaElement>(`[data-id="desc"]`)!;
		const time = form.querySelector<HTMLInputElement>   (`[data-id="time"]`)!;
		const from = form.querySelector<HTMLInputElement>   (`[data-id="from"]`)!;
		const values = {
			name: name.value,
			desc: desc.value,
			days: parseInt(time.value, 10),
			from: dateStringToUnixTime(from.value)
		}
		if (!values.name || isNaN(values.days)) {
			alert(strings.ritualValidationError)
			return;
		}

		addRitual(values);
		name.value = "";
		desc.value = "";
		time.value = "10";
		from.value = today;

		root.rampike.render();
	});

	startDate.value = today;

	return root;
}

function ritualView(ritual: Ritual, removeCB: () => void) {
	const template = document.querySelector<HTMLTemplateElement>("template#template-ritual")!;
	const ritualContainer = fromTemplate(template);

	ritualContainer.querySelector("summary")!.textContent = ritual.name;
	const details = ritualContainer.querySelector("div")!;

	details.append(
		mudcrack({
			elementName: "div",
			className: "device-ritual-description",
			textContent: ritual.desc
		}),
		mudcrack({
			elementName: "div",
			textContent: `every ${ritual.days} days`
		}),
		mudcrack({
			elementName: "button",
			className: "strip-defaults butt-on",
			textContent: "remove",
			events: {
				"click": removeCB
			}
		})
	);

	return ritualContainer;
}
