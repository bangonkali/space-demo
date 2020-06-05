import { IMoveable } from '../IMoveableMesh';
import { Vector3, AbstractMesh, Scene } from 'babylonjs';
import { EngineMesh } from './EngineMesh';

/**
 * Some notes.
 *
 * Forward/Backward => Button W/S => Z Axis
 * Left/Right => Button Q/E => X Axis
 * Up/Down => Button R/F => y Axis
 *
 * @proprety {number} mass In metric tonnes.
 */
export class MoveableMesh implements IMoveable {
  public basePath: string;
  public mesh: AbstractMesh;

  public mass = 9.207;
  public velocity: Vector3 = Vector3.Zero();
  public maxVelocity: Vector3 = new Vector3(120, 90, 230);
  public maxReverseVelocity = 90;

  public acceleration: Vector3 = Vector3.Zero();
  public maxAcceleration: Vector3 = new Vector3(2, 3, 2);
  public maxReverseAcceleration = 1;

  public jerk: Vector3 = new Vector3(1.5, 1, 3);

  /* Angle in radians = Angle in degrees x PI / 180. */
  public angularJerk: Vector3 = new Vector3(
    ((45 / 4) * Math.PI) / 180,
    ((45 / 4) * Math.PI) / 180,
    ((45 / 4) * Math.PI) / 180
  );
  public angularVelocity: Vector3 = Vector3.Zero();
  public angularAcceleration: Vector3 = Vector3.Zero();
  public maxAngularAcceleration: Vector3 = new Vector3(
    ((45 / 2) * Math.PI) / 180,
    ((45 / 2) * Math.PI) / 180,
    ((45 / 2) * Math.PI) / 180
  );

  public leftEngine: EngineMesh;
  public rightEngine: EngineMesh;

  public rightThrusterEngine: EngineMesh;
  public leftThrusterEngine: EngineMesh;

  public leftReverseThrustEngine: EngineMesh;
  public rightReverseThrustEngine: EngineMesh;

  public frontUpwardThruster: EngineMesh;
  public frontDownwardThruster: EngineMesh;
  public frontRightwardThruster: EngineMesh;
  public frontLeftwardThruster: EngineMesh;
  public leftDownwardThruster: EngineMesh;
  public leftUpwardThruster: EngineMesh;
  public rightDownwardThruster: EngineMesh;
  public rightUpwardThruster: EngineMesh;

  constructor(mesh: AbstractMesh, basePath: string, scene: Scene) {
    this.mesh = mesh;
    this.basePath = basePath;

    this.mesh
      .getChildren()
      .forEach((e) => console.log(`name: ${e.name} : ${e.uniqueId}`));

    // initialize all particle systems
    this.leftEngine = new EngineMesh('LeftEngine', this, scene);
    this.rightEngine = new EngineMesh('RightEngine', this, scene);

    this.rightThrusterEngine = new EngineMesh(
      'RightThrusterEngine',
      this,
      scene
    );
    this.leftThrusterEngine = new EngineMesh('LeftThrusterEngine', this, scene);

    this.leftReverseThrustEngine = new EngineMesh(
      'LeftReverseThrustEngine',
      this,
      scene
    );
    this.rightReverseThrustEngine = new EngineMesh(
      'RightReverseThrustEngine',
      this,
      scene
    );

    this.frontUpwardThruster = new EngineMesh(
      'FrontUpwardThruster',
      this,
      scene
    );
    this.frontDownwardThruster = new EngineMesh(
      'FrontDownwardThruster',
      this,
      scene
    );
    this.frontRightwardThruster = new EngineMesh(
      'FrontRightwardThruster',
      this,
      scene
    );
    this.frontLeftwardThruster = new EngineMesh(
      'FrontLeftwardThruster',
      this,
      scene
    );
    this.leftDownwardThruster = new EngineMesh(
      'LeftDownwardThruster',
      this,
      scene
    );
    this.leftUpwardThruster = new EngineMesh('LeftUpwardThruster', this, scene);
    this.rightDownwardThruster = new EngineMesh(
      'RightDownwardThruster',
      this,
      scene
    );
    this.rightUpwardThruster = new EngineMesh(
      'RightUpwardThruster',
      this,
      scene
    );
  }

  private reversing = false;
  private forwarding = false;

  private leftwarding = false;
  private rightwarding = false;

  private downwarding = false;
  private upwarding = false;

  private rollingLeft = false;
  private rollingRight = false;

  private pitchingDown = false;
  private pitchingUp = false;

  private yawingLeft = false;
  private yawingRight = false;

  public rollRight(): void {
    if (this.rollingRight) return;

    this.leftDownwardThruster.wake.start();
    this.rightUpwardThruster.wake.start();
    this.rollingRight = true;
  }

  public stoppedRollingright(): void {
    if (!this.rollingRight) return;

    this.leftDownwardThruster.wake.stop();
    this.rightUpwardThruster.wake.stop();
    this.rollingRight = false;
  }

