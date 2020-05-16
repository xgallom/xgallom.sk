export const EmulatorCommandType = {
  Run: 'run',
};

export type EmulatorCommand = {
  command: EmulatorCommandType.Run,
  data: Object,
};


export type EmulatorUpdateCallback = (command: EmulatorCommand) => void;

