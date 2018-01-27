import * as React from "react";
import { inject, observer } from "mobx-react";

import { Splash } from "containers/splash";
import { GameStore } from "../stores/game";

type WithGameProps = {
  token: string;
  gameStore?: GameStore;
};

const WithGameComponent: React.StatelessComponent<WithGameProps> = props => {
  props.gameStore.setToken(props.token);
  if (props.gameStore.game) {
    return <React.Fragment>{props.children}</React.Fragment>;
  } else {
    return (
      <React.Fragment>
        <Splash spinner={true} />
      </React.Fragment>
    );
  }
};

export const WithGame = inject("gameStore")(observer(WithGameComponent));
