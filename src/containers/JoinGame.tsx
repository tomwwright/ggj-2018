import * as React from "react";
import { GameStore } from "stores/game";
import { inject, observer } from "mobx-react";

type JoinGameProps = {
  gameStore?: GameStore;
};

type JoinGameState = {
  name?: string;
};

class JoinGameComponent extends React.Component<JoinGameProps, JoinGameState> {
  state = {
    name: ""
  };

  renderExistingPlayers() {
    return (
      <React.Fragment>
        {this.props.gameStore.game.players &&
          this.props.gameStore.game.players.map(playerName => (
            <div key={playerName} style={{ display: "flex", margin: "12px" }}>
              <button onClick={() => this.setState({ name: playerName })}>
                Rejoin as {playerName}
              </button>
            </div>
          ))}
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={() => this.props.gameStore.setPlayerName(this.state.name)}>
          <h2>{`Ready Up for Game ${this.props.gameStore.token}`}</h2>
          <div>Hoo-hoo are you?</div>
          {this.renderExistingPlayers()}
          <input
            type="text"
            value={this.state.name}
            onChange={event => this.setState({ name: event.target.value })}
          />
          <button>Join</button>
        </form>
      </React.Fragment>
    );
  }
}

const JoinGame = inject("gameStore")(observer(JoinGameComponent));

export { JoinGame };
