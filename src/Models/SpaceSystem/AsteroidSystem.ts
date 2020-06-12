import {
  MeshBuilder,
  Scalar,
  Vector3,
  Mesh,
  Quaternion,
  Space,
} from 'babylonjs';
import { IContext } from '../IContext';
import { MeshUtils } from '../../Utils/MeshUtils';
import { QuaternionUtils } from '../../Utils/QuaternionUtils';
import { VectorUtils } from '../../Utils/VectorUtils';
import { ScalarUtils } from '../../Utils/ScalarUtils';

export class AsteroidSystem {
  public static async create(context: IContext): Promise<void> {
    if (!context) throw Error(`The context is null.`);

    // The furthest distance of an asteroid
    const fieldDiamater = 9999;

    // Total number of instances in the asteroid field
    const fieldSize = 2000;
    const asteroidMeshFile = `Asteroid_Small_6X.babylon`;
    const asteroidNodes = [
      'Aster_Small_1_',
      'Aster_Small_2_',
      'Aster_Small_3_',
      'Aster_Small_4_',
      'Aster_Small_5_',
      'Aster_Small_6_',
    ];
    const asteroidMeshes = await MeshUtils.loadModel(
      asteroidNodes,
      asteroidMeshFile,
      context
    );
    asteroidMeshes.forEach((asteroidMesh) => {
      asteroidMesh.position = new Vector3(0, 0, 10);
      asteroidMesh.isVisible = false;
    });

    const copies = Math.ceil(fieldSize / asteroidMeshes.length);

    for (let j = 0; j < asteroidMeshes.length; j++) {
      const rootInstance = asteroidMeshes[j] as Mesh;

      for (let i = 0; i < copies; i++) {
        const name = `${j}_${i.toString().padStart(4, '0')}`;
        const position = VectorUtils.GetRandom(1000, fieldDiamater);

        const scaleFactor = Scalar.Denormalize(Math.random(), 1, 150);
        const meshInstance = rootInstance.createInstance(`AST_${name}`);
        meshInstance.position = position;
        meshInstance.isVisible = true;
        meshInstance.scaling = new Vector3(
          scaleFactor,
          scaleFactor,
          scaleFactor
        );
        meshInstance.rotate(
          VectorUtils.GetRandom(0, 1),
          Math.random() * ScalarUtils.RadRev,
          Space.LOCAL
        );
      }
    }
    console.log(`Finished creating ${fieldSize} asteroids.`);
  }
}
