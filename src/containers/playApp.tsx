import * as React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";

type PlayAppProps = {
  token: string;
};

export const PlayApp: React.StatelessComponent<PlayAppProps> = ({ token }) => (
  <p>Play App: {token}</p>
);
