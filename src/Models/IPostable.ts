import { IWorkerMessage } from './Events/IWorkMessage';

export type IPostable = {
  postMessage(data: IWorkerMessage): void;
};
