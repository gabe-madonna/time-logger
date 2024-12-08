import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskDatabase, setTaskDatabase } from "./App.js";
import { TaskLog, TaskOption } from "@shared/types.js";

type LogButtonProps = {
  active: boolean;
  currentTask: TaskOption | null;
  dateStart: Date; // start time of current task
  notes: String | null;
  onClick: () => void;
};

type LogTaskToDatabaseProps = {
  taskOption: TaskOption;
  dateStart: Date;
  notes: String | null;
};

function logTaskToDatabase({
  taskOption,
  dateStart,
  notes,
}: LogTaskToDatabaseProps): Promise<void> {
  return new Promise((resolve) => {
    const taskLog: TaskLog = {
      ...taskOption,
      dateStart: dateStart,
      dateEnd: new Date(),
      notes: notes,
    };
    setTaskDatabase(taskLog);
    resolve();
  });
}

export function LogButton(props: LogButtonProps) {
  const queryClient = useQueryClient();
  const logTask = useMutation({
    mutationFn: logTaskToDatabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <Button
      disabled={!props.active}
      onClick={() => {
        if (props.currentTask) {
          logTask.mutate({
            taskOption: props.currentTask,
            dateStart: props.dateStart,
            notes: props.notes,
          });
          props.onClick(); // should this be after or before the task logging?
        }
      }}
      sx={{
        backgroundColor: props.currentTask ? "white" : "gray",
        color: "black",
      }}
    >
      Log Task
    </Button>
  );
}
