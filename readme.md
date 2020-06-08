# Waning

Is a small game environment I'm creating to study 3d graphics. 

Inspiration comes from Space based Fiction content/existing games such as [The Expanse](https://en.wikipedia.org/wiki/The_Expanse_(TV_series)), [Elite Dangerous](https://en.wikipedia.org/wiki/Elite_Dangerous), [Star Citizen](https://en.wikipedia.org/wiki/Star_Citizen), or [Home World](https://en.wikipedia.org/wiki/Homeworld), etc... 

The plan is initially just to study the basics. Then maybe move into creating some sort of gameplay pattern. But at this point it's all research and trying things out. 

For now at least, this is just for fun learning experience. If you find I'm doing anything crazy or I'm shooting myself in the foot, don't hesitate to post issues on Github. I'm always open to ideas as I go along with this study. ✌

## Environments

There are a couple of environments that this repo deploys to.

### Development 

Initially there was only the `production` environment, but it was very difficult to build locally so I had to do something about it an I setup a `development` environment which was **easy** and **fast** to build locally.

[Dev Deployment](https://dev.waning.app/index.html) uses main thread for everything.

```
time npx webpack --config webpack.config.dev.js
real    0m7.280s
user    0m0.015s
sys     0m0.169s
```

### Production 

[Production Deployment](https://waning.app/index.html) tries to distribute effort to worker threads. For now, only 1 worker thread.

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

- [Nakama](https://heroiclabs.com/) - a nice `golang` server.
- [Nengi](https://timetocode.com/nengi/authoritative-server) - a nice game server.

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

# References

## Icons

- https://www.flaticon.com/free-icon/spaceship_897100?term=space&page=2&position=57