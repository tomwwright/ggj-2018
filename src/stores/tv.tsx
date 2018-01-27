import { observable, action, computed, autorun } from "mobx";

import { Game, Device, Round, Turn, Instruction } from "models";

export class TvStore {
  @observable turnTime: number = 20;
}
