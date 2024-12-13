import { TextField } from "@mui/material";
import { CurrentTaskLog, TaskOption } from "@shared/types.js";
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";

type TaskNotesProps = {
  currentLog: CurrentTaskLog;
  // onGetNotes: (getNotes: () => string | null) => void; // Provide a callback for the parent
  onChange: (notes: string | null) => void;
  // onNotesChange: (notes: string | null) => void;  // always keep parent up to date on notes value.
  // // not needed if we just reference it at time of task logging though...
};

// export const TaskNotes = forwardRef((props: TaskNotesProps, ref: TaskNotesRef) => {
export function TaskNotes({
  currentLog,
  // onGetNotes,
  onChange,
}: TaskNotesProps) {
  // const [currentNotes, setCurrentNotes] = useState<string | null>(null);

  // useEffect(() => {
  //   setCurrentNotes(null);
  // }, [currentLog]);

  // // Provide the getNotes function to the parent
  // useEffect(() => {
  //   onGetNotes(() => currentNotes);
  // }, [onGetNotes, currentNotes]);

  return (
    <TextField
      id="outlined-basic"
      variant="outlined"
      onChange={(event) => {
        // setCurrentNotes(event.target.value);
        onChange(event.target.value);
      }} // Update local state only
      value={currentLog.notes || ""}
      sx={{
        width: "100%",
        backgroundColor: currentLog.notes ? "white" : "gray",
      }}
    />
  );
}
