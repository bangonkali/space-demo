import * as React from 'react';

export interface OverlayProps {
  compiler: string;
  framework: string;
}

// 'OverlayProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class Overlay extends React.Component<OverlayProps, {}> {
  clicked(event: React.TouchEvent<HTMLButtonElement>): void {
    console.log(`Clicked button ${event.currentTarget.name}`);
  }

  render() {
    return (
      <div className="noselect flex-container">
        <div className="top-header">
          <div>Overlay from {this.props.compiler}</div>
          <button name="ButtonTop" onTouchEndCapture={this.clicked}>
            Button Top
          </button>
        </div>
        <div className="bottom-footer">
          <div>Prop framework {this.props.framework}</div>
          <button name="ButtonBottom" onTouchEndCapture={this.clicked}>
            Button Bottom
          </button>
        </div>
      </div>
    );
  }
}
