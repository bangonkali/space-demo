import { Vector3, AbstractMesh } from 'babylonjs';

export type IMoveable = {
  mesh: AbstractMesh;
  mass: number;
  basePath: string;

  velocity: Vector3;
  maxVelocity: Vector3;
  maxReverseVelocity: number;

  acceleration: Vector3;
  maxAcceleration: Vector3;
  maxReverseAcceleration: number;

  angularAcceleration: Vector3;
  maxAngularAcceleration: Vector3;

  jerk: Vector3;
};
