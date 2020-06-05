import { AdvancedDynamicTexture, TextBlock, Control } from 'babylonjs-gui';

export class CenterHud {
  public hudTexture: AdvancedDynamicTexture;
  public hudTextBlock: TextBlock;
  public refreshRate: number;

  constructor() {
    this.hudTexture = AdvancedDynamicTexture.CreateFullscreenUI('HUD');
    this.hudTextBlock = new TextBlock();
    this.refreshRate = 0;

    this.hudTextBlock.textHorizontalAlignment =
      Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.hudTextBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

    this.hudTextBlock.text = '';
    this.hudTextBlock.fontSize = 12;
    this.hudTextBlock.color = 'white';
    this.hudTexture.addControl(this.hudTextBlock);
  }

  public update(contentGenerator: () => string, delta: number) {
    this.refreshRate += delta;
    if (this.refreshRate < 200) return;
    this.hudTextBlock.text = contentGenerator();
    this.refreshRate = 0;
  }
}
