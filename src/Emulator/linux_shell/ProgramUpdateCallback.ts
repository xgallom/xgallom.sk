// @ts-nocheck
export const ProgramCommandType = {
  Return: 'return',
  Exit: 'exit',
  Suspend: 'suspend',
  Restore: 'restore',
};

export type ProgramCommand = {
  command: ProgramCommandType.Run,
  data: Object,
};


export type ProgramUpdateCallback = (command: ProgramCommand) => void;

