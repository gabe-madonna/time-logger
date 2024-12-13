import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { TaskLog, TaskOption } from "@shared/types.js";
import { getTaskOptions } from "./App.js";

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

type TaskInputProp = {
  selectedTask: TaskOption | null;
  onTaskSelected: (taskOption: TaskOption | null) => void;
};

export function TaskInput(props: TaskInputProp) {
  const [options, setOptions] = useState<TaskOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getTaskOptions2() {
      try {
        const options: TaskOption[] = await getTaskOptions();
        setOptions(options);
      } catch {
        setError("Failed to fetch task options");
      }
    }

    getTaskOptions2();
  }, []);

  if (error) {
    return (
      <TextField
        disabled
        label="Error"
        value={error}
        sx={{ width: "120%", maxWidth: "1000px", backgroundColor: "gray" }}
      />
    );
  }

  return (
    <Autocomplete
      disablePortal
      options={options}
      value={props.selectedTask}
      // sx={{ width: 300 }}
      sx={{
        width: "100%", // Full-width layout
        // width: "120%", // Full-width layout
        maxWidth: "1000px",
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{
            backgroundColor: props.selectedTask ? "white" : "gray",
          }}
        />
      )}
      getOptionLabel={(option) => option.type}
      onChange={(event, newTask) => {
        props.onTaskSelected(newTask);
      }}
      color="#000000" // doesnt seem to change anything...
    />
  );
}
