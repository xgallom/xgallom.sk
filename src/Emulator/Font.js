import type {Dimensions} from './Dimensions';

const CharacterDimensions = {
  width: 9,
  height: 16,
};

// Standard VGA color palette
const Color = [
  '#000000',
  '#0000AA',
  '#00AA00',
  '#00AAAA',
  '#AA0000',
  '#AA00AA',
  '#AA5500',
  '#AAAAAA',
  '#555555',
  '#5555FF',
  '#55FF55',
  '#55FFFF',
  '#FF5555',
  '#FF55FF',
  '#FFFF55',
  '#FFFFFF',
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

  Foreground: Color[7],
  Background: Color[0],
};

export const Font = {
  Font: `16px VGA`,
  CharacterDimensions: CharacterDimensions,
  Color: Color,
  ColorName: ColorName,
};

