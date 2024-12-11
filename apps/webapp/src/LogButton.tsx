import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "./App.js";
import { TaskLog, TaskOption } from "@shared/types.js";

async function saveTaskLog(log: TaskLog) {
  try {
    // Send task to the API endpoint
    console.log(`Sending request to ${apiUrl}`);
    const response = fetch(apiUrl + "/logs/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(log),
    });

    // If successful, update the local task database
  } catch (error) {
    console.error("Error while sending tasks to the API:", error);
  }
}

type LogButtonProps = {
  active: boolean;
  currentTaskOption: TaskOption | null;
  currentTaskSubtype: string | null;
  dateStart: Date; // start time of current task
  notes: string | null;
  onClick: () => void;
};

type LogTaskToDatabaseProps = {
  taskOption: TaskOption;
  taskSubtype: string | null;
  dateStart: Date;
  notes: string | null;
};

function logTaskToDatabase({
  taskOption,
  taskSubtype,
  dateStart,
  notes,
}: LogTaskToDatabaseProps): Promise<void> {
  return new Promise((resolve) => {
    const taskLog: TaskLog = {
      type: taskOption.type,
      subtype: taskSubtype,
      dateStart: dateStart,
      dateEnd: new Date(),
      notes: notes,
    };
    saveTaskLog(taskLog);
    resolve();
  });
}

export function LogButton(props: LogButtonProps) {
  const queryClient = useQueryClient();
  const logTask = useMutation({
    mutationFn: logTaskToDatabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLogs"] });
    },
  });

  return (
    <Button
      disabled={props.currentTaskOption === null}
      onClick={() => {
        if (props.currentTaskOption) {
          logTask.mutate({
            taskOption: props.currentTaskOption,
            taskSubtype: props.currentTaskSubtype,
            dateStart: props.dateStart,
            notes: props.notes,
          });
          props.onClick(); // should this be after or before the task logging?
        }
      }}
      sx={{
        backgroundColor: props.currentTaskOption === null ? "gray" : "white",
        color: "black",
      }}
    >
      Log Task
    </Button>
  );
}
