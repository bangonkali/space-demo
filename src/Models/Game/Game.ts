import { GameMode } from './GameMode';
import {
  UniversalCamera,
  Vector2,
  Vector3,
  Scalar,
  Axis,
  Space,
  ExecuteCodeAction,
  ActionManager,
  ActionEvent,
} from 'babylonjs';
import { MoveableMesh } from '../Ships/MoveableMesh';
import { IContext } from '../IContext';
// import { CenterHud } from '../Hud/CenterHud';
import { Debug } from '../Debug/Debug';
import { DomUtils } from '../../Utils/DomUtils';
import { KeyValuePair } from '../KeyValuePair';
import { IInputEvent } from '../Events/IInputEvent';
import { KeyState } from '../Events/KeyState';

export class Game {
  public context: IContext;

  // public hud: CenterHud;
  public universalCamera: UniversalCamera;

  public actor: MoveableMesh;
  public mode: GameMode = GameMode.CockpitTargetting;
  public inputMap: KeyValuePair<boolean> = {};
  public mousePosition: Vector2 = Vector2.Zero();
  public debug: Debug;

  public delta = 0;

  constructor(context: IContext, actor: MoveableMesh) {
    this.context = context;
    this.actor = actor;
    this.debug = new Debug(this.context);
    this.universalCamera = new UniversalCamera(
      'UniversalCamera',
      new Vector3(0, 0, -20),
      this.context.scene
    );
    this.universalCamera.parent = actor.mesh;
    // this.camera.attachControl(this.context.canvas, true);
    // this.hud = new CenterHud();
  }

  public init(): void {
    console.log(`Initializing Before Render Observable`);
    this.context.scene.onBeforeRenderObservable.add(() => {
      this.udpate();
    });

    console.log(`Initializing Render Loop`);
    this.context.engine.runRenderLoop(() => {
      this.context.scene.render();
    });
  }

  /**
   * This is typically bound to the containers resize function.
   * ```ts
   * window.addEventListener("resize", game.resize);
   * ```
   */
  public resize(): void {
    console.log(`resize() called`);
    this.context.engine.resize();
  }

  public inputEvent(event: IInputEvent): void {
    if (event.mousePosition) this.mousePosition = event.mousePosition;

    if (event.key)
      this.inputMap[event.key] = event.keyState === KeyState.KeyDown;
  }

