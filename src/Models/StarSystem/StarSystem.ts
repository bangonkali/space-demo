import { MeshBuilder, Scalar, Vector3 } from 'babylonjs';
import { IContext } from '../IContext';

export class StarSystem {
  public static create(context: IContext): void {
    if (!context) throw Error(`The context is null.`);

    const fieldSize = 999;
    const starSystem = MeshBuilder.CreateSphere(
      'StarSystem',
      {
        diameter: 1,
        updatable: false,
      },
      context.scene
    );
    starSystem.isVisible = false;

    for (let i = 0; i < fieldSize; i++) {
      const name = `${i.toString().padStart(4, '0')}`;
      // const position = new Vector3(0, 0, 50);
      const fieldDiamater = 6000;
      const position = new Vector3(
        Scalar.Denormalize(Math.random(), -fieldDiamater, fieldDiamater),
        Scalar.Denormalize(Math.random(), -fieldDiamater, fieldDiamater),
        Scalar.Denormalize(Math.random(), -fieldDiamater, fieldDiamater)
      );

      const sphereSize = Scalar.Denormalize(Math.random(), 1, 10);
      // const sphereSize = 10;
      const sphere = MeshBuilder.CreateSphere(
        `Planet_${name}`,
        {
          diameter: sphereSize,
          updatable: false,
        },
        context.scene
      );
      sphere.isVisible = true;
      sphere.parent = starSystem;
      sphere.position = position;

      // Put the sphere below the light at least 1.3* the size of the sphere.
      // this means there is .3 unit distance from center of sphere to center
      // of the light.
      // sphere.position
      //   .copyFrom(position)
      //   .subtract(Vector3.Down().scale(sphereSize * 2.3));

      // const light = new PointLight(`Sun_${name}`, position, context.scene);
      // light.diffuse = new Color3(Math.random(), Math.random(), Math.random());
      // light.specular = new Color3(Math.random(), Math.random(), Math.random());
      // light.parent = starSystem;
    }
  }
}
