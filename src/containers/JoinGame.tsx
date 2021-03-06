import * as React from "react";
import { GameStore } from "stores/game";
import { inject, observer } from "mobx-react";
import { Redirect } from "react-router";

type JoinGameState = {
  roomCode?: string;
  playerName?: string;
  readied: boolean;
};

class JoinGameComponent extends React.Component<{}, JoinGameState> {
  state = {
    roomCode: "",
    playerName: "",
    readied: false
  };

  joinStyle = {
    height: "100%",
    backgroundSize: "cover",
    width: "100%",
    backgroundImage: "url(/sky_bg.png)",
    textAlign: "center"
  };

  roomCodeStyle = {
    // top: "115%"
  };
  playerNameStyle = {
    // marginTop: "28%"
  };

  async joinGame() {
    GameStore.joinGameAsPlayer(this.state.roomCode, this.state.playerName).then(() => {
      this.setState({ readied: true });
    });
  }

  render() {
    if (this.state.readied) {
      return <Redirect to={`/play/${this.state.roomCode}/${this.state.playerName}`} />;
    }

    return (
      <React.Fragment>
        <div id="join-container" style={this.joinStyle}>
          <img src="/sigil.png" alt="flocking up together sigil" height="40%" />
          <h2>Enter Room Code</h2>
          <div>
            <input
              style={this.roomCodeStyle}
              type="text"
              value={this.state.roomCode}
              onChange={event => this.setState({ roomCode: event.target.value })}
            />
          </div>
          <h2>Player Name</h2>
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
