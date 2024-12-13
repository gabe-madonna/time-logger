import { useEffect, useState } from "react";
import "./App.css";
import {
  TaskInput,
  taskDuration,
  readableTaskDuration,
} from "./TaskOptionInput.js";
import { SubtypeInput } from "./TaskSubtypeInput.js";
import { TaskNotes } from "./TaskNotes.js";
import { LogButton } from "./LogButton.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CircularProgress, duration } from "@mui/material";
import { StartTimeLabel } from "./StartTimeLabel.js";
import { DurationTimeLabel } from "./DurationTimeLabel.js";
import { TaskLog, TaskOption } from "@shared/types.js";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export let taskLogs: TaskLog[] = [];
export const apiUrl = import.meta.env.VITE_BACKEND_URL;

async function getTaskLogs(): Promise<TaskLog[]> {
  console.log("Getting all tasks");
  const response = await fetch(apiUrl + "/logs/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("Got all tasks");

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  // convert dates from strings...sigh
  const logs: TaskLog[] = (await response.json()).map((log: any) => ({
    _id: log._id,
    dateStart: new Date(log.dateStart),
    dateEnd: new Date(log.dateEnd),
    type: log.type,
    subtype: log.subtype,
    notes: log.notes,
  }));

  console.log("Got task logs on frontend");
  console.log(logs);
  return logs;
}

async function saveTaskLog(log: TaskLog): Promise<TaskLog> {
  try {
    // Send task to the API endpoint
    const response = await fetch(apiUrl + "/logs/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(log),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const logRaw: any = (await response.json()).log;
    const logFinal: TaskLog = {
      _id: logRaw._id,
      dateStart: new Date(logRaw.dateStart),
      dateEnd: new Date(logRaw.dateEnd),
      type: logRaw.type,
      subtype: logRaw.subtype,
      notes: logRaw.notes,
    };

    return logFinal;

    // If successful, update the local task database
  } catch (error) {
    console.error("Error while sending tasks to the API:", error);
    throw error;
  }
}

const theme = createTheme({
  typography: {
    fontFamily: "'Fira Code', monospace",
  },
});

function logSummaryString(log: TaskLog): string {
  const subtype: string = log.subtype === null ? "" : " (" + log.subtype + ")";
  const duration: string = readableTaskDuration(taskDuration(log));
  const notes: string = log.notes ? `  "${log.notes}"` : "";

  // const logString: string = duration + " " + log.type + subtype + notes;
  const logString: string = log.type + subtype + notes;
  return logString;
}

export async function getTaskOptions(): Promise<TaskOption[]> {
  const response = await fetch(apiUrl + "/options/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const options: TaskOption[] = await response.json();
  return options;
}

function App() {
  console.log("Running App Loop");
  const [selectedTask, setSelectedTask] = useState<TaskOption | null>(null);
  const [selectedTaskSubtype, setSelectedTaskSubtype] = useState<string | null>(
    null
  );
  const [dateStart, setDateStart] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  let getNotes: () => string | null = () => null;
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const {
    data: taskLogs,
    isLoading,
    isError,
    refetch,
  } = useQuery<TaskLog[]>({
    queryKey: ["taskLogs"],
    queryFn: getTaskLogs,
    initialData: [], // Start with an empty list
  });

  const logTask = useMutation({
    mutationFn: saveTaskLog,
    onSuccess: (newLog) => {
      // Optimistically update the UI with the new log
      queryClient.setQueryData<TaskLog[]>(["taskLogs"], (oldLogs = []) => [
        ...oldLogs,
        newLog,
      ]);
    },
  });

  // if (queryGetTasks.isPending || queryGetTasks.isError) {
  //   return <CircularProgress />;
  // }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <p>Error loading task logs. Please try again.</p>;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="container">
          <div
            style={{
              display: "flex",
              gap: "5px",
              flexDirection: "column", // Stack items vertically
              alignItems: "center", // Optional: Center horizontally
              justifyContent: "center", // Optional: Center vertically
              // height: "100vh",         // Optional: Take full viewport height
            }}
          >
            <StartTimeLabel time={dateStart} />
            <DurationTimeLabel dateStart={dateStart} />

            <TaskInput
              onTaskSelected={(selectedTask) => {
                setSelectedTask(selectedTask);
                setSelectedTaskSubtype(null);
              }}
              selectedTask={selectedTask}
            />
            <SubtypeInput
              onSubtypeSelected={(subtype) => {
                setSelectedTaskSubtype(subtype);
              }}
              subtypeOptions={selectedTask ? selectedTask.subtypes : []}
              selectedSubtype={selectedTaskSubtype}
            />
            <TaskNotes
              selectedTask={selectedTask}
              onGetNotes={(getNotesFunction) => {
                getNotes = getNotesFunction;
              }}
            />
            <LogButton
              currentTaskOption={selectedTask}
              onClick={() => {
                const log: TaskLog = {
                  type: selectedTask!.type,
                  subtype: selectedTaskSubtype,
                  dateStart: dateStart,
                  dateEnd: new Date(),
                  notes: getNotes(),
                };
                logTask.mutate(log);
                setSelectedTask(null);
                setSelectedTaskSubtype(null);
                setDateStart(new Date());
              }}
            />
          </div>
          <div style={{ width: "100%", justifyItems: "left" }}>
            {taskLogs
              .slice()
              .reverse()
              .sort((a: TaskLog, b: TaskLog) => {
                return a.dateStart > b.dateStart ? -1 : 1;
              })
              .map((log, index) => (
                <div key={index} style={{ display: "flex", marginTop: "5px" }}>
                  <label key={1 / index} style={{ marginRight: "10px" }}>
                    {readableTaskDuration(taskDuration(log)) + " "}
                  </label>
                  <label> </label>
                  <label key={-index} style={{ textAlign: "left" }}>
                    {" "}
                    {logSummaryString(log)}
                  </label>

                  {/* <p key={index}>{logSummaryString(log)}</p> */}
                </div>
              ))}
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
