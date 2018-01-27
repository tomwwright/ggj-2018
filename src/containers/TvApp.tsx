import * as React from "react";
import { inject, observer } from "mobx-react";

import { GameStore } from "stores/game";
import { TvStore } from "stores/tv";
import { TvLobby } from "containers/TvLobby";
import { TvStart } from "containers/TvStart";

type TvAppProps = {
  gameStore?: GameStore;
  tvStore?: TvStore;
};

function seq(size: number) {
  const arr = [];
  for (let i = 0; i < size; ++i) arr.push(i + 1);
  return arr;
}

const TvAppComponent: React.StatelessComponent<TvAppProps> = ({ gameStore, tvStore }) => {
  if (gameStore.game.state == "lobby") {
    return <TvLobby token={gameStore.token} players={gameStore.game.players} />;
  }

  if (gameStore.game.state == "start") {
    setTimeout(async () => {
      await tvStore.assignDevices();
      await tvStore.startNewRound();
    }, 1000);
    return <TvStart />;
  }

  if (!gameStore.currentTurn || !gameStore.devices || !gameStore.instructions) {
    return (
      <React.Fragment>
        <p>Loading stuff...</p>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <p>Flocking Up Together ({gameStore.token})</p>
      <ul>{gameStore.game.players.map((player, i) => <li key={i}>{player}</li>)}</ul>
      <p>
        Lives:
        {" " +
          seq(gameStore.round.lives)
            .map(i => (i < gameStore.round.usedLives ? "[x]" : "[ ]"))
            .join(" ")}
      </p>
      <p>Turn Time: {tvStore.turnTime}s</p>
      <p>---</p>
      <p>Devices</p>
      <ul>
        {gameStore.devices.map((device, i) => (
          <li key={i}>
            {device.name} set to {gameStore.currentTurn.deviceState[device.name]}
          </li>
        ))}
      </ul>
      <p>---</p>
      {!gameStore.previousTurn ? (
        <p>First turn!</p>
      ) : (
        <React.Fragment>
          <p>Last Turn:</p>
          <ul>
            {gameStore.devices.map((device, i) => (
              <li key={i}>
                {device.name} == {gameStore.previousTurn.targetState[device.name]}? [{gameStore
                  .previousTurn.deviceState[device.name] ==
                gameStore.previousTurn.targetState[device.name]
                  ? "YES"
                  : "NO"}] ({gameStore.previousTurn.deviceState[device.name]})
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export const TvApp = inject("gameStore", "tvStore")(observer(TvAppComponent));
