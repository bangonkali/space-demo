## Build

### Improvement in Build Time

#### Development 

```
time npx webpack --config webpack.config.dev.js
real    0m7.280s
user    0m0.015s
sys     0m0.169s
```

#### Production 

```
time npx webpack --config webpack.config.prod.js
real    1m0.257s
user    0m0.046s
sys     0m0.076s
```

## Initial Setup

### Docker

If you are trying to run Nakama via Docker-Compose on Windows, you'll need to make a small change to the downloaded `docker-compose.yml` file. Follow this [instruction](https://heroiclabs.com/docs/install-docker-quickstart/#data) to bind the correct path.

If logging output does not immediately appear in stdout add tty: true to the nakama service in your `docker-compose.yml` file.

```bash
npm install --save babylonjs@preview babylonjs-gui@preview babylonjs-materials@preview
```

### Network Code

- Nengi - a nice game server. 👍
  - https://timetocode.com/nengi/authoritative-server

### Worker Threads Babylon

- https://doc.babylonjs.com/how_to/using_offscreen_canvas
  - https://caniuse.com/#feat=offscreencanvas

### Input Handling

- https://forum.babylonjs.com/t/animated-character-movement-with-w-a-s-d/715/2
- https://playground.babylonjs.com/#15EY4F#0
- https://doc.babylonjs.com/how_to/gui

### Camera Modes

- Follow a tareget
  - https://www.babylonjs-playground.com/#MWYX7P#2
- https://doc.babylonjs.com/how_to/customizing_camera_inputs
  ```js
  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
  ```
- Multiple Viewports
  - https://www.babylonjs-playground.com/pg/E9IRIF

### Game Mechanics

#### Flight Controls

- https://howthingsfly.si.edu/flight-dynamics/roll-pitch-and-yaw

### Reference

- Babylon JS How Tos: https://doc.babylonjs.com/how_to/
- Examples https://doc.babylonjs.com/examples/

#### Camera Management

- https://doc.babylonjs.com/babylon101/cameras#constructing-a-follow-camera

#### Adding Custom Mesh to Scene

- https://doc.babylonjs.com/how_to/how_to_use_assetsmanager
- https://doc.babylonjs.com/resources/blender#installation

#### Animdation References

- Keyboard Input Walking https://www.babylonjs-playground.com/#15EY4F#15

#### Models

- https://www.turbosquid.com/AssetManager/Index.cfm?stgAction=getFiles&subAction=Download&intID=1216479&intType=3
- https://www.turbosquid.com/3d-model/free/low-poly/spacecraft?synonym=spaceship
-
