import * as React from "react";
import * as ReactDOM from "react-dom";
import "typeface-roboto";
import { Provider } from "mobx-react";

import { Root } from "./containers/root";
import { GameStore } from "./stores/game";

const stores = {
  game: new GameStore()
};

(window as any).stores = stores;

ReactDOM.render(
  <Provider gameStore={stores.game}>
    <Root />
  </Provider>,
  document.getElementById("react-container")
);
