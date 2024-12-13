export type TaskOption = {
  type: string;
  subtypes: string[];
};

export type TaskLog = {
  _id?: string;
  type: string;
  subtype: string | null;
  dateStart: Date;
  dateEnd: Date;
  notes: string | null;
};

export type CurrentTaskLog = Omit<TaskLog, "dateEnd">;
