import * as React from "react";
import { inject, observer } from "mobx-react";

import { TvStore } from "stores/tv";
import { GameStore } from "stores/game";

import { seq } from "utils";

type TvEndTurnProps = {
  tvStore?: TvStore;
  gameStore?: GameStore;
};

const TvEndTurnComponent: React.StatelessComponent<TvEndTurnProps> = ({ gameStore, tvStore }) => (
  <React.Fragment>
    <p>Flocking Up Together ({gameStore.token})</p>
    <p>
      Lives:
      {" " +
        seq(gameStore.round.lives)
          .map(i => (i <= gameStore.round.usedLives ? "[x]" : "[ ]"))
          .join(" ")}
    </p>
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
    <React.Fragment>
      <p>Results:</p>
      <ul>
        {gameStore.devices
          .filter((device, i) => i < tvStore.deviceStateListCount)
          .map((device, i) => (
            <li key={i}>
              {device.name} == {gameStore.currentTurn.targetState[device.name]}? [{gameStore
                .currentTurn.deviceState[device.name] ==
              gameStore.currentTurn.targetState[device.name]
                ? "YES"
                : "NO"}] ({gameStore.currentTurn.deviceState[device.name]})
            </li>
          ))}
      </ul>
    </React.Fragment>
  </React.Fragment>
);

export const TvEndTurn = inject("tvStore", "gameStore")(observer(TvEndTurnComponent));
