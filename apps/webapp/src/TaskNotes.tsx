import { TextField } from "@mui/material";

type TaskNotesProps = {
  selectedTask: boolean;
  onChange: (notes: String | null) => void;
};

export function TaskNotes(props: TaskNotesProps) {
  return (
    <TextField
      id="outlined-basic"
      label="Notes"
      variant="outlined"
      onChange={(event) => {
        props.onChange(event.target.value);
      }}
      sx={{
        backgroundColor: props.selectedTask ? "white" : "gray",
      }}
    />
  );
}
