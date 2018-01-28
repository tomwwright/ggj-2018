import * as React from "react";
import { inject, observer } from "mobx-react";
import { Redirect } from "react-router";
import { GameStore } from "stores/game";
import { JoinGame } from "containers/JoinGame";
import { Splash } from "containers/splash";
import { DeviceComponent } from "components/device";
import { SwitchDevice } from "components/device/switch";
import { InstructionComponent } from "components/instruction";

type PlayAppProps = {
  playerName: string;
  gameStore?: GameStore;
};

const playButtonStyle = {
  marginTop: "125%"
};

const PlayAppComponent: React.StatelessComponent<PlayAppProps> = ({ gameStore, playerName }) => {
  gameStore.setPlayerName(playerName);

  if (!gameStore.game.players.find(player => player == gameStore.playerName)) {
    return <Redirect to={`/join/${gameStore.token}`} />;
  }

  if (gameStore.game.state == "lobby" && gameStore.isGameAdmin) {
    return (
      <Splash>
        <button style={playButtonStyle} onClick={() => gameStore.setGameState("start")}>
          Play!
        </button>
      </Splash>
    );
  }

  if (gameStore.game.state != "playing") {
    return (
      <Splash>
        <h3>Look up</h3>
      </Splash>
    );
  }

  if (!gameStore.currentTurn || !gameStore.devices || !gameStore.instructions) {
    return (
      <React.Fragment>
        <Splash spinner={true}>
          <h3>Loading...</h3>
        </Splash>
      </React.Fragment>
    );
  }

  const device = gameStore.devices.find(device => device.playerName == gameStore.playerName);

  return (
    <React.Fragment>
      <div style={{ position: "absolute", width: "100%" }}>
        <img src="/playerscreens/terminal.png" style={{ maxWidth: "100%" }} />
        <img src="/playerscreens/switches_bg.png" style={{ maxWidth: "100%" }} />
        <DeviceComponent device={device} turnNumber={gameStore.round.currentTurn} />
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "10%",
            width: "80%"
          }}
        >
          {gameStore.instructions
            .filter(instruction => instruction.player == gameStore.playerName)
            .map((instruction, i) => (
              <InstructionComponent
                key={i}
                instruction={instruction}
                device={gameStore.devices.find(device => device.name == instruction.device)}
              />
            ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export const PlayApp = inject("gameStore")(observer(PlayAppComponent));
