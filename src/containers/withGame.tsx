import * as React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import { GameStore } from "../stores/game";

type WithGameProps = {
  token: string;
  gameStore?: GameStore;
};

const WithGameComponent: React.StatelessComponent<WithGameProps> = props => {
  props.gameStore.setToken(props.token);
  if (props.gameStore.game) return <div>{props.children}</div>;
  else
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
};

export const WithGame = inject("gameStore")(observer(WithGameComponent));
