import * as React from "react";
import { inject, observer } from "mobx-react";

import { TvStore } from "stores/tv";
import { GameStore } from "stores/game";

import { seq } from "utils";
import ReactPlayer from "react-player";

type TvEndTurnProps = {
  tvStore?: TvStore;
  gameStore?: GameStore;
};

type TurnDeviceSuccessProps = {
  deviceName: string;
  targetState: string;
  deviceState: string;
  key: number;
};

const TurnDeviceSuccess: React.StatelessComponent<TurnDeviceSuccessProps> = props => {
  const isSuccess = props.deviceState == props.targetState;
  const soundUrlToPlay = isSuccess ? "/assets/round_yah.ogg" : "/assets/round_nah.ogg";
  const successMessage = isSuccess ? "YES" : "NO";

  return (
    <li key={props.key}>
      <p>
        {props.deviceName} == {props.targetState}? [{successMessage}] ({props.deviceState})
      </p>
      <ReactPlayer url={soundUrlToPlay} preload="auto" playing width={0} height={0} />
    </li>
  );
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
            <TurnDeviceSuccess
              key={i}
              deviceName={device.name}
              targetState={gameStore.currentTurn.targetState[device.name]}
              deviceState={gameStore.currentTurn.deviceState[device.name]}
            />
          ))}
      </ul>
    </React.Fragment>
  </React.Fragment>
);

export const TvEndTurn = inject("tvStore", "gameStore")(observer(TvEndTurnComponent));
