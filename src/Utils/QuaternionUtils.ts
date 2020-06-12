import { Quaternion, Scalar } from 'babylonjs';
import { ScalarUtils } from './ScalarUtils';

export class QuaternionUtils {
  public static GetRandom(): Quaternion {
    return new Quaternion(
      Scalar.Denormalize(Math.random(), 0, ScalarUtils.RadRev),
      Scalar.Denormalize(Math.random(), 0, ScalarUtils.RadRev),
      Scalar.Denormalize(Math.random(), 0, ScalarUtils.RadRev),
      Scalar.Denormalize(Math.random(), 0, ScalarUtils.RadRev)
    );
  }
}
