const MIN_MS = 60 * 1000;
const HOUR_MS = 60 * MIN_MS;
export const DAY_MS = 24 * HOUR_MS;
export const DEFAULT_TIME = 10 * HOUR_MS;

export const strings = {
	removeDeviceConfirm: (name: string) => `удаляем устройство ${name}`,
	ritualValidationError: "не указано имя или дата последней службы",
	scheduleGridPlaceholder: "ритуалов нет"
}
