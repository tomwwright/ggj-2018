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

const PlayAppComponent: React.StatelessComponent<PlayAppProps> = ({ gameStore, playerName }) => {
  gameStore.setPlayerName(playerName);

  if (!gameStore.game.players.find(player => player == gameStore.playerName)) {
    return <Redirect to={`/join/${gameStore.token}`} />;
  }

  if (gameStore.game.state == "lobby" && gameStore.isGameAdmin) {
    return (
      <Splash>
        <button onClick={() => gameStore.setGameState("start")}>Play!</button>
      </Splash>
    );
  }

  if (gameStore.game.state != "playing") {
    return <Splash />;
  }

  if (!gameStore.currentTurn || !gameStore.devices || !gameStore.instructions) {
    return (
      <React.Fragment>
        <p>Loading stuff...</p>
      </React.Fragment>
    );
  }

  const device = gameStore.devices.find(device => device.playerName == gameStore.playerName);

  return (
    <React.Fragment>
      <p>
        Play App ({gameStore.playerName}, {gameStore.token})
      </p>
      <p>Round: {gameStore.game.currentRound}</p>
      <p>
        Turn: {(gameStore.round.currentTurn + 1).toString()} / {gameStore.round.numTurns}
      </p>
      <DeviceComponent device={device} />
      <p>----</p>
      {gameStore.instructions
        .filter(instruction => instruction.player == gameStore.playerName)
        .map((instruction, i) => <InstructionComponent key={i} instruction={instruction} />)}
    </React.Fragment>
  );
};

export const PlayApp = inject("gameStore")(observer(PlayAppComponent));
