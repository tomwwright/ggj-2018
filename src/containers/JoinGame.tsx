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

  render() {
    return (
      <React.Fragment>
        <form onSubmit={() => this.props.gameStore.setPlayerName(this.state.name)}>
          <h2>{`Ready Up for Game ${this.props.gameStore.token}`}</h2>
          <div>What's your name, chief?</div>
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
