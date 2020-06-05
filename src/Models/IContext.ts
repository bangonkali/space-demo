import { Engine } from 'babylonjs/Engines/engine';
import { Scene } from 'babylonjs/scene';

export type IContext = {
  canvas: HTMLCanvasElement;
  engine: Engine;
  scene: Scene;
  basePath: string;
};
