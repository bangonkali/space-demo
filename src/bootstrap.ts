import { App } from './app';
import { IWorkerMessage } from './Models/Events/IWorkMessage';
import { DocumentEventType } from './Models/Events/DocumentEventType';
import { IInputEvent } from './Models/Events/IInputEvent';
import { KeyState } from './Models/Events/KeyState';
import { IResizeEvent } from './Models/Events/IResizeEvent';
import { Vector2 } from 'babylonjs';
import { DomUtils } from './Utils/DomUtils';
import { IPostable } from './Models/IPostable';

export class Bootstrap {
  private basePath = DomUtils.cleanUrl(document.location.origin);
  private workerPath = DomUtils.cleanUrl(`${this.basePath}/worker.bundle.js`);
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  private bindInputs(client: IPostable) {
    console.log(`Binding input channel to canvas ${this.basePath}`);

    window.addEventListener('keydown', (e) => {
      const data: IInputEvent = {
        type: DocumentEventType.Input,
        ctrlKey: e.ctrlKey,
        key: e.key,
        keyState: KeyState.KeyDown,
      };
      client.postMessage(data);
    });

    window.addEventListener('keyup', (e) => {
      const data: IInputEvent = {
        type: DocumentEventType.Input,
        ctrlKey: e.ctrlKey,
        key: e.key,
        keyState: KeyState.KeyUp,
      };
      client.postMessage(data);
    });

    this.canvas.addEventListener('pointermove', (ev: MouseEvent) => {
      const canvasRect = this.canvas.getBoundingClientRect();
      const position = DomUtils.getMousePosition(ev, canvasRect);
      const mousePosition = new Vector2(position.x, position.y);
      const data: IInputEvent = {
        type: DocumentEventType.Input,
        mousePosition: mousePosition,
      };
      client.postMessage(data);
    });

    this.canvas.addEventListener('pointerleave', (ev: MouseEvent) => {
      const data: IInputEvent = {
        type: DocumentEventType.Input,
        mouseClicked: false,
      };
      client.postMessage(data);
    });

    document.addEventListener('pointerup', (ev: MouseEvent) => {
      const canvasRect = this.canvas.getBoundingClientRect();
      const position = DomUtils.getMousePosition(ev, canvasRect);
      const mousePosition = new Vector2(position.x, position.y);
      const data: IInputEvent = {
        type: DocumentEventType.Input,
        mousePosition: mousePosition,
        mouseClicked: false,
      };
      client.postMessage(data);
    });

    document.addEventListener('pointerdown', (ev: MouseEvent) => {
      const canvasRect = this.canvas.getBoundingClientRect();
      const position = DomUtils.getMousePosition(ev, canvasRect);
      const mousePosition = new Vector2(position.x, position.y);
      const data: IInputEvent = {
        type: DocumentEventType.Input,
        mousePosition: mousePosition,
        mouseClicked: true,
      };
      client.postMessage(data);
    });

    window.addEventListener('resize', () => {
      const resizeEvent: IResizeEvent = {
        type: DocumentEventType.Resize,
        width: this.canvas.clientWidth,
        height: this.canvas.clientHeight,
      };
      client.postMessage(resizeEvent);
    });
  }

  private runOnMainThread() {
    App.AppInstance.run(this.canvas, this.basePath);
    this.bindInputs(App.AppInstance);
  }

  public init() {
    if (!this.canvas) return;

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    if (
      __USE_WORKERS__ &&
      'OffscreenCanvas' in window &&
      'transferControlToOffscreen' in this.canvas
    ) {
      fetch(this.workerPath)
        .then((workerResponse: Response) => {
          if (workerResponse.ok) {
            console.info(`Worker found. Trying web worker.`);
            const offScreenCanvas = this.canvas.transferControlToOffscreen();
            const worker = new Worker(this.workerPath);
            const message: IWorkerMessage = {
              type: DocumentEventType.Init,
              canvas: offScreenCanvas,
              basePath: this.basePath,
            };
            worker.postMessage(message, [offScreenCanvas]);
            this.bindInputs(worker);
          } else {
            console.warn(`Worker not found. Using main thread.`);
            this.runOnMainThread();
          }
        })
        .catch((err) => {
          console.warn(`Worker not found, using main thread. ${err.message}`);
          this.runOnMainThread();
        });
    } else {
      console.warn(`Worker Disabled or not supported, using main thread.`);
      this.runOnMainThread();
    }
  }
}

const c = document.getElementById('renderCanvas') as HTMLCanvasElement;
const bootstrap = new Bootstrap(c);
bootstrap.init();
