export const EmulatorCommandType = {
  Run: 'run',
};

export type EmulatorCommand = {
  command: 'run',
  data: Object,
};


export type EmulatorUpdateCallback = (command: EmulatorCommand) => void;

