import * as React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import { GameStore } from "stores/game";

type TvAppProps = {
  token: string;
  gameStore?: GameStore;
};

const TvAppComponent: React.StatelessComponent<TvAppProps> = props => {
  props.gameStore.setToken(props.token);
  return (
    <div>
      <p>TV App ({props.gameStore.token})</p>
      <p>Turn: {props.gameStore.game ? props.gameStore.game.turn : "BRUH"}</p>
    </div>
  );
};

export const TvApp = inject("gameStore")(observer(TvAppComponent));
