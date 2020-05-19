export type EmulatorIntervalHandler = { duration: number, handler: ?number };
export type EmulatorEventHandler = ?(event: Event) => void;
