import * as React from "react";
import { GameStore } from "stores/game";
import { inject, observer } from "mobx-react";
import { Redirect } from "react-router";

type JoinGameProps = {
  roomCode?: string;
};

type JoinGameState = {
  roomCode?: string;
  playerName?: string;
  readied: boolean;
};

class JoinGameComponent extends React.Component<JoinGameProps, JoinGameState> {
  state = {
    roomCode: this.props.roomCode || "",
    playerName: "",
    readied: false
  };

  joinGame() {
    GameStore.joinGameAsPlayer(this.state.roomCode, this.state.playerName);
    this.setState({ readied: true });
  }

  render() {
    if (this.state.readied) {
      return <Redirect to={`/play/${this.state.roomCode}/${this.state.playerName}`} />;
    }

    return (
      <React.Fragment>
        <h2>Join</h2>
        <p>Room Code</p>
        <input
          type="text"
          value={this.state.roomCode}
          onChange={event => this.setState({ roomCode: event.target.value })}
        />
        <p>Hoo-hoo are you?</p>
        <input
          type="text"
          value={this.state.playerName}
          onChange={event => this.setState({ playerName: event.target.value })}
        />
        <button onClick={() => this.joinGame()}>Join</button>
      </React.Fragment>
    );
  }
}

const JoinGame = JoinGameComponent;
export { JoinGame };
