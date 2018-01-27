import * as React from "react";

import { Device } from "models";

import { SwitchDevice } from "components/device/switch";

type DeviceProps = {
  device: Device;
};

export const DeviceComponent: React.StatelessComponent<DeviceProps> = props => (
  <React.Fragment>
    <SwitchDevice name={props.device.name} value="1" />
    <SwitchDevice name={props.device.name} value="2" />
    <SwitchDevice name={props.device.name} value="3" />
    <SwitchDevice name={props.device.name} value="4" />
    <SwitchDevice name={props.device.name} value="5" />
  </React.Fragment>
);
