import * as React from "react";

type TvEndGameProps = {
  round: number;
  turn: number;
};

export const TvEndGame: React.StatelessComponent<TvEndGameProps> = props => (
  <React.Fragment>
    <img src="/sigil.png" style={{ maxWidth: "40%", marginTop: "5%" }} />
    <h3>Game Over</h3>
    <p>
      Round {props.round}, Turn {props.turn}
    </p>
  </React.Fragment>
);
