import * as React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import { GameStore } from "stores/game";

type TvAppProps = {
  gameStore?: GameStore;
};

const TvAppComponent: React.StatelessComponent<TvAppProps> = ({ gameStore }) => (
  <div>
    <p>TV App ({gameStore.token})</p>
    <p>Turn: {gameStore.game.currentTurn}</p>
  </div>
);

export const TvApp = inject("gameStore")(observer(TvAppComponent));
