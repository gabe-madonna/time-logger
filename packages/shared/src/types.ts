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

export type CurrentTaskLog = {
  _id?: string;
  type: string | null;
  subtype: string | null;
  dateEnd: Date | null;
  notes: string | null;
};
