import * as React from "react";
import { inject, observer } from "mobx-react";

import { GameStore } from "stores/game";
import { TvStore } from "stores/tv";
import { TvLobby } from "containers/TvLobby";
import { TvStart } from "containers/TvStart";
import { TvMain } from "containers/TvMain";
import { TvEndTurn } from "containers/TvEndTurn";
import { TvEndGame } from "containers/TvEndGame";
import ReactPlayer from "react-player";

const bgStyle = {
  height: "100%",
  width: "100%",
  backgroundSize: "cover",
  backgroundImage: "url(/assets/sky_bg_tv.jpg)",
  textAlign: "center",
  color: "greenyellow",
  zIndex: -1
};

type TvAppProps = {
  gameStore?: GameStore;
  tvStore?: TvStore;
};

const TvAppComponent: React.StatelessComponent<TvAppProps> = ({ gameStore, tvStore }) => {
  // if we're rendering this component we must be the screen *shrug*
  tvStore.enable();

  var screenComponent;

  if (gameStore.game.state == "lobby") {
    screenComponent = <TvLobby token={gameStore.token} players={gameStore.game.players} />;
  } else if (gameStore.game.state == "start") {
    screenComponent = <TvStart />;
  } else if (!gameStore.currentTurn || !gameStore.devices || !gameStore.instructions) {
    screenComponent = <p>Loading stuff...</p>;
  } else if (gameStore.game.state == "end turn") {
    screenComponent = <TvEndTurn />;
  } else if (gameStore.game.state == "game over") {
    screenComponent = (
      <TvEndGame round={gameStore.game.currentRound} turn={gameStore.round.currentTurn} />
    );
  } else {
    screenComponent = <TvMain />;
  }

  return (
    <div style={bgStyle}>
      <ReactPlayer url="/assets/jamjam.ogg" preload="auto" playing loop width={0} height={0} />
      {screenComponent}
    </div>
  );
};

export const TvApp = inject("gameStore", "tvStore")(observer(TvAppComponent));
