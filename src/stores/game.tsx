import { observable, action, computed, autorun } from "mobx";

import { firestore, mapDocToT } from "service/firebase";
import { Game, Round, Turn } from "models";
import * as Firebase from "firebase";

export class GameStore {
  @observable token: string;
  @observable game: Game;
  @observable round: Round;
  @observable turns: Turn[];

  gameRef: Firebase.firestore.DocumentReference;
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

  @computed
  get currentTurn(): Turn {
    return this.turns ? this.turns[this.round.currentTurn] : null;
  }
}
