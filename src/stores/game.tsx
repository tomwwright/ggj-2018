import { observable, action, computed, autorun } from "mobx";

import { firestore, mapDocToT } from "service/firebase";
import { Game, Device, Round, Turn } from "models";
import * as Firebase from "firebase";

export class GameStore {
  @observable playerName: string;
  @observable token: string;
  @observable game: Game;
  @observable devices: Device[];
  @observable round: Round;
  @observable turns: Turn[];

  gameRef: Firebase.firestore.DocumentReference;
  devicesRef: Firebase.firestore.CollectionReference;
  roundRef: Firebase.firestore.DocumentReference;
  turnsRef: Firebase.firestore.CollectionReference;

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
  }

  @action
  setToken(token: string) {
    this.token = token;
  }

  @action
  setPlayerName(playerName: string) {
    this.playerName = playerName;
  }

  @computed
  get currentTurn(): Turn {
    return this.turns ? this.turns[this.round.currentTurn] : null;
  }
}
