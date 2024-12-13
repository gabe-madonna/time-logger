import { TextField } from "@mui/material";
import { TaskOption } from "@shared/types.js";
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";

type TaskNotesProps = {
  selectedTask: TaskOption | null;
  onGetNotes: (getNotes: () => string | null) => void; // Provide a callback for the parent
  // onNotesChange: (notes: string | null) => void;  // always keep parent up to date on notes value.
  // // not needed if we just reference it at time of task logging though...
};

// export const TaskNotes = forwardRef((props: TaskNotesProps, ref: TaskNotesRef) => {
export function TaskNotes({ selectedTask, onGetNotes }: TaskNotesProps) {
  const [currentNotes, setCurrentNotes] = useState<string | null>(null);

  useEffect(() => {
    setCurrentNotes(null);
  }, [selectedTask]);

  // Provide the getNotes function to the parent
  useEffect(() => {
    onGetNotes(() => currentNotes);
  }, [onGetNotes, currentNotes]);

  return (
    <TextField
      id="outlined-basic"
      variant="outlined"
      onChange={(event) => setCurrentNotes(event.target.value)} // Update local state only
      value={currentNotes || ""}
      sx={{
        width: "100%",
        backgroundColor: currentNotes === null ? "gray" : "white",
      }}
    />
  );
}
