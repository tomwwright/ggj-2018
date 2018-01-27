import * as React from "react";
import { inject, observer } from "mobx-react";

import { TvStore } from "stores/tv";
import { GameStore } from "stores/game";

import { seq } from "utils";

type TvMainProps = {
  tvStore?: TvStore;
  gameStore?: GameStore;
};

const TvMainComponent: React.StatelessComponent<TvMainProps> = ({ gameStore, tvStore }) => (
  <React.Fragment>
    <p>Flocking Up Together ({gameStore.token})</p>
    <ul>{gameStore.game.players.map((player, i) => <li key={i}>{player}</li>)}</ul>
    <p>
      Lives:
      {" " +
        seq(gameStore.round.lives)
          .map(i => (i <= gameStore.round.usedLives ? "[x]" : "[ ]"))
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

export const TvMain = inject("tvStore", "gameStore")(observer(TvMainComponent));
