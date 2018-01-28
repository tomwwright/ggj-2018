import { observable, action, computed, autorun, when } from "mobx";
import * as Firebase from "firebase";
import { timeout } from "utils";

import { firestore, mapDocToT } from "service/firebase";
import { Game, Device, Round, Turn, Instruction } from "models";
import { GameStore } from "stores/game";
import { Howl, Howler } from "howler";

const DeviceNames = ["Whatchamacallit", "Doodad", "Whoosiwatsit", "Thingamahjig"];

const DeviceTypes = ["switch"];
const DeviceMaxState = 8;

const DeviceColors = ["red", "blue", "green", "yellow", "pink", "orange", "purple"];

export class TvStore {
  @observable turnTime: number;
  private turnTimer: any;

  @observable deviceStateListCount = 0;

  private gameStore: GameStore;
  private oldDeviceState: { [device: string]: string };

  @observable enabled: boolean = false;

  constructor(gameStore: GameStore) {
    this.gameStore = gameStore;

    autorun(() => {
      if (this.gameStore.game && this.gameStore.game.state == "playing" && this.enabled) {
        const currentStates = this.oldDeviceState || {};
        console.log("currentStates", currentStates);
        console.log("deviceState", this.gameStore.currentTurn.deviceState);
        const hasDifferentState = Object.keys(currentStates).find(
          deviceName =>
            currentStates[deviceName] !== this.gameStore.currentTurn.deviceState[deviceName]
        );

        if (hasDifferentState) {
          console.log("hasDifferentState", hasDifferentState);
          const sound = new Howl({
            src: ["/assets/switch.ogg"],
            preload: true,
            html5: true
          }).play();
        }

        this.oldDeviceState = this.gameStore.currentTurn.deviceState;
      }
    });

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

    const devicesAreAlreadyAssigned = (await devicesRef.get()).docs.length > 0;

    if (devicesAreAlreadyAssigned) {
      return;
    }

    const playerDevices: Device[] = [];
    this.gameStore.game.players.forEach((player, index) => {
      const unusedDeviceNames = DeviceNames.filter(
        name => !playerDevices.find(device => device.name === name)
      );

      const deviceName = unusedDeviceNames[Math.floor(Math.random() * unusedDeviceNames.length)];
      const deviceType = DeviceTypes[Math.floor(Math.random() * DeviceTypes.length)];
      const deviceColor = DeviceColors[index % DeviceColors.length];

      const device: Device = {
        playerName: player,
        colour: deviceColor,
        type: deviceType,
        name: deviceName
      };

      playerDevices.push(device);
    });

    playerDevices.forEach(async device => await devicesRef.add(device));
  }

  @action
  public async startNewRound() {
    const nextRound = this.gameStore.game.currentRound + 1;
    const gameRef = firestore.collection("games").doc(this.gameStore.token);

    const round = {
      currentTurn: -1,
      numTurns: 10,
      turnDuration: 20,
      difficulty: 1 + nextRound,
      lives: 5,
      usedLives: 0
    };

    const roundRef = gameRef.collection("rounds").doc(nextRound.toString());

    await roundRef.set(round);

    await gameRef.update({ currentRound: nextRound });

    const { turns, instructions } = this.generateTurns(
      round.numTurns,
      round.difficulty,
      this.gameStore.devices,
      this.gameStore.game.players
    );

    for (let i = 0; i < round.numTurns; ++i) {
      const turnRef = roundRef.collection("turns").doc(i.toString());

      await turnRef.set(turns[i]);

      instructions[i].forEach(
        async instruction => await turnRef.collection("instructions").add(instruction)
      );
    }
  }

  @action
  public async setUsedLives(newUsedLives: number) {
    await this.gameStore.roundRef.update({ usedLives: newUsedLives });
  }

  @action
  generateTurns(
    numTurns: number,
    difficulty: number,
    devices: Device[],
    players: string[]
  ): { turns: Turn[]; instructions: Instruction[][] } {
    const turns: Turn[] = [];
    const initialDeviceState = {};
    devices.forEach(device => {
      initialDeviceState[device.name] = Math.ceil(Math.random() * DeviceMaxState).toString();
    });

    for (var i = 0; i < numTurns; i++) {
      const deviceTurnTargetStates: { [device: string]: string } = {};

      var lastTurnsTargetStates: { [device: string]: string } = {};
      if (i !== 0) {
        lastTurnsTargetStates = turns[i - 1].targetState;
      } else {
        lastTurnsTargetStates = initialDeviceState;
      }

      devices.forEach(device => {
        const shouldChangeThisRound = Math.random() > 0.2;
        if (shouldChangeThisRound) {
          deviceTurnTargetStates[device.name] = Math.floor(
            Math.random() * DeviceMaxState
          ).toString();
        } else {
          deviceTurnTargetStates[device.name] = lastTurnsTargetStates[device.name];
        }
      });

      turns.push({
        targetState: deviceTurnTargetStates,
        deviceState: i == 0 ? initialDeviceState : {}
      });
    }

    const instructionsPerTurn: Instruction[][] = turns.map(() => []);
    turns.forEach(({ targetState, deviceState }, turnNum) => {
      var lastTurnsTargetStates: { [device: string]: string } = {};
      if (turnNum !== 0) {
        lastTurnsTargetStates = turns[i - 1].targetState;
      } else {
        lastTurnsTargetStates = initialDeviceState;
      }

      Object.keys(targetState).forEach(deviceName => {
        const targetDeviceValue = targetState[deviceName];
        const hasChangedThisTurn = targetDeviceValue !== lastTurnsTargetStates[deviceName];

        if (hasChangedThisTurn) {
          const instruction: Instruction = {
            player: players[Math.floor(Math.random() * players.length)],
            device: deviceName,
            targetState: targetDeviceValue,
            targetTurn: turnNum
          };

          instructionsPerTurn[Math.max(0, turnNum - Math.floor(Math.random() * 4))].push(
            instruction
          );
        }
      });
    });

    console.log("turns", turns);
    console.log("instructionsPerTurn", instructionsPerTurn);

    return { turns, instructions: instructionsPerTurn };
  }

  @action
  public async startNextTurn() {
    const nextTurn = this.gameStore.round.currentTurn + 1;

    this.turnTime = this.gameStore.round.turnDuration;

    if (nextTurn > 0) {
      await this.gameStore.turnsRef
        .doc(nextTurn.toString())
        .update({ deviceState: this.gameStore.currentTurn.deviceState });
    }

    await this.gameStore.roundRef.update({ currentTurn: nextTurn });

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
      await this.startNewRound();
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
      if (this.gameStore.round.currentTurn == this.gameStore.round.numTurns - 1) {
        await this.startNewRound();
      }
      await this.startNextTurn();
    }
  }

  @action
  public gameOver() {
    this.gameStore.setGameState("game over");
  }
}
