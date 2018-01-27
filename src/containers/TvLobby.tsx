import * as React from "react";

type TvLobbyProps = {
  token: string;
  players: string[];
};

function generateCode(length: number) {
  String.fromCharCode(127, 128, 129);
}

export const TvLobby: React.StatelessComponent<TvLobbyProps> = ({ token, players }) => (
  <React.Fragment>
    <h1>Flocking Up Together</h1>
    <h3>Room Code: {token}</h3>
    <ul>{players.map(player => <li>{player}</li>)}</ul>
    <p>Waiting for players...</p>
  </React.Fragment>
);
