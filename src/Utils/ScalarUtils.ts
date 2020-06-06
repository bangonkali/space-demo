export class ScalarUtils {
  public static readonly RadRev = 6.283185307179586;
  public static readonly RadUnit = 0.017453292519943295;

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
