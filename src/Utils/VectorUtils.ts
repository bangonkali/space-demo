import { Vector3 } from 'babylonjs';

export class VectorUtils {
  public static format(vec: Vector3): string {
    return `{${vec.x.toFixed(2)}, ${vec.y.toFixed(2)}, ${vec.z.toFixed(2)}}`;
  }
}
