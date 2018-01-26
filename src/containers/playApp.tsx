import * as React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import { GameStore } from "stores/game";

type PlayAppProps = {
  token: string;
  gameStore?: GameStore;
};

const PlayAppComponent: React.StatelessComponent<PlayAppProps> = props => {
  props.gameStore.setToken(props.token);
  return (
    <div>
      <p>Play App ({props.gameStore.token})</p>
      <p>Turn: {props.gameStore.game ? props.gameStore.game.turn : "BRUH"}</p>
    </div>
  );
};

export const PlayApp = inject("gameStore")(observer(PlayAppComponent));
