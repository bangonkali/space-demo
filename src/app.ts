import {
  Engine,
  Scene,
  HemisphericLight,
  Vector3,
  ActionManager,
  SceneLoader,
  AbstractMesh,
  Scalar,
  Color3,
  Color4,
  Quaternion,
} from 'babylonjs';
import { MoveableMesh } from './Models/Ships/MoveableMesh';
import { IContext } from './Models/IContext';
import { Game } from './Models/Game/Game';
import { IInputEvent } from './Models/Events/IInputEvent';
import { IWorkerMessage } from './Models/Events/IWorkMessage';
import { DocumentEventType } from './Models/Events/DocumentEventType';
import { StarSystem } from './Models/StarSystem/StarSystem';
import * as nakamajs from '@heroiclabs/nakama-js';
import { IResizeEvent } from './Models/Events/IResizeEvent';

export class App {
  public static AppInstance: App = new App();
  public static IsWorkerStarted = false;

  public context: IContext | undefined;
  public game: Game | undefined;

  private initialize(canvas: HTMLCanvasElement, basePath: string): void {
    const _canvas = canvas as HTMLCanvasElement;
    const engine = new Engine(_canvas, true);
    const scene = new Scene(engine);
    this.context = {
      canvas: canvas,
      engine: engine,
      scene: scene,
      basePath: basePath,
    };

    this.context.scene.clearColor = Color4.FromColor3(Color3.BlackReadOnly);
    this.context.scene.actionManager = new ActionManager(this.context.scene);

    const client = new nakamajs.Client('defaultkey', '127.0.0.1', '7350');
    client.useSSL = true;
  }

  private async loadModel(path: string): Promise<AbstractMesh[]> {
    return new Promise((res) => {
      if (!this.context) throw Error(`The context is null.`);

      SceneLoader.ImportMesh(
        ['Ship004'],
        `${this.context.basePath}/assets/models/`,
        path,
        this.context.scene,
        (mesh) => {
          res(mesh);
        }
      );
    });
  }

  private async createGameAsync(): Promise<void> {
    if (!this.context) throw Error(`The context is null.`);

    const mesh = await this.loadModel('ship004.babylon');
    mesh[0].position = Vector3.Zero().addInPlaceFromFloats(0, 1, 0);
    const actor = new MoveableMesh(
      mesh[0],
      this.context.basePath,
      this.context.scene
    );
    actor.mesh.rotationQuaternion = Quaternion.RotationYawPitchRoll(
      0,
      0,
      Scalar.TwoPi
    );

    const light1 = new HemisphericLight(
      'light1',
      new Vector3(0, 1000, 0),
      this.context.scene
    );
    light1.intensity = 1;

    StarSystem.create(this.context);
    this.game = new Game(this.context, actor);
  }

  public run(canvas: HTMLCanvasElement, basePath: string): void {
    this.initialize(canvas, basePath);
    this.createGameAsync()
      .then(() => {
        this.game?.init();
      })
      .catch((e: Error): void => {
        console.log(e);
      });
  }

  public resizeEvent(resize: IResizeEvent): void {
    if (this.context && this.context.canvas && resize.width && resize.height) {
      this.context.canvas.width = resize.width;
      this.context.canvas.height = resize.height;
    }
  }

  /**
   * This is how the application receives inputs from mouse, keyboard, gamepad, or touch screen.
   * @param event The IInputEvent passed to the app layer.
   */
  public inputEvent(event: IInputEvent): void {
    if (!this.game) return;
    else this.game.inputEvent(event);
  }

  /**
   * Starts the application layer as a worker.
   */
  public static startWorker() {
    addEventListener('message', (message) => {
      const data = message.data as IWorkerMessage;
      switch (data.type) {
        case DocumentEventType.Init:
          if (!data.canvas || !data.basePath) {
            throw Error('The canvas and basePath must be defined.');
          }
          if (App.IsWorkerStarted)
            throw Error('This worker has already been started.');
          App.AppInstance.run(data.canvas as HTMLCanvasElement, data.basePath);
          break;
        case DocumentEventType.Input:
          App.AppInstance.inputEvent(data as IInputEvent);
          break;
        case DocumentEventType.Resize:
          App.AppInstance.resizeEvent(data as IResizeEvent);
          break;
      }
    });
  }
}
