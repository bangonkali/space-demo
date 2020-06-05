import { IComponent } from '../Models/IComponent';
import { Vector3 } from 'babylonjs';
import { AbstractMesh } from 'babylonjs/Meshes/abstractMesh';

export type IMoveableComponent =
  | IComponent
  | {
      filterBitField: 1;
      velocity: Vector3;
      maxVelocity: Vector3;
      minVelocity: Vector3;
      acceleration: Vector3;

      mesh: AbstractMesh;
    };
