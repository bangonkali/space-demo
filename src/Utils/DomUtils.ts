import { Vector2 } from 'babylonjs';

export class DomUtils {
  public static getMousePosition(ev: MouseEvent, rect: DOMRect): Vector2 {
    return new Vector2(ev.clientX - rect.left, ev.clientY - rect.top);
  }
}
