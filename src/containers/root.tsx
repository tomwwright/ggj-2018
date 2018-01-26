import * as React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";

import { PlayApp } from "./playApp";
import { TvApp } from "./tvApp";

export const Root: React.StatelessComponent = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/play" component={PlayApp} />
      <Route path="/tv" component={TvApp} />
    </Switch>
  </BrowserRouter>
);
