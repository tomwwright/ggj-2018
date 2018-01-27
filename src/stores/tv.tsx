import { observable, action, computed, autorun } from "mobx";
import * as Firebase from "firebase";

import { firestore, mapDocToT } from "service/firebase";
import { Game, Device, Round, Turn, Instruction } from "models";
import { GameStore } from "stores/game";

const DeviceNames = ["Whatchamacallit", "Doodad", "Whoosiwatsit", "Thingamahjig"];

const DeviceTypes = ["switch", "slider", "dial"];
const DeviceMaxState = 10;

const DeviceColors = ["red", "blue", "green", "yellow", "pink", "orange", "purple"];

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

    await this.startNextTurn();
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
      initialDeviceState[device.name] = Math.floor(Math.random() * DeviceMaxState);
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
        const shouldChangeThisRound = Math.random() > 0.5;
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
        const initialDeviceValue = lastTurnsTargetStates[deviceName];
        const hasChangedThisTurn = targetDeviceValue !== initialDeviceValue;

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

    this.gameStore.roundRef.update({ currentTurn: nextTurn });
    this.gameStore.setGameState("playing");
  }
}