  public udpate(): void {
    if (this.inputMap === undefined) return;
    if (this.mousePosition === undefined) return;

    this.delta = this.context.scene.getEngine().getDeltaTime();
    const dT = this.delta / 1000;

    /* #region  Translations */
    if (this.inputMap['x']) {
      this.inputMap['x'] = false;
      this.actor.acceleration = Vector3.Zero();
      this.actor.velocity = Vector3.Zero();
      this.actor.angularVelocity = Vector3.Zero();
    }

    if (this.inputMap['r']) {
      // this.inputMap["r"] = false;
      this.actor.acceleration.y = Scalar.Clamp(
        this.actor.acceleration.y + this.actor.jerk.y * dT,
        -this.actor.maxAcceleration.y,
        this.actor.maxAcceleration.y
      );
      this.actor.upwardThrust();
    } else if (this.inputMap['f']) {
      // this.inputMap["f"] = false;
      this.actor.acceleration.y = Scalar.Clamp(
        this.actor.acceleration.y + -this.actor.jerk.y * dT,
        -this.actor.maxAcceleration.y,
        this.actor.maxAcceleration.y
      );
      this.actor.downwardThrust();
    } else {
      this.actor.stoppedDownwardThrust();
      this.actor.stoppedUpwardThrust();
      if (this.actor.velocity.y !== 0) {
        if (this.actor.acceleration.y > 0.5) {
          this.actor.acceleration.y -= 0.75 * this.actor.acceleration.y * dT;
        } else if (this.actor.acceleration.y < -0.5) {
          this.actor.acceleration.y -= 0.75 * this.actor.acceleration.y * dT;
        } else {
          this.actor.acceleration.y = 0;
        }
      }
    }

    // Process the forwards and backwards. Only 1 can be true at any moment, otherwise,
    // process the change in acceleration at the Z axis.
    if (this.inputMap['w']) {
      // this.inputMap["w"] = false;
      this.actor.acceleration.z = Scalar.Clamp(
        this.actor.acceleration.z + this.actor.jerk.z * dT,
        -this.actor.maxAcceleration.z,
        this.actor.maxAcceleration.z
      );
      this.actor.forwardThrust();
    } else if (this.inputMap['s']) {
      // this.inputMap["s"] = false;
      this.actor.acceleration.z = Scalar.Clamp(
        this.actor.acceleration.z + -this.actor.jerk.z * dT,
        -this.actor.maxReverseAcceleration,
        this.actor.maxAcceleration.z
      );
      this.actor.reverseThrust();
    } else {
      this.actor.stoppedReverseThrust();
      this.actor.stoppedForwardThrust();
      if (this.actor.velocity.z !== 0) {
        if (this.actor.acceleration.z > 0.5) {
          this.actor.acceleration.z -= 0.75 * this.actor.acceleration.z * dT;
        } else if (this.actor.acceleration.z < -0.5) {
          this.actor.acceleration.z -= 0.75 * this.actor.acceleration.z * dT;
        } else {
          this.actor.acceleration.z = 0;
        }
      }
    }

    // Process the left & right thrusters. Only 1 can be true at any moment, otherwise,
    // process the change in acceleration at the left/right or x axis.
    if (this.inputMap['q']) {
      // this.inputMap["q"] = false;
      this.actor.leftwardThrust();
      this.actor.acceleration.x = Scalar.Clamp(
        this.actor.acceleration.x + -this.actor.jerk.x * dT,
        -this.actor.maxAcceleration.x,
        this.actor.maxAcceleration.x
      );
    } else if (this.inputMap['e']) {
      // this.inputMap["e"] = false;
      this.actor.rightwardThrust();
      this.actor.acceleration.x = Scalar.Clamp(
        this.actor.acceleration.x + this.actor.jerk.x * dT,
        -this.actor.maxAcceleration.x,
        this.actor.maxAcceleration.x
      );
    } else {
      this.actor.stoppedLeftwardThrust();
      this.actor.stoppedRightwardThrust();
      if (this.actor.velocity.x !== 0 && this.actor.acceleration.x > 0) {
        this.actor.acceleration.x -= 0.75 * this.actor.acceleration.x * dT;
      } else if (this.actor.velocity.x !== 0 && this.actor.acceleration.x < 0) {
        this.actor.acceleration.x -= 0.75 * this.actor.acceleration.x * dT;
      } else {
        this.actor.acceleration.x = 0;
      }
    }

    this.actor.velocity.x = Scalar.Clamp(
      this.actor.velocity.x + dT * this.actor.acceleration.x,
      -this.actor.maxReverseVelocity,
      this.actor.maxVelocity.x
    );
    this.actor.velocity.y = Scalar.Clamp(
      this.actor.velocity.y + dT * this.actor.acceleration.y,
      -this.actor.maxVelocity.y,
      this.actor.maxVelocity.y
    );
    this.actor.velocity.z = Scalar.Clamp(
      this.actor.velocity.z + dT * this.actor.acceleration.z,
      -this.actor.maxVelocity.z,
      this.actor.maxVelocity.z
    );

    if (this.inputMap['ArrowLeft']) {
      this.actor.angularAcceleration.z = Scalar.Clamp(
        this.actor.angularAcceleration.z + this.actor.angularJerk.z * dT,
        -this.actor.maxAngularAcceleration.z,
        this.actor.maxAngularAcceleration.z
      );
      this.actor.rollRight();
    } else if (this.inputMap['ArrowRight']) {
      this.actor.angularAcceleration.z = Scalar.Clamp(
        this.actor.angularAcceleration.z + -this.actor.angularJerk.z * dT,
        -this.actor.maxAngularAcceleration.z,
        this.actor.maxAngularAcceleration.z
      );
      this.actor.rollLeft();
    } else {
      this.actor.stoppedRollingleft();
      this.actor.stoppedRollingright();
      if (this.actor.angularVelocity.z !== 0) {
        if (this.actor.angularAcceleration.z > 0.5) {
          this.actor.angularAcceleration.z -=
            0.75 * this.actor.angularAcceleration.z * dT;
        } else if (this.actor.angularAcceleration.z < -0.5) {
          this.actor.angularAcceleration.z -=
            0.75 * this.actor.angularAcceleration.z * dT;
        } else {
          this.actor.angularAcceleration.z = 0;
        }
      }
    }

    if (this.inputMap['ArrowUp']) {
      this.actor.angularAcceleration.x = Scalar.Clamp(
        this.actor.angularAcceleration.x + this.actor.angularJerk.x * dT,
        -this.actor.maxAngularAcceleration.x,
        this.actor.maxAngularAcceleration.x
      );
      this.actor.pitchDown();
    } else if (this.inputMap['ArrowDown']) {
      this.actor.angularAcceleration.x = Scalar.Clamp(
        this.actor.angularAcceleration.x + -this.actor.angularJerk.x * dT,
        -this.actor.maxAngularAcceleration.x,
        this.actor.maxAngularAcceleration.x
      );
      this.actor.pitchUp();
    } else {
      this.actor.stoppedPitchingDown();
      this.actor.stoppedPitchingUp();
      if (this.actor.angularVelocity.x !== 0) {
        if (this.actor.angularAcceleration.x > 0.5) {
          this.actor.angularAcceleration.x -=
            0.75 * this.actor.angularAcceleration.x * dT;
        } else if (this.actor.angularAcceleration.x < -0.5) {
          this.actor.angularAcceleration.x -=
            0.75 * this.actor.angularAcceleration.x * dT;
        } else {
          this.actor.angularAcceleration.x = 0;
        }
      }
    }

    if (this.inputMap['d']) {
      this.actor.angularAcceleration.y = Scalar.Clamp(
        this.actor.angularAcceleration.y + this.actor.angularJerk.y * dT,
        -this.actor.maxAngularAcceleration.y,
        this.actor.maxAngularAcceleration.y
      );
      this.actor.yawRight();
    } else if (this.inputMap['a']) {
      this.actor.angularAcceleration.y = Scalar.Clamp(
        this.actor.angularAcceleration.y + -this.actor.angularJerk.y * dT,
        -this.actor.maxAngularAcceleration.y,
        this.actor.maxAngularAcceleration.y
      );
      this.actor.yawLeft();
    } else {
      this.actor.stoppedYawingLeft();
      this.actor.stoppedYawingRight();
      if (this.actor.angularVelocity.y !== 0) {
        if (this.actor.angularAcceleration.y > 0.5) {
          this.actor.angularAcceleration.y -=
            0.75 * this.actor.angularAcceleration.y * dT;
        } else if (this.actor.angularAcceleration.y < -0.5) {
          this.actor.angularAcceleration.y -=
            0.75 * this.actor.angularAcceleration.y * dT;
        } else {
          this.actor.angularAcceleration.y = 0;
        }
      }
    }

    // accumulate angular velocity
    this.actor.angularVelocity.x += dT * this.actor.angularAcceleration.x;
    this.actor.angularVelocity.y += dT * this.actor.angularAcceleration.y;
    this.actor.angularVelocity.z += dT * this.actor.angularAcceleration.z;

    // apply accumulated velocity to mesh
    this.actor.mesh.rotate(
      Axis.X,
      this.actor.angularVelocity.x * dT,
      Space.LOCAL
    );
    this.actor.mesh.rotate(
      Axis.Y,
      this.actor.angularVelocity.y * dT,
      Space.LOCAL
    );
    this.actor.mesh.rotate(
      Axis.Z,
      this.actor.angularVelocity.z * dT,
      Space.LOCAL
    );

    if (this.inputMap['o']) {
      this.debug.toggle(this.delta);
      this.inputMap['o'] = false;
    }

    // apply new positions
    const localPosition = this.actor.mesh
      .getPositionExpressedInLocalSpace()
      .add(
        new Vector3(
          dT * this.actor.velocity.x,
          dT * this.actor.velocity.y,
          dT * this.actor.velocity.z
        )
      );
    this.actor.mesh.setPositionWithLocalVector(localPosition);
    // this.camera.rotation = this.actor.mesh.rotation;
    /* #endregion */

    // this.hud.update(() => {
    //   let a = `Debug Information\n`;
    //   a += `Mouse position: ${this.mousePosition.toString()}\n`;
    //   a += `Velocity: ${VectorUtils.format(this.actor.velocity)}\n`;
    //   a += `Acceleration: ${VectorUtils.format(this.actor.acceleration)}\n`;
    //   a += `Camera Target: ${VectorUtils.format(this.camera.getTarget())}\n`;
    //   a += `Camera Rotation: ${VectorUtils.format(this.camera.rotation)}\n`;
    //   a += `Vessel Abs Pos: ${VectorUtils.format(
    //     this.actor.mesh.getAbsolutePosition()
    //   )}\n`;
    //   a += `Vessel Loc Pos: ${VectorUtils.format(
    //     this.actor.mesh.getPositionExpressedInLocalSpace()
    //   )}\n`;
    //   a += `\n`;
    //   a += `Keys: ${VectorUtils.format(
    //     this.actor.mesh.getPositionExpressedInLocalSpace()
    //   )}\n`;
    //   KeyBindings.Default.forEach(
    //     (e, i) => (a += `${i}. '${e.key}': ${e.desc}\n`)
    //   );
    //   a += `\n`;
    //   a += `Work in Progress\n`;
    //   a += `1. Collisions\n`;
    //   a += `2. Inertia\n`;
    //   a += `3. Energy, Force, Mass, Angular Accel\n`;
    //   a += `4. Camera is a bit messed up. I need to study more about this.\n`;
    //   a += `\n`;
    //   a += `-https://github.com/bangonkali\n`;
    //   return a;
    // }, this.delta);
  }
}
