export enum GameMode {
  ThirdPersonTargetting,
  CockpitFrontConsole,
  CockpitLeftConsole,
  CockpitRightConsole,
  CockpitFree,
  ThirdPersonLocked,
  ThirdPersonFree,
  ThirdPersonArcRotate,
}

export class GameModeStateMachine {
  public cycle(mode: GameMode): GameMode {
    switch (mode) {
      case GameMode.ThirdPersonArcRotate:
        return GameMode.ThirdPersonTargetting;
      case GameMode.ThirdPersonTargetting:
        return GameMode.ThirdPersonArcRotate;
      default:
        return GameMode.ThirdPersonTargetting;
    }
  }
}
