import { TextField } from "@mui/material";
import { TaskOption } from "@shared/types.js";
import { useEffect, useState } from "react";

type TaskNotesProps = {
  selectedTask: TaskOption | null;
};

export function TaskNotes(props: TaskNotesProps) {
  const [currentNotes, setCurrentNotes] = useState<string | null>(null);

  useEffect(() => {
    setCurrentNotes(null);
  }, [props.selectedTask]);

  return (
    <TextField
      id="outlined-basic"
      variant="outlined"
      onChange={(event) => setCurrentNotes(event.target.value)} // Update local state only
      value={currentNotes || ""}
      sx={{
        width: "250px",
        backgroundColor: currentNotes === null ? "gray" : "white",
      }}
    />
  );
}
