import { Vector2 } from 'babylonjs';

export class DomUtils {
  public static getMousePosition(ev: MouseEvent, rect: DOMRect): Vector2 {
    return new Vector2(ev.clientX - rect.left, ev.clientY - rect.top);
  }

  public static cleanUrl(url: string): string {
    const pathArray = url.split('/');
    const protocol = pathArray[0];
    const host = pathArray
      .splice(1)
      .filter((e) => e.length > 0)
      .join('/');
    const clean = protocol + '//' + host;
    return clean;
  }
}
