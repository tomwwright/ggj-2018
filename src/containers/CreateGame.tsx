import * as React from "react";
import { Redirect } from "react-router";

class CreateGame extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      token: "",
      redirect: false
    };
  }

  isTokenValid = (): boolean => {
    //TODO: check this against existing game ids on Firebase
    if (this.state.token.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  update = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({
      token: e.currentTarget.value
    });
  };

  handleGameToken = (): void => {
    // if valid token, route
    if (this.isTokenValid()) {
      this.setState({ redirect: true });
    }
  };

  public render() {
    if (!!this.state.redirect) {
      return <Redirect push to={{ pathname: `/play/${this.state.token}` }} />;
    }
    return (
      <React.Fragment>
        <h2>Welcome to OWL GAME THING</h2>
        <div>Give you game a unique name:</div>
        <div>NAME FIELD GOES HERE</div>
        <form>
          <input
            placeholder="Unique Game Name"
            type="text"
            name="token"
            value={this.state.token}
            onChange={this.update}
          />
          <button type="submit" onClick={this.handleGameToken}>
            Submit
          </button>
        </form>
      </React.Fragment>
    );
  }
}

export { CreateGame };
