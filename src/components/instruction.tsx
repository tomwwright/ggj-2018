import * as React from "react";

import { Instruction } from "models";

type InstructionProps = {
  instruction: Instruction;
};

export const InstructionComponent: React.StatelessComponent<InstructionProps> = ({
  instruction
}) => (
  <div>
    <p>
      Instruction: Set the {instruction.device} to {instruction.targetState} in Turn{" "}
      {instruction.targetTurn}!
    </p>
  </div>
);
