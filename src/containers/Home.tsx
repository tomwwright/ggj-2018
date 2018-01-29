import * as React from "react";
import { Redirect } from "react-router";
import { inject, observer } from "mobx-react";
import { GameStore } from "../stores/game";
import * as shortid from "shortid";

type CreateGameState = {
  redirect: string;
};

class Home extends React.Component<{}, CreateGameState> {
  state = {
    redirect: null
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
    this.setState({ redirect: `/tv/${token}` });
  };

  joinGame = (): void => {
    this.setState({ redirect: "/join" });
  };

  public render() {
    if (this.state.redirect) {
      return <Redirect push to={{ pathname: this.state.redirect }} />;
    }
    return (
      <div style={this.homeStyle}>
        <img src="/sigil.png" alt="flocking up together sigil" height="40%" />
        <form style={{ marginTop: "10%", textAlign: "center" }}>
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
