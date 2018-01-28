import * as React from "react";

import { Device } from "models";

import { SwitchDevice } from "components/device/switch";

type DeviceProps = {
  device: Device;
};

export const DeviceComponent: React.StatelessComponent<DeviceProps> = props => (
  <React.Fragment>
    <div style={{ width: "90%", margin: "auto" }}>
      <SwitchDevice name={props.device.name} value="1" />
      <SwitchDevice name={props.device.name} value="2" />
      <SwitchDevice name={props.device.name} value="3" />
      <SwitchDevice name={props.device.name} value="4" />
    </div>
  </React.Fragment>
);
