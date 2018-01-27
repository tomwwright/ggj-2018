import * as React from "react";
import { Route, Switch, BrowserRouter, Link } from "react-router-dom";
import { Redirect } from "react-router";

import { PlayApp } from "./playApp";
import { TvApp } from "./tvApp";
import { WithGame } from "containers/withGame";
import { CreateGame } from "containers/CreateGame";

const tokenExists = (token): boolean => {
  // TODO: check if token exists
  return true;
};

export const Root: React.StatelessComponent = () => (
  <BrowserRouter>
    <Switch>
      <Route
        exact
        path="/"
        render={props => {
          return <CreateGame />;
        }}
      />
      <Route
        path="/play/:token"
        render={props => {
          return tokenExists(props.match.params.token) ? (
            <WithGame token={props.match.params.token}>
              <PlayApp />
            </WithGame>
          ) : (
            // route to createGame page
            <Redirect to="/" />
          );
        }}
      />
      <Route
        path="/tv/:token"
        render={props => {
          return tokenExists(props.match.params.token) ? (
            <WithGame token={props.match.params.token}>
              <TvApp />
            </WithGame>
          ) : (
            // route to createGame page
            <Redirect to="/" />
          );
        }}
      />
      <Route>
        <React.Fragment>
          <p>BAD URL. Try:</p>
          <Link to="/">Home</Link>
        </React.Fragment>
      </Route>
    </Switch>
  </BrowserRouter>
);
