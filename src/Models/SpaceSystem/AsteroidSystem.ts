import { MeshBuilder, Scalar, Vector3 } from 'babylonjs';
import { IContext } from '../IContext';

export class AsteroidSystem {
  public static create(context: IContext): void {
    if (!context) throw Error(`The context is null.`);

    const fieldSize = 999;
    const starSystem = MeshBuilder.CreateSphere(
      'AsteroidSystem',
      {
        diameter: 1,
        updatable: false,
      },
      context.scene
    );
    starSystem.isVisible = false;

    const rootSphere = MeshBuilder.CreateSphere(
      `AsteroidRoot`,
      {
        diameter: 1,
        updatable: false,
      },
      context.scene
    );
    rootSphere.isVisible = false;

    for (let i = 0; i < fieldSize; i++) {
      const name = `${i.toString().padStart(4, '0')}`;
      // const position = new Vector3(0, 0, 50);
      const fieldDiamater = 6000;
      const position = new Vector3(
        Scalar.Denormalize(Math.random(), -fieldDiamater, fieldDiamater),
        Scalar.Denormalize(Math.random(), -fieldDiamater, fieldDiamater),
        Scalar.Denormalize(Math.random(), -fieldDiamater, fieldDiamater)
      );

      const sphereSize = Scalar.Denormalize(Math.random(), 10, 200);
      const sphere = rootSphere.createInstance(`Asteroid_${name}`);
      sphere.parent = starSystem;
      sphere.position = position;
      sphere.isVisible = true;
      sphere.scaling = new Vector3(sphereSize, sphereSize, sphereSize);
    }

    console.log(`Finished creating ${fieldSize} asteroids.`);
  }
}
