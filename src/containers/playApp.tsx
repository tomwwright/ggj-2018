import * as React from "react";
import { inject, observer } from "mobx-react";

import { GameStore } from "stores/game";
import { JoinGame } from "containers/JoinGame";
import { Splash } from "containers/splash";
import { DeviceComponent } from "components/device";
import { InstructionComponent } from "components/instruction";

type PlayAppProps = {
  playerName: string;
  gameStore?: GameStore;
};

const PlayAppComponent: React.StatelessComponent<PlayAppProps> = ({ gameStore, playerName }) => {
  gameStore.setPlayerName(playerName);

  if (!gameStore.currentTurn || !gameStore.devices || !gameStore.instructions) {
    return (
      <React.Fragment>
        <p>Loading stuff...</p>
      </React.Fragment>
    );
  }

  if (gameStore.game.state != "playing") {
    return <Splash />;
  }

  const device = gameStore.devices.find(device => device.playerName == gameStore.playerName);

  return (
    <React.Fragment>
      <p>
        Play App ({gameStore.playerName}, {gameStore.token})
      </p>
      <p>Round: {gameStore.game.currentRound}</p>
      <p>
        Turn: {gameStore.round.currentTurn.toString()} / {gameStore.round.numTurns}
      </p>
      <DeviceComponent
        device={device}
        state={gameStore.currentTurn.deviceState[device.name]}
        setState={state => gameStore.setDeviceState(device.name, state)}
      />
      <p>----</p>
      {gameStore.instructions
        .filter(instruction => instruction.player == gameStore.playerName)
        .map((instruction, i) => <InstructionComponent key={i} instruction={instruction} />)}
    </React.Fragment>
  );
};

export const PlayApp = inject("gameStore")(observer(PlayAppComponent));
