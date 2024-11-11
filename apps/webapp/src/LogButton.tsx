import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskDatabase, setTaskDatabase } from "./App";
import { TaskOption, TaskLog } from "./TaskInput";

type LogButtonProps = {
  active: boolean;
  currentTask: TaskOption | null;
  dateStart: Date; // start time of current task
  onClick: () => void;
};

type LogTaskToDatabaseProps = {
  taskOption: TaskOption;
  dateStart: Date;
};

function logTaskToDatabase({
  taskOption,
  dateStart,
}: LogTaskToDatabaseProps): Promise<void> {
  return new Promise((resolve) => {
    const taskLog: TaskLog = {
      ...taskOption,
      dateStart: dateStart,
      dateEnd: new Date(),
    };
    setTaskDatabase([taskLog]);
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
