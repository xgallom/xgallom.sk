export type EmulatorIntervalHandler = { duration: number, handler: number | null | undefined };
export type EmulatorEventHandler = (event: Event) => void | null | undefined;
