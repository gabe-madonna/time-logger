import { Button } from "@mui/material";
import { CurrentTaskLog } from "@shared/types.js";
import { validTaskEndDate } from "./EndTimeLabel.js";

type LogButtonProps = {
  // active: boolean;
  currentLog: CurrentTaskLog;
  // currentTaskSubtype: string | null;
  // dateStart: Date; // start time of current task
  onClick: () => void;
  lastLogEnd: Date | null;
};

function validTaskLog(
  currentLog: CurrentTaskLog,
  lastLogEnd: Date | null
): boolean {
  const validType =
    currentLog.type !== null && validTaskEndDate(currentLog, lastLogEnd);
  return validType;
}

// type LogTaskToDatabaseProps = {
//   taskOption: TaskOption;
//   taskSubtype: string | null;
//   dateStart: Date;
//   notes: string | null;
// };

// function logTaskToDatabase({
//   taskOption,
//   taskSubtype,
//   dateStart,
//   notes,
// }: LogTaskToDatabaseProps): Promise<void> {
//   return new Promise((resolve) => {
//     const taskLog: TaskLog = {
//       type: taskOption.type,
//       subtype: taskSubtype,
//       dateStart: dateStart,
//       dateEnd: new Date(),
//       notes: notes,
//     };
//     resolve();
//   });
// }

export function LogButton({ currentLog, onClick, lastLogEnd }: LogButtonProps) {
  // const queryClient = useQueryClient();
  // const logTask = useMutation({
  //   mutationFn: logTaskToDatabase,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["taskLogs"] });
  //   },
  // });

  return (
    <Button
      disabled={!validTaskLog(currentLog, lastLogEnd)}
      onClick={onClick}
      // onClick={() => {
      //   if (props.currentTaskOption) {
      //     logTask.mutate({
      //       taskOption: props.currentTaskOption,
      //       taskSubtype: props.currentTaskSubtype,
      //       dateStart: props.dateStart,
      //       notes: props.notes,
      //     });
      //     props.onClick(); // should this be after or before the task logging?
      //   }
      // }}
      sx={{
        backgroundColor: validTaskLog(currentLog, lastLogEnd)
          ? "white"
          : "gray",
        color: "black",
      }}
    >
      Log Task
    </Button>
  );
}
