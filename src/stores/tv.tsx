import { observable, action, computed, autorun, when } from "mobx";
import * as Firebase from "firebase";

import { firestore, mapDocToT } from "service/firebase";
import { Game, Device, Round, Turn, Instruction } from "models";
import { GameStore } from "stores/game";

import { timeout } from "utils";

const hardcodedTurnData = [
  {
    targetState: {
      SamDev: "2",
      TomDev: "1",
      JDev: "1"
    },
    deviceState: {
      SamDev: "1",
      TomDev: "1",
      JDev: "1"
    }
  },
  {
    targetState: {
      SamDev: "2",
      TomDev: "1",
      JDev: "2"
    },
    deviceState: {}
  },
  {
    targetState: {
      SamDev: "3",
      TomDev: "3",
      JDev: "3"
    },
    deviceState: {}
  }
];

const hardcodedInstructionData = [
  [
    {
      player: "Tom",
      device: "SamDev",
      targetState: "2",
      targetTurn: 1
    },
    {
      player: "Sam",
      device: "JDev",
      targetState: "2",
      targetTurn: 2
    },
    {
      player: "James",
      device: "TomDev",
      targetState: "3",
      targetTurn: 3
    }
  ],
  [
    {
      player: "Sam",
      device: "SamDev",
      targetState: "3",
      targetTurn: 3
    },
    {
      player: "Tom",
      device: "JDev",
      targetState: "3",
      targetTurn: 3
    }
  ],
  []
];

export class TvStore {
  @observable turnTime: number;
  private turnTimer: any;

  @observable deviceStateListCount = 0;

  private gameStore: GameStore;

  @observable enabled: boolean = false;

  constructor(gameStore: GameStore) {
    this.gameStore = gameStore;

    when(
      () => this.gameStore.game && this.gameStore.game.state == "start" && this.enabled,
      () => {
        this.startGame();
      }
    );
  }

  @action
  public enable() {
    this.enabled = true;
  }

  @action
  public async assignDevices() {
    const gameRef = firestore.collection("games").doc(this.gameStore.token);
    const devicesRef = gameRef.collection("devices");

    this.gameStore.game.players.forEach(async player => {
      const device: Device = {
        playerName: player,
        colour: "red",
        type: "switch",
        name: player + "Dev"
      };
      await devicesRef.add(device);
    });
  }

  @action
  public async startRound() {
    const gameRef = firestore.collection("games").doc(this.gameStore.token);

    const round = {
      currentTurn: -1,
      numTurns: 3,
      turnDuration: 20,
      difficulty: 1,
      lives: 5,
      usedLives: 0
    };

    const roundRef = gameRef
      .collection("rounds")
      .doc((this.gameStore.game.currentRound + 1).toString());

    await roundRef.set(round);

    await gameRef.update({ currentRound: this.gameStore.game.currentRound + 1 });

    for (let i = 0; i < round.numTurns; ++i) {
      const turnRef = roundRef.collection("turns").doc(i.toString());

      await turnRef.set(hardcodedTurnData[i]);
      hardcodedInstructionData[i].forEach(
        async instruction => await turnRef.collection("instructions").add(instruction)
      );
    }
  }

  @action
  public async setUsedLives(newUsedLives: number) {
    await this.gameStore.roundRef.update({ usedLives: newUsedLives });
  }

  @action
  public async startNextTurn() {
    const nextTurn = this.gameStore.round.currentTurn + 1;

    this.turnTime = this.gameStore.round.turnDuration;

    this.gameStore.roundRef.update({ currentTurn: nextTurn });

    this.turnTimer = setInterval(() => {
      this.turnTime = this.turnTime - 1;
      if (this.turnTime < 0) {
        clearInterval(this.turnTimer);
        this.endTurn();
      }
    }, 1000);

    this.gameStore.setGameState("playing");
  }

  @action
  public startGame() {
    setTimeout(async () => {
      await this.assignDevices();
      await this.startRound();
      await this.startNextTurn();
    }, 1000);
  }

  @action
  public async endTurn() {
    this.gameStore.setGameState("end turn");
    this.deviceStateListCount = 0;
    for (let i = 0; i < this.gameStore.devices.length; ++i) {
      await timeout(1000);
      const device = this.gameStore.devices[i];

      this.deviceStateListCount++;
      if (
        this.gameStore.currentTurn.targetState[device.name] !==
        this.gameStore.currentTurn.deviceState[device.name]
      ) {
        this.setUsedLives(this.gameStore.round.usedLives + 1);
      }
    }
    await timeout(5000);
    if (this.gameStore.round.usedLives >= this.gameStore.round.lives) {
      this.gameOver();
    } else {
      await this.startNextTurn();
    }
  }

  @action
  public gameOver() {
    this.gameStore.setGameState("game over");
  }
}
