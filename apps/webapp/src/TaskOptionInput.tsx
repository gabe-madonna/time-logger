import { useRef } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { CurrentTaskLog, TaskLog } from "@shared/types.js";

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
  currentLog: CurrentTaskLog;
  types: string[];
  onTypeSelected: (newType: string | null) => void;
};

export function TaskInput({
  currentLog,
  types,
  onTypeSelected,
}: TaskInputProp) {
  // const [options, setOptions] = useState<TaskOption[]>([]);
  // const [options, setOptions] = useState<string[]>([]);
  // const [error, setError] = useState<string | null>(null);

  // if (error) {
  //   return (
  //     <TextField
  //       disabled
  //       label="Error"
  //       value={error}
  //       sx={{ width: "120%", maxWidth: "1000px", backgroundColor: "gray" }}
  //     />
  //   );
  // }

  return (
    <Autocomplete
      disablePortal
      options={types}
      value={currentLog.type}
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
            backgroundColor: currentLog.type === null ? "gray" : "white",
          }}
        />
      )}
      // getOptionLabel={(t) => t}
      onChange={(event, newType) => {
        onTypeSelected(newType);
      }}
      color="#000000" // doesnt seem to change anything...
      slotProps={{
        popper: {
          sx: {
            "& .MuiAutocomplete-paper": {
              maxHeight: "150px", // Limit height of the dropdown
              // overflowY: "auto", // Add scroll if items exceed height
            },
          },
        },
      }}
      // onFocus={() => {
      //   const selectRef = useRef<HTMLDivElement>(null);

      //   if (selectRef.current) {
      //     selectRef.current.scrollIntoView({
      //       behavior: "smooth",
      //       block: "center",
      //     });
      //   }
      // }}
      // onOpen={() => {
      //   window.scrollTo({
      //     top: document.activeElement?.getBoundingClientRect().top || 0,
      //     behavior: "smooth",
      //   });
      // }}
    />
  );
}
