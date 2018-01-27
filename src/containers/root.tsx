import * as React from "react";
import { Route, Switch, BrowserRouter, Link } from "react-router-dom";
import { Redirect } from "react-router";

import { PlayApp } from "./playApp";
import { TvApp } from "./tvApp";
import { WithGame } from "../containers/withGame";
import { Home } from "../containers/Home";
import { JoinGame } from "containers/JoinGame";

const gameWithIdExists = (token): boolean => {
  // TODO: check if token exists
  return true;
};

const gameWithIdIsLobbyState = (token): boolean => {
  // TODO: check if game with token is in lobby
  return true;
};

export const Root: React.StatelessComponent = () => (
  <BrowserRouter>
    <Switch>
      <Route
        exact
        path="/"
        render={props => {
          return <Home />;
        }}
      />
      <Route
        exact
        path="/join"
        render={props => {
          return <JoinGame />;
        }}
      />
      <Route
        path="/play/:token/:name"
        render={props => {
          return gameWithIdExists(props.match.params.token) ? (
            <WithGame token={props.match.params.token}>
              <PlayApp playerName={props.match.params.playerName} />
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
          return gameWithIdExists(props.match.params.token) ? (
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
          <p>
            404: BAD URL, go <Link to="/">Home</Link> you're drunk.
          </p>
        </React.Fragment>
      </Route>
    </Switch>
  </BrowserRouter>
);
