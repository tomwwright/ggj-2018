import * as React from "react";
import { inject, observer } from "mobx-react";

import { GameStore } from "stores/game";

type TvAppProps = {
  gameStore?: GameStore;
};

const TvAppComponent: React.StatelessComponent<TvAppProps> = ({ gameStore }) => (
  <div>
    <p>TV App ({gameStore.token})</p>
  </div>
);

export const TvApp = inject("gameStore")(observer(TvAppComponent));
