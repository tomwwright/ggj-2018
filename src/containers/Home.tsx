import * as React from "react";
import { Redirect } from "react-router";
import { inject, observer } from "mobx-react";
import { GameStore } from "../stores/game";
import * as shortid from "shortid";

type CreateGameState = {
  redirect: boolean;
};

class Home extends React.Component<{}, CreateGameState> {
  state = {
    redirect: false
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
    console.log("pre redirect", token);
    this.setState({ redirect: true });
  };

  joinGame = (): void => {
    this.setState({ redirect: true });
  };

  public render() {
    if (!!this.state.redirect) {
      return <Redirect push to={{ pathname: `/join` }} />;
    }
    return (
      <React.Fragment>
        <h2>Welcome to OWL GAME THING</h2>
        <form>
          <button type="submit" onClick={this.createGame}>
            Create Game
          </button>
          <button type="submit" onClick={this.joinGame}>
            Join Game
          </button>
        </form>
      </React.Fragment>
    );
  }
}

export { Home };
