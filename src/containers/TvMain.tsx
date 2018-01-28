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
    <div style={{ fontSize: "24px" }}>
      <div style={{ position: "absolute", left: "0", right: "0", margin: "12px" }}>
        Turn Time: {tvStore.turnTime ? `${tvStore.turnTime}s` : "--"}
      </div>
      <div style={{ position: "absolute", left: "0px", top: "0px", margin: "12px" }}>
        Round: {gameStore.game.currentRound + 1}
      </div>
      <div style={{ position: "absolute", right: "0px", top: "0px", margin: "12px" }}>
        Turn: {gameStore.round.currentTurn ? gameStore.round.currentTurn + 1 : 0}
      </div>
      <div style={{ position: "absolute", right: "0px", top: "50px", margin: "12px" }}>
        Strikes: {gameStore.round.lives - gameStore.round.usedLives} / {gameStore.round.lives}
      </div>
      <div
        style={{
          position: "absolute",
          left: "0",
          right: "0",
          top: 0,
          bottom: 0,
          height: "400px",
          margin: "auto"
        }}
      >
        {gameStore.devices.map((device, i) => (
          <p>
            {device.name} set to {gameStore.currentTurn.deviceState[device.name]}
          </p>
        ))}
      </div>
    </div>
  );
};

export const TvMain = inject("tvStore", "gameStore")(observer(TvMainComponent));
