
export type Ritual = {
	name: string,
	desc: string,
	days: number,
	from: number
}

export type Device = {
	id: number;
	name: string;
	rituals: Ritual[]
}

export type TwistedRitual = Ritual & { device: Omit<Device, "rituals"> };