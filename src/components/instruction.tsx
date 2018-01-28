import * as React from "react";

import { Instruction, Device } from "models";

type InstructionProps = {
  instruction: Instruction;
  device: Device;
};

export const InstructionComponent: React.StatelessComponent<InstructionProps> = ({
  instruction,
  device
}) => (
  <p style={{ fontFamily: "Courier New", fontWeight: 500 }}>
    >> Set the <span style={{ color: device.colour }}>{instruction.device}</span> to{" "}
    {instruction.targetState} in Turn {instruction.targetTurn + 1}!
  </p>
);
