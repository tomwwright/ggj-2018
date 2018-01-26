import * as React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import { GameStore } from "stores/game";

type PlayAppProps = {
  gameStore?: GameStore;
};

const PlayAppComponent: React.StatelessComponent<PlayAppProps> = ({ gameStore }) => (
  <div>
    <p>Play App ({gameStore.token})</p>
    <p>Turn: {gameStore.game.turn}</p>
  </div>
);

export const PlayApp = inject("gameStore")(observer(PlayAppComponent));
