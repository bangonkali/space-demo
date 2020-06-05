import { IInputEvent } from './IInputEvent';
import { IInitEvent } from './IInitEvent';
import { IResizeEvent } from './IResizeEvent';

export type IWorkerMessage = IInputEvent | IInitEvent | IResizeEvent;
