export type TaskOption = {
  task: "coding" | "eating";
  type: "work" | "chore";
};

export type TaskLog = TaskOption & {
  dateStart: Date;
  dateEnd: Date;
};
