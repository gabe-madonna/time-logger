import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export type TaskOption = {
  task: "coding" | "eating";
  type: "work" | "chore";
};

export type TaskLog = TaskOption & {
  dateStart: Date;
  dateEnd: Date;
};

export function taskDuration(task: TaskLog): number {
  return task.dateEnd.getTime() - task.dateStart.getTime(); // Duration in milliseconds
}

export function readableTaskDuration(
  duration: number,
  showSeconds: boolean = false
) {
  const totalMinutes = Math.floor(duration / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = Math.floor(duration / 1000) % 60;
  let val = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  if (showSeconds) {
    val = val + `:${String(seconds).padStart(2, "0")}`;
  }
  return val;
}

const options: TaskOption[] = [
  { task: "coding", type: "work" },
  { task: "eating", type: "chore" },
];

type TaskInputProp = {
  selectedTask: TaskOption | null;
  onTaskSelected: (taskOption: TaskOption | null) => void;
};

export function TaskInput(props: TaskInputProp) {
  return (
    <Autocomplete
      disablePortal
      options={options}
      value={props.selectedTask}
      // sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.selectedTask ? props.selectedTask.task : "Task"}
          sx={{
            backgroundColor: props.selectedTask ? "white" : "gray",
          }}
        />
      )}
      getOptionLabel={(option) => option.task}
      onChange={(event, newTask) => {
        console.log("Added New Task: ", newTask);
        props.onTaskSelected(newTask);
      }}
      color="#000000" // doesnt seem to change anything...
    />
  );
}
