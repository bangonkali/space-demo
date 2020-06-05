import { IContext } from '../IContext';
import { DebugLayer } from 'babylonjs';

export class Debug {
  private context: IContext;
  private debugModeOn = false;
  private lastDebugOpenedTimestamp = 0;

  constructor(context: IContext) {
    this.context = context;
  }

  toggle(delta: number): void {
    const date = new Date();

    if (date.getTime() - this.lastDebugOpenedTimestamp < 3_000) return;

    this.lastDebugOpenedTimestamp = date.getTime();
    if (!this.debugModeOn) {
      console.log('Opening Debug Window');
      this.context.scene.debugLayer
        .show({
          overlay: false,
        })
        .then((debugLayer: DebugLayer): void => {
          console.log('Opened Debug Window');
          this.debugModeOn = true;
        });
    } else {
      console.log('Hiding Debug Window');
      // this.context.scene.debugLayer.hide();
      this.debugModeOn = false;
    }
  }
}
