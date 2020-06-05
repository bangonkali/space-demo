import { DocumentEventType } from './DocumentEventType';

export type IResizeEvent = {
  type: DocumentEventType.Resize;
  width?: number;
  height?: number;
};
