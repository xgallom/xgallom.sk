import type {Dimensions} from './Dimensions';

const CharacterDimensions = {
  width: 9,
  height: 16,
};

// Standard VGA color palette
const Color = [
  '#000000',
  '#0000aa',
  '#00aa00',
  '#00aaaa',
  '#aa0000',
  '#aa00aa',
  '#aa5500',
  '#aaaaaa',
  '#555555',
  '#5555ff',
  '#55ff55',
  '#55ffff',
  '#ff5555',
  '#ff55ff',
  '#ffff55',
  '#ffffff',
];

// Named color mapping
const ColorName = {
  Black: Color[0],
  Blue: Color[1],
  Green: Color[2],
  Cyan: Color[3],
  Red: Color[4],
  Magenta: Color[5],
  Brown: Color[6],
  Gray: Color[7],

  DarkGray: Color[8],
  BrightBlue: Color[9],
  BrightGreen: Color[10],
  BrightCyan: Color[11],
  BrightRed: Color[12],
  BrightMagenta: Color[13],
  Yellow: Color[14],
  White: Color[15],

  Fg: Color[7],
  Bg: Color[0],
};

export const Font = {
  Font: `16px VGA`,
  CharacterDimensions: CharacterDimensions,
  Color: Color,
  ColorName: ColorName,
};

