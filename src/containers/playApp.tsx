import * as React from "react";
import { inject, observer } from "mobx-react";

import { GameStore } from "stores/game";
import { JoinGame } from "containers/JoinGame";

type PlayAppProps = {
  gameStore?: GameStore;
};

const PlayAppComponent: React.StatelessComponent<PlayAppProps> = ({ gameStore }) => {
  if (!gameStore.playerName) {
    return <JoinGame />;
  }

  if (!gameStore.currentTurn) {
    return (
      <React.Fragment>
        <p>Loading Round and Turn...</p>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <p>Play App (PLAYER_NAME, {gameStore.token})</p>
        <p>Round: {gameStore.game.currentRound}</p>
        <p>
          Turn: {gameStore.round.currentTurn.toString()} / {gameStore.round.numTurns}
        </p>
      </React.Fragment>
    );
  }
};

export const PlayApp = inject("gameStore")(observer(PlayAppComponent));
