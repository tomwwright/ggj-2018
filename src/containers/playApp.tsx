import * as React from "react";
import { inject, observer } from "mobx-react";

import { GameStore } from "stores/game";

type PlayAppProps = {
  gameStore?: GameStore;
};

const PlayAppComponent: React.StatelessComponent<PlayAppProps> = ({ gameStore }) =>
  !gameStore.currentTurn ? (
    <div>
      <p>Loading Round and Turn...</p>
    </div>
  ) : (
    <div>
      <p>Play App (PLAYER_NAME, {gameStore.token})</p>
      <p>Round: {gameStore.game.currentRound}</p>
      <p>
        Turn: {gameStore.round.currentTurn.toString()} / {gameStore.round.numTurns}
      </p>
    </div>
  );

export const PlayApp = inject("gameStore")(observer(PlayAppComponent));
