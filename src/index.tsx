import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Overlay } from './Components/Overlay';

const domElement = document.getElementById('react');
const callback = () => console.log('Rendered react parts');
ReactDOM.render(
  <Overlay compiler="TypeScript" framework="React" />,
  domElement,
  callback
);
