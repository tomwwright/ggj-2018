export type ObjectWithId = {
  id?: string;
};

export type Game = ObjectWithId & {
  players: string[];
  currentRound: number;
  currentTurn: number;
  devices: Device[];
  rounds: Round[];
  turns: number[];
};

export type Device = ObjectWithId & {
  name: string;
  colour: string;
  type: string;
  playerName: string;
};

export type Instruction = ObjectWithId & {
  player: string;
  device: string;
  targetState: string;
  targetTurn: number;
};

export type Round = ObjectWithId & {
  currentTurn: number;
  numTurns: number;
  turnDuration: number;
  difficulty: number;
  lives: number;
  usedLives: number;
};

export type Turn = ObjectWithId & {
  targetState: { [device: string]: string };
  deviceState: { [device: string]: string };
  instructions: Instruction[];
};
