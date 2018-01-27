import { observable, action, computed, autorun } from "mobx";
import * as Firebase from "firebase";

import { firestore, mapDocToT } from "service/firebase";
import { Game, Device, Round, Turn, Instruction } from "models";
import { GameStore } from "stores/game";

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

  private gameStore: GameStore;

  constructor(gameStore: GameStore) {
    this.gameStore = gameStore;
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
        name: "Thingamajig"
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

    await this.startNextTurn();
  }

  @action
  public async startNextTurn() {
    const nextTurn = this.gameStore.round.currentTurn + 1;

    this.turnTime = this.gameStore.round.turnDuration;

    this.gameStore.roundRef.update({ currentTurn: nextTurn });
    this.gameStore.setGameState("playing");
  }
}
