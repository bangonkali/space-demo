import { ParticleSystem, AbstractMesh, Scene } from 'babylonjs';
import { ParticleUtils } from '../../Utils/ParticleUtils';
import { IMoveable } from '../IMoveableMesh';

export class EngineMesh {
  public wake: ParticleSystem;
  private mesh: AbstractMesh;
  private basePath: string;

  constructor(name: string, parent: IMoveable, scene: Scene) {
    const meshhUniqueId = parent.mesh
      .getChildren()
      .filter((e) => e.name === name)[0].uniqueId;
    const mesh = scene.getMeshByUniqueID(meshhUniqueId);
    if (!mesh) throw Error('Engine mesh does not exist.');

    this.mesh = mesh;
    this.basePath = parent.basePath;

    this.wake = ParticleUtils.createAndAttachParticleSystem(
      this.mesh,
      this.basePath,
      scene
    );
    this.mesh.isVisible = false;
  }
}
