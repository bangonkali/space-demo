import {
  Engine,
  Scene,
  HemisphericLight,
  Vector3,
  ActionManager,
  Scalar,
  Color3,
  Color4,
  Quaternion,
  CubeTexture,
} from 'babylonjs';
import { MoveableMesh } from './Models/Ships/MoveableMesh';
import { IContext } from './Models/IContext';
import { Game } from './Models/Game/Game';
import { IInputEvent } from './Models/Events/IInputEvent';
import { IWorkerMessage } from './Models/Events/IWorkMessage';
import { DocumentEventType } from './Models/Events/DocumentEventType';
import { AsteroidSystem } from './Models/SpaceSystem/AsteroidSystem';
import { IResizeEvent } from './Models/Events/IResizeEvent';
import _ from 'lodash';
import { IPostable } from './Models/IPostable';
import { DomUtils } from './Utils/DomUtils';
import { MeshUtils } from './Utils/MeshUtils';
import { VectorUtils } from './Utils/VectorUtils';

/**
 * Vector3(Left/Right, Up/Down, Forward/Backward);
 */
export class App implements IPostable {
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
  }

  private async loadSkybox(file: string): Promise<CubeTexture> {
    return new Promise((resolve, error) => {
      if (!this.context) throw Error(`The context is null.`);
      const path = `${this.context.basePath}/assets/skybox/${file}`;
      const texturePath = DomUtils.cleanUrl(path);
      const envTexture = new CubeTexture(
        texturePath,
        this.context.scene,
        undefined,
        true,
        undefined,
        () => {
          console.info(`Loaded '${texturePath}'`);
          resolve(envTexture);
        },
        (message, exception) => {
          console.error(`Error ${message} loading ${texturePath}`);
          error(exception);
        },
        undefined,
        false,
        undefined,
        true,
        undefined,
        undefined
      );
    });
  }

  private async createGameAsync(): Promise<void> {
    if (!this.context) throw Error(`The context is null.`);
    const skyboxFile = `purple-nebula-complex-1k.dds`;
    const texture = await this.loadSkybox(skyboxFile);
    this.context.scene.createDefaultSkybox(texture, true, 10000);

    const meshFile = `ship004.babylon`;
    const stuff = ['Ship004'];
    const mesh = await MeshUtils.loadModel(stuff, meshFile, this.context);
    mesh[0].position = Vector3.Zero().addInPlaceFromFloats(0, 1, 0);

    // const log = MeshUtils.getMeshDescriptor(mesh2[0]);
    // console.log(`Part: ${JSON.stringify(log, undefined, 2)}`);

    console.log(`Loaded all assets`);

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
      VectorUtils.GetRandomUnit(),
      this.context.scene
    );

    const light2 = new HemisphericLight(
      'light2',
      VectorUtils.GetRandomUnit(),
      this.context.scene
    );

    light1.intensity = 0.5;
    light2.intensity = 0.5;

    await AsteroidSystem.create(this.context);
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

  private resizeEvent(resize: IResizeEvent): void {
    if (this.context && this.context.canvas && resize.width && resize.height) {
      this.context.canvas.width = resize.width;
      this.context.canvas.height = resize.height;
    }
  }

  /**
   * This is how the application receives inputs from mouse, keyboard, gamepad, or touch screen.
   * @param event The IInputEvent passed to the app layer.
   */
  private inputEvent(event: IInputEvent): void {
    if (!this.game) return;
    else this.game.inputEvent(event);
  }

  public postMessage(data: IWorkerMessage) {
    switch (data.type) {
      case DocumentEventType.Input:
        this.inputEvent(data as IInputEvent);
        break;
      case DocumentEventType.Resize:
        this.resizeEvent(data as IResizeEvent);
        break;
    }
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
        default:
          App.AppInstance.postMessage(data);
          break;
      }
    });
  }
}
