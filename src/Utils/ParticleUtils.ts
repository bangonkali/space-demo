import {
  ParticleSystem,
  Texture,
  Vector3,
  Color4,
  AbstractMesh,
  Scene,
} from 'babylonjs';

export class ParticleUtils {
  public static createAndAttachParticleSystem(
    mesh: AbstractMesh,
    basePath: string,
    scene: Scene
  ): ParticleSystem {
    // setup actor particle system
    const particleSystem = new ParticleSystem(
      `PS_${mesh.name}_${mesh.uniqueId}`,
      2000,
      scene
    );
    particleSystem.particleTexture = new Texture(
      `${basePath}/assets/textures/flare.png`,
      scene
    );

    particleSystem.emitter = mesh; // the starting object, the emitter
    particleSystem.minEmitBox = new Vector3(-1, 0, 0); // Starting all from
    particleSystem.maxEmitBox = new Vector3(1, 0, 0); // To...
    particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.5;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;

    // Emission rate
    particleSystem.emitRate = 800;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new Vector3(0, 0, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new Vector3(3, -8, -4);
    particleSystem.direction2 = new Vector3(-3, -8, 4);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = 50;
    particleSystem.maxEmitPower = 150;
    particleSystem.updateSpeed = 0.002;

    return particleSystem;
  }
}
