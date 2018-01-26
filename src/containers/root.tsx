import * as React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";

import { PlayApp } from "./playApp";
import { TvApp } from "./tvApp";

export const Root: React.StatelessComponent = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/play/:token" render={props => <PlayApp token={props.match.params.token} />} />
      <Route path="/tv/:token" render={props => <TvApp token={props.match.params.token} />} />
      <Route>
        <p>Oi</p>
      </Route>
    </Switch>
  </BrowserRouter>
);
