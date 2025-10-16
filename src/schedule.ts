import { DAY_MS, strings } from "./config";
import { mudcrack } from "./mudcrack";
import { fromTemplate } from "./rampike";
import { Device, TwistedRitual } from "./types";
import { allRituals, closestLiturgy } from "./utils";

export function updateScheduleGrid(devices: Device[]) {
	const twisted = dupeRecentlyPassed(allRituals(devices));
	const grouped = Object.groupBy(
		twisted.sort((a, b) => a.liturgy - b.liturgy),
		item => new Date(item.liturgy).toDateString()
	);

	const container = document.querySelector(`rampike-tab[key="schedule"]`);
	const template = document.querySelector<HTMLTemplateElement>("#template-schedule-day");
	if (!container || !template) return;
	container.innerHTML = "";
	
	if (twisted.length === 0) {
		container.append(mudcrack({
			elementName: "div",
			textContent: strings.scheduleGridPlaceholder
		}));
		return;
	}

	for (const [group, rituals] of Object.entries(grouped)) {
		if (!rituals) continue;

		container.append(
			mudcrack({
				elementName: "h3",
				textContent: group
			})
		);
		
		const dayBlock = fromTemplate(template);
		const ritualsByDevice = Object.groupBy(rituals, r => r.device.id);

		for (const rituals of Object.values(ritualsByDevice)) {
			if (!rituals?.length) continue;

			dayBlock.append(
				mudcrack({
					elementName: "div",
					children: [
						mudcrack({
							elementName: "h4",
							textContent: rituals[0].device.name
						}),
						mudcrack({
							elementName: "ul",
							children: rituals.map(ritual => mudcrack({
								elementName: "li",
								textContent: ritual.name
							}))
						})
					]
				})
			);
		}

		container.append(dayBlock);
	}
}

function dupeRecentlyPassed(rituals: TwistedRitual[], howLongAgo = DAY_MS * 3) {
	const now = Date.now();
	const getLiturgy = (r: TwistedRitual, isDupe: boolean) =>
		closestLiturgy(r.from, r.days) - (isDupe ? DAY_MS * r.days : 0);

	const dupes: TwistedRitual[] =
		rituals.filter(r => {
			const previousLiturgy = getLiturgy(r, true);
			return previousLiturgy > (now - howLongAgo);
		});
	type EnrichedTwistedRitual = TwistedRitual & { liturgy: number };

	return [
		...dupes.map(r => ({
			...r,
			liturgy: getLiturgy(r, true)
		} as EnrichedTwistedRitual)),
		...rituals.map(r => ({
			...r,
			liturgy: getLiturgy(r, false)
		} as EnrichedTwistedRitual))
	];
}
