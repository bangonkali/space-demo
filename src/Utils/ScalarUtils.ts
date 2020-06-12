import { Vector2 } from 'babylonjs';

export class ScalarUtils {
  public static readonly RadRev = 6.283185307179586;
  public static readonly RadUnit = 0.017453292519943295;

  public static DeteriorateVector(
    input: Vector2,
    floor: number,
    rate: number,
    dT: number
  ): Vector2 {
    return new Vector2(
      ScalarUtils.Deteriorate(input.x, floor, rate, dT),
      ScalarUtils.Deteriorate(input.y, floor, rate, dT)
    );
  }

  public static GetRandomSign(): number {
    return Math.floor(Math.random() * 2) === 1 ? 1 : -1;
  }

  public static Deteriorate(
    input: number,
    floor: number,
    rate: number,
    dT: number
  ): number {
    if (Math.abs(input) < floor) return 0;

    return input - input * rate * dT;
  }

  public static ClipRadians(inputRad: number): number {
    if (ScalarUtils.RadRev < Math.abs(inputRad)) {
      if (inputRad < 0) {
        return -ScalarUtils.RadRev % Math.abs(inputRad);
      } else {
        return ScalarUtils.RadRev % Math.abs(inputRad);
      }
    } else {
      return inputRad;
    }
  }
}
