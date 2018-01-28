import * as React from "react";

import ReactPlayer from "react-player";

type TvEndGameProps = {
  round: number;
  turn: number;
};

export const TvEndGame: React.StatelessComponent<TvEndGameProps> = props => (
  <React.Fragment>
    <ReactPlayer url="/assets/lose.ogg" preload="auto" playing width={0} height={0} />
    <img
      src="/sigil.png"
      style={{ maxWidth: "25%", marginTop: "5%", marginLeft: "5%", display: "block" }}
    />
    <h3>Game Over</h3>
    <p>
      Round {props.round}, Turn {props.turn}
    </p>
  </React.Fragment>
);
