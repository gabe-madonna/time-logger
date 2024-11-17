export type TaskOption = {
  task: "coding" | "eating";
  type: "work" | "chore";
};

export type TaskLog = TaskOption & {
  _id?: String;
  dateStart: Date;
  dateEnd: Date;
};
