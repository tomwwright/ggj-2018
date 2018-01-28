import * as React from "react";
import { inject, observer } from "mobx-react";

import { GameStore } from "stores/game";

type RadioButtonProps = {
  name: string;
  value: string;
  gameStore?: GameStore;
};

const SwitchDeviceComponent: React.StatelessComponent<RadioButtonProps> = props => (
  <React.Fragment>
    <img
      style={{ cursor: "pointer", width: "21%", margin: "2%" }}
      onClick={() => {
        if (props.gameStore.currentTurn.deviceState[props.name] != props.value) {
          props.gameStore.setDeviceState(props.name, props.value);
          navigator.vibrate(100);
        }
      }}
      src={
        props.gameStore.currentTurn.deviceState[props.name] == props.value
          ? "/assets/device_switch_on.svg"
          : "/assets/device_switch_off.svg"
      }
    />
  </React.Fragment>
);

export const SwitchDevice = inject("gameStore")(observer(SwitchDeviceComponent));
