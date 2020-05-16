import type {EmulatorContext} from '../Context';
import type {MainInterface} from '../MainInterface';
import type {EmulatorUpdateCallback} from '../UpdateCallback';

export class Main implements MainInterface {
  context: EmulatorContext;
  content: Object;
  updateCallback: EmulatorUpdateCallback;

  constructor(context: EmulatorContext, content: Object)
  {
    this.context = context;
    this.content = content
  }

  deinitialize(): void
  {

  }

  run(updateCallback: EmulatorUpdateCallback): void
  {
    this.updateCallback = updateCallback;
  }
}
