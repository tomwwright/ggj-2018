import * as React from "react";
import { Route, Switch, BrowserRouter, Link } from "react-router-dom";
import { Redirect } from "react-router";

import { PlayApp } from "./PlayApp";
import { JoinGame } from "containers/JoinGame";
import { TvApp } from "./TvApp";
import { WithGame } from "../containers/withGame";
import { Home } from "../containers/Home";

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
        path="/join/:roomCode?"
        render={props => {
          return <JoinGame roomCode={props.match.params.roomCode} />;
        }}
      />
      <Route
        path="/play/:token/:playerName"
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
