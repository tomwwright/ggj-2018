import * as React from "react";
import { inject, observer } from "mobx-react";

import { TvStore } from "stores/tv";
import { GameStore } from "stores/game";

import { seq } from "utils";

type TvMainProps = {
  tvStore?: TvStore;
  gameStore?: GameStore;
};

type PreviousTurnDeviceSuccessProps = {
  deviceName: string;
  targetState: string;
  deviceState: string;
  key: number;
};

const PreviousTurnDeviceSuccess: React.StatelessComponent<
  PreviousTurnDeviceSuccessProps
> = props => {
  const isSuccess = props.deviceState == props.targetState;
  const soundUrlToPlay = isSuccess ? "/assets/test.wav" : "/assets/test.wav";
  const successMessage = isSuccess ? "YES" : "NO";

  return (
    <li key={props.key} style={{ listStyle: "none" }}>
      <p>
        {props.deviceName} == {props.targetState}? [{successMessage}] ({props.deviceState})
      </p>
    </li>
  );
};

const TurnDeviceSuccess: React.StatelessComponent<PreviousTurnDeviceSuccessProps> = props => {
  const isSuccess = props.deviceState == props.targetState;
  const soundUrlToPlay = isSuccess ? "/assets/test.wav" : "/assets/test.wav";
  const successMessage = isSuccess ? "YES" : "NO";

  return (
    <li key={props.key}>
      <p>
        {props.deviceName} == {props.targetState}?
      </p>
      <p>
        [{successMessage}] ({props.deviceState})
      </p>
    </li>
  );
};

const TvMainComponent: React.StatelessComponent<TvMainProps> = ({ gameStore, tvStore }) => {
  const renderLives = seq(gameStore.round.lives)
    .map(i => (i <= gameStore.round.usedLives ? "[x]" : "[ ]"))
    .join(" ");

  return (
    <React.Fragment>
      <div>
        <p>Flocking Up Together ({gameStore.token})</p>
        <ul>{gameStore.game.players.map((player, i) => <li key={i}>{player}</li>)}</ul>
        <p>
          Lives:
          {" " + renderLives}
        </p>
        <p>Turn Time: {tvStore.turnTime}s</p>
        <p>---</p>
        <p>Devices</p>
        <ul style={{ listStyle: "none" }}>
          {gameStore.devices.map((device, i) => (
            <li key={i} style={{ listStyle: "none" }}>
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
                <PreviousTurnDeviceSuccess
                  key={i}
                  deviceName={device.name}
                  targetState={gameStore.previousTurn.targetState[device.name]}
                  deviceState={gameStore.previousTurn.deviceState[device.name]}
                />
              ))}
            </ul>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

export const TvMain = inject("tvStore", "gameStore")(observer(TvMainComponent));
