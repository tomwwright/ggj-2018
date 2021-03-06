import * as React from "react";

import { Device } from "models";

import { SwitchDevice } from "components/device/switch";

type DeviceProps = {
  device: Device;
  turnNumber: number;
};

export const DeviceComponent: React.StatelessComponent<DeviceProps> = props => (
  <React.Fragment>
    <div style={{ width: "76%", margin: "auto", position: "absolute", left: "12%", bottom: "11%" }}>
      <p
        style={{
          textAlign: "center",
          fontFamily: "Courier New",
          fontSize: "140%",
          padding: "10px",
          background: "black",
          color: "greenyellow"
        }}
      >
        <span style={{ color: props.device.colour }}>{props.device.name}</span> Turn{" "}
        {props.turnNumber}
      </p>
      <SwitchDevice name={props.device.name} value="1" />
      <SwitchDevice name={props.device.name} value="2" />
      <SwitchDevice name={props.device.name} value="3" />
      <SwitchDevice name={props.device.name} value="4" />
      <SwitchDevice name={props.device.name} value="5" />
      <SwitchDevice name={props.device.name} value="6" />
      <SwitchDevice name={props.device.name} value="7" />
      <SwitchDevice name={props.device.name} value="8" />
    </div>
  </React.Fragment>
);
