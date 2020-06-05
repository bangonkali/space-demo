import { Vector3, Scalar } from 'babylonjs';
import { MoveableMesh } from '../Models/Ships/MoveableMesh';

export class MovementSystem {
  /**
   * This happens when there is user input to accelerate a particular set of Moveables.
   * Add 0.2 to acceleration every 1 second. This is similar to slowly pressing in your
   * foot in the car's accelerator.
   */
  public static accelerate(moveableMesh: MoveableMesh, dT: number): void {
    moveableMesh.acceleration.x += Scalar.Clamp(
      0.2 * (dT / 1000),
      -moveableMesh.maxReverseAcceleration,
      moveableMesh.maxAcceleration.x
    );
    moveableMesh.acceleration.y += Scalar.Clamp(
      0.2 * (dT / 1000),
      -moveableMesh.maxAcceleration.y,
      moveableMesh.maxAcceleration.y
    );
    moveableMesh.acceleration.z += Scalar.Clamp(
      0.2 * (dT / 1000),
      -moveableMesh.maxAcceleration.z,
      moveableMesh.maxAcceleration.z
    );
  }

  /**
   * Subtract 1 to acceleration every 1 second. This is similar to slowly
   * removing your foot from the car's accelerator.
   */
  public static accelerationDamper(
    moveableMesh: MoveableMesh,
    dT: number
  ): void {
    if (moveableMesh.velocity.x !== 0 && moveableMesh.acceleration.x > 0) {
      moveableMesh.acceleration.x -= 1 * (dT / 1000);
    }
    if (moveableMesh.velocity.y !== 0 && moveableMesh.acceleration.y > 0) {
      moveableMesh.acceleration.y -= 1 * (dT / 1000);
    }
    if (moveableMesh.velocity.z !== 0 && moveableMesh.acceleration.z > 0) {
      moveableMesh.acceleration.z -= 1 * (dT / 1000);
    }
  }

  /**
   * This executes per tick. And moves all Moveables.
   */
  public static move(moveableMesh: MoveableMesh, dT: number): void {
    // Get the new velocity values
    moveableMesh.velocity.x = Scalar.Clamp(
      dT * moveableMesh.acceleration.x,
      -moveableMesh.maxReverseVelocity,
      moveableMesh.maxVelocity.x
    );
    moveableMesh.velocity.y = Scalar.Clamp(
      dT * moveableMesh.acceleration.y,
      -moveableMesh.maxVelocity.y,
      moveableMesh.maxVelocity.y
    );
    moveableMesh.velocity.z = Scalar.Clamp(
      dT * moveableMesh.acceleration.z,
      -moveableMesh.maxVelocity.z,
      moveableMesh.maxVelocity.z
    );
  }
}
