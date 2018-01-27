import * as React from "react";
import { inject, observer } from "mobx-react";

import { GameStore } from "stores/game";
import { TvStore } from "stores/tv";
import { TvLobby } from "containers/TvLobby";
import { TvStart } from "containers/TvStart";
import { TvMain } from "containers/TvMain";
import { TvEndTurn } from "containers/TvEndTurn";
import { TvEndGame } from "containers/TvEndGame";

type TvAppProps = {
  gameStore?: GameStore;
  tvStore?: TvStore;
};

const TvAppComponent: React.StatelessComponent<TvAppProps> = ({ gameStore, tvStore }) => {
  // if we're rendering this component we must be the screen *shrug*
  tvStore.enable();

  if (gameStore.game.state == "lobby") {
    return <TvLobby token={gameStore.token} players={gameStore.game.players} />;
  }

  if (gameStore.game.state == "start") {
    return <TvStart />;
  }

  if (!gameStore.currentTurn || !gameStore.devices || !gameStore.instructions) {
    return (
      <React.Fragment>
        <p>Loading stuff...</p>
      </React.Fragment>
    );
  }

  if (gameStore.game.state == "end turn") {
    return <TvEndTurn />;
  }

  if (gameStore.game.state == "game over") {
    return <TvEndGame round={gameStore.game.currentRound} turn={gameStore.round.currentTurn} />;
  }

  return <TvMain />;
};

export const TvApp = inject("gameStore", "tvStore")(observer(TvAppComponent));
