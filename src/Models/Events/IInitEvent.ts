import { DocumentEventType } from './DocumentEventType';

export type IInitEvent = {
  type: DocumentEventType.Init;
  canvas?: HTMLCanvasElement | OffscreenCanvas;
  basePath?: string;
};
