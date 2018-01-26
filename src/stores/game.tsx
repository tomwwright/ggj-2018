import { observable, action } from "mobx";

import { firestore, mapDocToT } from "service/firebase";
import { Game } from "models";
import * as Firebase from "firebase";

export class GameStore {
  @observable token: string;
  @observable game: Game;

  gameRef: Firebase.firestore.DocumentReference;

  @action
  setToken(token: string) {
    this.token = token;
    this.gameRef = firestore.collection("games").doc(token);
    this.gameRef.onSnapshot(snapshot => {
      this.game = mapDocToT<Game>(snapshot);
    });
  }
}
