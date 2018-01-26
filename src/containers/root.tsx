import * as React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";

import { PlayApp } from "./playApp";
import { TvApp } from "./tvApp";
import { WithGame } from "containers/withGame";

export const Root: React.StatelessComponent = () => (
  <BrowserRouter>
    <Switch>
      <Route
        path="/play/:token"
        render={props => (
          <WithGame token={props.match.params.token}>
            <PlayApp />
          </WithGame>
        )}
      />
      <Route
        path="/tv/:token"
        render={props => (
          <WithGame token={props.match.params.token}>
            <TvApp />
          </WithGame>
        )}
      />
      <Route>
        <p>Oi</p>
      </Route>
    </Switch>
  </BrowserRouter>
);
