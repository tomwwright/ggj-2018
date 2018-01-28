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
    this.setState({ readied: true });
    GameStore.joinGameAsPlayer(this.state.roomCode, this.state.playerName).then(() => {});
  }

  render() {
    if (this.state.readied) {
      return <Redirect to={`/play/${this.state.roomCode}/${this.state.playerName}`} />;
    }

    return (
      <React.Fragment>
        <div id="join-container" style={this.joinStyle}>
          <img
            src="/sigil.png"
            alt="flocking up together sigil"
            max-width="1080px"
            height="300px"
          />
          {/* Room Code */}
          <img src="/join/room_code.png" alt="room code" max-width="1080px" max-height="100px" />
          <div>
            <input
              style={this.roomCodeStyle}
              type="text"
              value={this.state.roomCode}
              onChange={event => this.setState({ roomCode: event.target.value })}
            />
          </div>
          {/* Player Name */}
          <img src="/join/name.png" alt="player name" max-width="1080px" max-height="100px" />
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
