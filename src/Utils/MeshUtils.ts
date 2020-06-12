import { AbstractMesh, SceneLoader, SceneLoaderProgressEvent } from 'babylonjs';
import { IMeshDescriptor } from '../Models/IMeshDescriptor';
import { DomUtils } from './DomUtils';
import { IContext } from '../Models/IContext';

export class MeshUtils {
  public static async loadModel(
    names: string[],
    file: string,
    context: IContext
  ): Promise<AbstractMesh[]> {
    return new Promise((resolve, error) => {
      if (!context) {
        error(Error(`The context is null.`));
        return;
      }
      const basePath = `${context.basePath}/assets/models`;
      const cleanPath = `${DomUtils.cleanUrl(basePath)}/`;
      console.log(`Downloading ${cleanPath}${file}`);
      SceneLoader.ImportMesh(
        names,
        cleanPath,
        file,
        context.scene,
        (c: AbstractMesh[]) => {
          names.forEach((e) => {
            console.log(`Loaded '${cleanPath}${file}:${e}'. Components:`);
          });
          resolve(c);
        },
        (e: SceneLoaderProgressEvent) => {
          console.log(`Loading progress ${e.loaded}\\${e.total}`);
        },
        (message, exception) => {
          console.error(`Error ${message}`);
          error(exception);
        }
      );
    });
  }

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
