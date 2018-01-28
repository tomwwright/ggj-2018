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
    <div style={{ fontSize: "24px" }}>
      <div style={{ position: "absolute", left: "0px", top: "0px", margin: "12px" }}>
        Round: {gameStore.game.currentRound + 1}
      </div>
      <div style={{ position: "absolute", right: "0px", top: "0px", margin: "12px" }}>
        Turn: {gameStore.game.currentTurn ? gameStore.game.currentTurn + 1 : 0}
      </div>
      <div style={{ position: "absolute", right: "0px", top: "50px", margin: "12px" }}>
        Strikes: {gameStore.round.lives - gameStore.round.usedLives} / {gameStore.round.lives}
      </div>

      <React.Fragment>
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
        </div>
      </React.Fragment>
    </div>
  </React.Fragment>
);

export const TvEndTurn = inject("tvStore", "gameStore")(observer(TvEndTurnComponent));
