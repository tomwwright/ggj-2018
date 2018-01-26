export type ObjectWithId = {
  id?: string;
};

export type Game = ObjectWithId & {
  players: string[];
  currentRound: number;
  devices: Device[];
  rounds: Round[];
};

export type Device = {
  name: string;
  colour: string;
  type: string;
  playerName: string;
};

export type Instruction = {
  player: string;
  device: string;
  targetState: string;
  targetTurn: number;
};

export type Round = {
  currentTurn: number;
  numTurns: number;
  turnDuration: number;
  difficulty: number;
  lives: number;
  usedLives: number;
  turns: Turn[];
};

export type Turn = {
  targetState: { [device: string]: string };
  deviceState: { [device: string]: string };
  instructions: Instruction[];
};
