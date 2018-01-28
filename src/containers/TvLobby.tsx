import * as React from "react";

type TvLobbyProps = {
  token: string;
  players: string[];
};

export const TvLobby: React.StatelessComponent<TvLobbyProps> = ({ token, players }) => (
  <React.Fragment>
    <img
      src="/sigil.png"
      style={{ maxWidth: "25%", marginTop: "5%", marginLeft: "5%", display: "block" }}
    />
    <div
      style={{
        textAlign: "right",
        position: "absolute",
        right: "5%",
        bottom: "5%"
      }}
    >
      <h1>Room Code: {token}</h1>
      <p>Waiting for players...</p>
    </div>
    <div
      style={{
        position: "absolute",
        left: "5%",
        bottom: "5%",
        display: "flex",
        width: "60%"
      }}
    >
      {players.map((player, i) => (
        <div
          style={{
            display: "inline-block",
            flex: 1,
            flexGrow: 1,
            margin: "5px",
            maxWidth: "25%"
          }}
        >
          <img src={`/avatars/player_0${i % 4 + 1}.png`} style={{ maxWidth: "100%" }} />
          <p>{player}</p>
        </div>
      ))}
    </div>
  </React.Fragment>
);
