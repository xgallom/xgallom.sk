type Dimensions = { width: number, height: number };
type Position = { x: number, y: number };

const CharacterDimensions: Dimensions = {
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

CanvasRenderingContext2D.prototype.clear = CanvasRenderingContext2D.prototype.clear || function () {
  const fill = this.fillStyle;
  this.fillStyle = ColorName.Background;

  this.fillRect(0, 0, this.canvas.width, this.canvas.height);

  this.fillStyle = fill;
};

export class Emulator {
  windowDimensions: Dimensions;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.windowDimensions = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.canvas.width = this.windowDimensions.width;
    this.canvas.height = this.windowDimensions.height;

    this.context = this.canvas.getContext('2d', {alpha: false});

    this.context.clear();

    this.context.font = `16px VGA`;
    this.context.textBaseline = 'middle';
    this.context.textAlign = 'center';
    this.context.fillStyle = ColorName.White;

    this.context.fillText('Under Construction', this.windowDimensions.width / 2, this.windowDimensions.height / 2);

    // this.context.fillRect(200 - 1, 200 - 1, 4 * CharacterDimensions.width + 2, 4 * CharacterDimensions.height + 2);
    //
    // this.context.fillStyle = ColorName.BrightMagenta;
    //
    // this.context.fillText('████', 200, 200);
    //
    // this.context.fillText('█┌┐█', 200 + 0 * CharacterDimensions.width, 200 + CharacterDimensions.height);
    //
    // this.context.fillText('█└┘█', 200 + 0 * CharacterDimensions.width, 200 + 2 * CharacterDimensions.height);
    //
    // this.context.fillText('████', 200 + 0 * CharacterDimensions.width, 200 + 3 * CharacterDimensions.height);
  }
}

