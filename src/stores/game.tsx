import { observable, action, computed, autorun } from "mobx";

import { firestore, mapDocToT } from "service/firebase";
import { Game, Device, Round, Turn, Instruction } from "models";
import * as Firebase from "firebase";

export class GameStore {
  @observable playerName: string;
  @observable token: string;
  @observable game: Game;
  @observable devices: Device[];
  @observable round: Round;
  @observable turns: Turn[];
  @observable instructions: Instruction[];

  gameRef: Firebase.firestore.DocumentReference;
  devicesRef: Firebase.firestore.CollectionReference;
  roundRef: Firebase.firestore.DocumentReference;
  turnsRef: Firebase.firestore.CollectionReference;
  instructionsRef: Firebase.firestore.CollectionReference;

  constructor() {
    autorun(() => {
      if (this.token) {
        this.gameRef = firestore.collection("games").doc(this.token);
        this.gameRef.onSnapshot(snapshot => {
          this.game = mapDocToT<Game>(snapshot);
        });
      }
    });

    autorun(() => {
      if (this.game) {
        this.devicesRef = this.gameRef.collection("devices");
        this.devicesRef.onSnapshot(snapshot => {
          this.devices = snapshot.docs.map(doc => mapDocToT<Device>(doc));
        });
      }
    });

    autorun(() => {
      if (this.game) {
        this.roundRef = this.gameRef.collection("rounds").doc(this.game.currentRound.toString());
        this.roundRef.onSnapshot(snapshot => {
          this.round = mapDocToT<Round>(snapshot);
        });
      }
    });

    autorun(() => {
      if (this.round) {
        this.turnsRef = this.roundRef.collection("turns");
        this.turnsRef.onSnapshot(snapshot => {
          this.turns = snapshot.docs.map(doc => mapDocToT<Turn>(doc));
        });
      }
    });

    autorun(() => {
      if (this.currentTurn) {
        this.instructionsRef = this.turnsRef
          .doc(this.round.currentTurn.toString())
          .collection("instructions");
        this.instructionsRef.onSnapshot(snapshot => {
          this.instructions = snapshot.docs.map(doc => mapDocToT<Instruction>(doc));
        });
      }
    });
  }

  @action
  setToken(token: string) {
    this.token = token;
  }

  @action
  setPlayerName(playerName: string) {
    this.playerName = playerName;
    if (!this.game.players.find(it => it == playerName)) {
      this.game.players.push(playerName);
      this.gameRef.update({
        players: this.game.players
      });
    }
  }

  @computed
  get currentTurn(): Turn {
    return this.turns ? this.turns[this.round.currentTurn] : null;
  }

  @action
  setDeviceState(device: string, state: string) {
    this.turnsRef
      .doc(this.round.currentTurn.toString())
      .set({ deviceState: { [device]: state } }, { merge: true });
  }
}
