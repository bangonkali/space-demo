import { App } from './app';
import { IWorkerMessage } from './Models/Events/IWorkMessage';
import { DocumentEventType } from './Models/Events/DocumentEventType';
import { IInputEvent } from './Models/Events/IInputEvent';
import { KeyState } from './Models/Events/KeyState';
import { IResizeEvent } from './Models/Events/IResizeEvent';
import { Vector2 } from 'babylonjs';
import { DomUtils } from './Utils/DomUtils';

function init() {
  console.log('Starting');
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  const basePath = document.location.origin;

  if (!canvas) return;

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  if ('OffscreenCanvas' in window && 'transferControlToOffscreen' in canvas) {
    const offScreenCanvas = canvas.transferControlToOffscreen();
    const worker = new Worker(`${basePath}/dist/worker.bundle.js`);
    const message: IWorkerMessage = {
      type: DocumentEventType.Init,
      canvas: offScreenCanvas,
      basePath: document.location.origin,
    };
    worker.postMessage(message, [offScreenCanvas]);

    window.addEventListener('keydown', (e) => {
      const data: IInputEvent = {
        type: DocumentEventType.Input,
        ctrlKey: e.ctrlKey,
        key: e.key,
        keyState: KeyState.KeyDown,
      };
      // console.log('event sent', data);
      worker.postMessage(data);
    });

    window.addEventListener('keyup', (e) => {
      const data: IInputEvent = {
        type: DocumentEventType.Input,
        ctrlKey: e.ctrlKey,
        key: e.key,
        keyState: KeyState.KeyUp,
      };
      worker.postMessage(data);
      // console.log('event sent', data);
    });

    canvas.addEventListener('mousemove', (ev: MouseEvent) => {
      const canvasRect = canvas.getBoundingClientRect();
      const position = DomUtils.getMousePosition(ev, canvasRect);
      const mousePosition = new Vector2(position.x, position.y);
      const data: IInputEvent = {
        type: DocumentEventType.Input,
        mousePosition: mousePosition,
      };
      worker.postMessage(data);
      // console.log(mousePosition);
    });

    canvas.addEventListener('mouseleave', (ev: MouseEvent) => {
      const data: IInputEvent = {
        type: DocumentEventType.Input,
        mouseClicked: false,
      };
      worker.postMessage(data);
    });

    canvas.addEventListener('mouseup', (ev: MouseEvent) => {
      const canvasRect = canvas.getBoundingClientRect();
      const position = DomUtils.getMousePosition(ev, canvasRect);
      const mousePosition = new Vector2(position.x, position.y);
      const data: IInputEvent = {
        type: DocumentEventType.Input,
        mousePosition: mousePosition,
        mouseClicked: false,
      };
      worker.postMessage(data);
    });

    canvas.addEventListener('mousedown', (ev: MouseEvent) => {
      const canvasRect = canvas.getBoundingClientRect();
      const position = DomUtils.getMousePosition(ev, canvasRect);
      const mousePosition = new Vector2(position.x, position.y);
      const data: IInputEvent = {
        type: DocumentEventType.Input,
        mousePosition: mousePosition,
        mouseClicked: true,
      };
      worker.postMessage(data);
    });

    window.addEventListener('resize', () => {
      const resizeEvent: IResizeEvent = {
        type: DocumentEventType.Resize,
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      };
      worker.postMessage(resizeEvent);
    });
  } else {
    fetch(`${basePath}/assets/data.json`)
      .then((response) => response.json())
      .then((jsonResponse) => console.log(jsonResponse));
    App.AppInstance.run(canvas, document.location.href);
  }
}

if (document) init();