  public rollLeft(): void {
    if (this.rollingLeft) return;

    this.rightDownwardThruster.wake.start();
    this.leftUpwardThruster.wake.start();
    this.rollingLeft = true;
  }

  public stoppedRollingleft(): void {
    if (!this.rollingLeft) return;

    this.rightDownwardThruster.wake.stop();
    this.leftUpwardThruster.wake.stop();
    this.rollingLeft = false;
  }

  public pitchDown(): void {
    if (this.pitchingDown) return;

    this.frontDownwardThruster.wake.start();
    this.leftUpwardThruster.wake.start();
    this.rightUpwardThruster.wake.start();
    this.pitchingDown = true;
  }

  public stoppedPitchingDown(): void {
    if (!this.pitchingDown) return;

    this.frontDownwardThruster.wake.stop();
    this.leftUpwardThruster.wake.stop();
    this.rightUpwardThruster.wake.stop();
    this.pitchingDown = false;
  }

  public pitchUp(): void {
    if (this.pitchingUp) return;

    this.frontUpwardThruster.wake.start();
    this.leftDownwardThruster.wake.start();
    this.rightDownwardThruster.wake.start();
    this.pitchingUp = true;
  }

  public stoppedPitchingUp(): void {
    if (!this.pitchingUp) return;

    this.frontUpwardThruster.wake.stop();
    this.leftDownwardThruster.wake.stop();
    this.rightDownwardThruster.wake.stop();
    this.pitchingUp = false;
  }

  public yawRight(): void {
    if (this.yawingRight) return;

    this.leftThrusterEngine.wake.start();
    this.frontRightwardThruster.wake.start();
    this.yawingRight = true;
  }

  public stoppedYawingRight(): void {
    if (!this.yawingRight) return;

    this.leftThrusterEngine.wake.stop();
    this.frontRightwardThruster.wake.stop();
    this.yawingRight = false;
  }

  public yawLeft(): void {
    if (this.yawingLeft) return;

    this.rightThrusterEngine.wake.start();
    this.frontLeftwardThruster.wake.start();
    this.yawingLeft = true;
  }

  public stoppedYawingLeft(): void {
    if (!this.yawingLeft) return;

    this.rightThrusterEngine.wake.stop();
    this.frontLeftwardThruster.wake.stop();
    this.yawingLeft = false;
  }

  public upwardThrust(): void {
    if (this.upwarding) return;

    this.frontUpwardThruster.wake.start();
    this.leftUpwardThruster.wake.start();
    this.rightUpwardThruster.wake.start();
    this.upwarding = true;
  }

  public stoppedUpwardThrust(): void {
    if (!this.upwarding) return;

    this.frontUpwardThruster.wake.stop();
    this.leftUpwardThruster.wake.stop();
    this.rightUpwardThruster.wake.stop();
    this.upwarding = false;
  }

  public downwardThrust(): void {
    if (this.downwarding) return;

    this.frontDownwardThruster.wake.start();
    this.leftDownwardThruster.wake.start();
    this.rightDownwardThruster.wake.start();
    this.downwarding = true;
  }

  public stoppedDownwardThrust(): void {
    if (!this.downwarding) return;

    this.frontDownwardThruster.wake.stop();
    this.leftDownwardThruster.wake.stop();
    this.rightDownwardThruster.wake.stop();
    this.downwarding = false;
  }

  public rightwardThrust(): void {
    if (this.rightwarding) return;

    this.rightThrusterEngine.wake.start();
    this.rightwarding = true;
  }

  public stoppedRightwardThrust(): void {
    if (!this.rightwarding) return;

    this.rightThrusterEngine.wake.stop();
    this.rightwarding = false;
  }

  public leftwardThrust(): void {
    if (this.leftwarding) return;

    this.leftThrusterEngine.wake.start();
    this.leftwarding = true;
  }

  public stoppedLeftwardThrust(): void {
    if (!this.leftwarding) return;

    this.leftThrusterEngine.wake.stop();
    this.leftwarding = false;
  }

  public forwardThrust(): void {
    if (this.forwarding) return;

    this.leftEngine.wake.start();
    this.rightEngine.wake.start();
    this.forwarding = true;
  }

  public stoppedForwardThrust(): void {
    if (!this.forwarding) return;

    this.leftEngine.wake.stop();
    this.rightEngine.wake.stop();
    this.forwarding = false;
  }

  public reverseThrust(): void {
    if (this.reversing) return;

    this.leftReverseThrustEngine.wake.start();
    this.rightReverseThrustEngine.wake.start();
    this.reversing = true;
  }

  public stoppedReverseThrust(): void {
    if (!this.reversing) return;

    this.leftReverseThrustEngine.wake.stop();
    this.rightReverseThrustEngine.wake.stop();
    this.reversing = false;
  }
}
