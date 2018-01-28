import * as React from "react";
import { Redirect } from "react-router";
import { inject, observer } from "mobx-react";
import { GameStore } from "../stores/game";
import * as shortid from "shortid";

type CreateGameState = {
  redirect: boolean;
  roomCode: string;
};

class Home extends React.Component<{}, CreateGameState> {
  state = {
    redirect: false,
    roomCode: ""
  };

  homeStyle = {
    height: "100%",
    width: "100%",
    backgroundSize: "cover",
    backgroundImage: "url(/sky_bg.png)",
    textAlign: "center"
  };

  createGame = (): void => {
    // generate guid
    const token = shortid
      .generate()
      .toUpperCase()
      .slice(0, 5);

    // set in Firebase through util method
    GameStore.createGame(token);

    // redirect
    this.setState({ roomCode: token });
    this.setState({ redirect: true });
  };

  joinGame = (): void => {
    this.setState({ redirect: true });
  };

  public render() {
    if (!!this.state.redirect) {
      return <Redirect push to={{ pathname: `/join/${this.state.roomCode}` }} />;
    }
    return (
      <div style={this.homeStyle}>
        <img src="/sigil.png" alt="flocking up together sigil" max-width="1080px" height="300px" />
        <form style={{ textAlign: "center" }}>
          <button type="submit" onClick={this.createGame}>
            Create Game
          </button>
          <p />
          <button type="submit" onClick={this.joinGame}>
            Join Game
          </button>
        </form>
      </div>
    );
  }
}

export { Home };
