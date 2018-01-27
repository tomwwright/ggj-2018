import * as React from "react";
import * as ReactDOM from "react-dom";
import "typeface-roboto";
import { Provider } from "mobx-react";

import { Root } from "./containers/root";
import { GameStore } from "./stores/game";
import { TvStore } from "./stores/tv";

const stores = {
  game: new GameStore(),
  tv: new TvStore()
};

(window as any).stores = stores;

ReactDOM.render(
  <Provider gameStore={stores.game} tvStore={stores.tv}>
    <Root />
  </Provider>,
  document.getElementById("react-container")
);
