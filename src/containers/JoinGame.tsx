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

  joinStyle = {
    height: "100%",
    width: "100%",
    backgroundSize: "cover",
    backgroundImage: "url(/ph_lobby_placeholder.png)",
    textAlign: "center"
  };

  roomCodeStyle = {
    marginTop: "115%"
  };

  playerNameStyle = {
    marginTop: "28%"
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
        <div id="join-container" style={this.joinStyle}>
          <div>
            <input
              style={this.roomCodeStyle}
              type="text"
              value={this.state.roomCode}
              onChange={event => this.setState({ roomCode: event.target.value })}
            />
          </div>
          <div>
            <input
              style={this.playerNameStyle}
              type="text"
              value={this.state.playerName}
              onChange={event => this.setState({ playerName: event.target.value })}
            />
          </div>
          <button onClick={() => this.joinGame()}>Join</button>
        </div>
      </React.Fragment>
    );
  }
}

export { JoinGameComponent as JoinGame };
