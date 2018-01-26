export type ObjectWithId = {
  id?: string;
};

export type Game = ObjectWithId & {
  turn: number;
  players: string[];
};
