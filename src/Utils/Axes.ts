import {
  Scene,
  DynamicTexture,
  Mesh,
  StandardMaterial,
  Color3,
  Vector3,
  MeshBuilder,
} from 'babylonjs';

export class Axes {
  private static makeTextPlane(
    text: string,
    color: string,
    size: number,
    scene: Scene
  ): Mesh {
    const dynamicTexture = new DynamicTexture(
      'DynamicTexture',
      50,
      scene,
      true
    );
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(
      text,
      5,
      40,
      'bold 36px Arial',
      color,
      'transparent',
      true
    );

    const material = new StandardMaterial('TextPlaneMaterial', scene);
    material.specularColor = new Color3(0, 0, 0);
    material.diffuseTexture = dynamicTexture;

    const plane = Mesh.CreatePlane('TextPlane', size, scene, true);
    plane.material = material;
    plane.material.backFaceCulling = false;
    return plane;
  }

  public static getLocal(size: number, scene: Scene): Mesh {
    const axisX = Mesh.CreateLines(
      'axisX',
      [
        Vector3.Zero(),
        new Vector3(size, 0, 0),
        new Vector3(size * 0.95, 0.05 * size, 0),
        new Vector3(size, 0, 0),
        new Vector3(size * 0.95, -0.05 * size, 0),
      ],
      scene
    );
    axisX.color = new Color3(1, 0, 0);
    const xChar = Axes.makeTextPlane('X', 'red', size / 10, scene);
    xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);
    const axisY = Mesh.CreateLines(
      'axisY',
      [
        Vector3.Zero(),
        new Vector3(0, size, 0),
        new Vector3(-0.05 * size, size * 0.95, 0),
        new Vector3(0, size, 0),
        new Vector3(0.05 * size, size * 0.95, 0),
      ],
      scene
    );
    axisY.color = new Color3(0, 1, 0);
    const yChar = Axes.makeTextPlane('Y', 'green', size / 10, scene);
    yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
    const axisZ = Mesh.CreateLines(
      'axisZ',
      [
        Vector3.Zero(),
        new Vector3(0, 0, size),
        new Vector3(0, -0.05 * size, size * 0.95),
        new Vector3(0, 0, size),
        new Vector3(0, 0.05 * size, size * 0.95),
      ],
      scene
    );
    axisZ.color = new Color3(0, 0, 1);
    const zChar = Axes.makeTextPlane('Z', 'blue', size / 10, scene);
    zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);

    const localOrigin = MeshBuilder.CreateBox(
      'local_origin',
      { size: 1 },
      scene
    );
    localOrigin.isVisible = false;

    axisX.parent = localOrigin;
    axisY.parent = localOrigin;
    axisZ.parent = localOrigin;

    xChar.parent = localOrigin;
    yChar.parent = localOrigin;
    zChar.parent = localOrigin;

    return localOrigin;
  }
}
