import * as React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";

type TvAppProps = {
  token: string;
};

export const TvApp: React.StatelessComponent<TvAppProps> = ({ token }) => <p>TV App: {token}</p>;
