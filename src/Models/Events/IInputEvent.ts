import { DocumentEventType } from './DocumentEventType';
import { KeyState } from './KeyState';
import { Vector2 } from 'babylonjs';

export type IInputEvent = {
  type: DocumentEventType.Input;
  ctrlKey?: boolean;
  key?: string;
  keyState?: KeyState;
  mousePosition?: Vector2;
  mouseClicked?: boolean;
};
