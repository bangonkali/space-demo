import { Vector3, Scalar } from 'babylonjs';
import { ScalarUtils } from './ScalarUtils';

export class VectorUtils {
  public static format(vec: Vector3): string {
    return `{${vec.x.toFixed(2)}, ${vec.y.toFixed(2)}, ${vec.z.toFixed(2)}}`;
  }

  public static GetRandomUnit(): Vector3 {
    return new Vector3(Math.random(), Math.random(), Math.random());
  }

  public static GetRandom(minRadius: number, maxRadius: number): Vector3 {
    const fx = ScalarUtils.GetRandomSign(); // gets random number 1 or -1
    const fy = ScalarUtils.GetRandomSign(); // gets random number 1 or -1
    const fz = ScalarUtils.GetRandomSign(); // gets random number 1 or -1

    const x = Scalar.Denormalize(Math.random(), minRadius, maxRadius);
    const y = Scalar.Denormalize(Math.random(), minRadius, maxRadius);
    const z = Scalar.Denormalize(Math.random(), minRadius, maxRadius);

    return new Vector3(fx * x, fy * y, fz * z);
  }
}
