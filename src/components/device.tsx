import * as React from "react";

import { Device } from "models";

type DeviceProps = {
  device: Device;
  state: string;
  setState: (newState: string) => void;
};

export const DeviceComponent: React.StatelessComponent<DeviceProps> = props => (
  <div>
    <p>
      Device: {props.device.name}, {props.device.playerName}, {props.device.type},{" "}
      {props.device.colour}
    </p>
    <p>
      <input value={props.state} onChange={event => props.setState(event.target.value)} />
    </p>
  </div>
);
