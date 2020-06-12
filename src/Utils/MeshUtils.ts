import { AbstractMesh } from 'babylonjs';
import { IMeshDescriptor } from '../Models/IMeshDescriptor';

export class MeshUtils {
  public static getMeshDescriptor(mesh: AbstractMesh): IMeshDescriptor {
    if (mesh.getChildMeshes() && mesh.getChildMeshes().length > 0) {
      const childMeshes = mesh.getChildMeshes().map((m) => {
        return MeshUtils.getMeshDescriptor(m);
      });

      return {
        name: mesh.name,
        id: mesh.id,
        children: childMeshes,
      };
    }

    return {
      name: mesh.name,
      id: mesh.id,
    };
  }
}
