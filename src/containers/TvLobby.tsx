import * as React from "react";

type TvLobbyProps = {
  token: string;
  players: string[];
};

export const TvLobby: React.StatelessComponent<TvLobbyProps> = ({ token, players }) => (
  <React.Fragment>
    <h1>Flocking Up Together</h1>
    <h3>Room Code: {token}</h3>
    <ul>{players.map((player, i) => <li key={i}>{player}</li>)}</ul>
    <p>Waiting for players...</p>
  </React.Fragment>
);
