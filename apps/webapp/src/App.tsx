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
import { CurrentTaskLog, TaskLog, TaskOption } from "@shared/types.js";
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

async function getCurrentLog(): Promise<CurrentTaskLog | null> {
  console.log("Frontend getting current task log");
  const response = await fetch(`${apiUrl}/currentTaskLogs/`, {
    method: "GET",
  });
  if (response.status === 404) {
    return null; // No current log found
  }
  console.log("Valid response current log");

  if (!response.ok) {
    throw new Error("Failed to fetch current log");
  }

  const currentLog: CurrentTaskLog = await response.json();
  console.log(currentLog);
  return {
    ...currentLog,
    dateStart: new Date(currentLog.dateStart), // Convert string to Date
  };
}

async function saveCurrentLog(currentLog: CurrentTaskLog): Promise<void> {
  const response = await fetch(`${apiUrl}/currentTaskLogs/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(currentLog),
  });

  if (!response.ok) {
    throw new Error("Failed to save current log");
  }

  console.log("saved current log");
  console.log(currentLog);
}

const theme = createTheme({
  typography: {
    fontFamily: "'Fira Code', monospace",
  },
});

function logSummaryString(log: TaskLog): string {
  const subtype: string = log.subtype === null ? "" : " (" + log.subtype + ")";
  // const duration: string = readableTaskDuration(taskDuration(log));
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

type SubtypeMap = Record<string, string[]>;

function App() {
  console.log("Running App Loop");
  const [currentLog, setCurrentLog] = useState<CurrentTaskLog>({
    type: null,
    subtype: null,
    dateStart: new Date(),
    notes: null,
  });
  const [currentLogFetched, setCurrentLogFetched] = useState<boolean>(false);
  const [subtypeMap, setSubtypeMap] = useState<SubtypeMap>({});
  const [types, setTypes] = useState<string[]>([]);

  // Build the subtypes hash map
  useEffect(() => {
    async function buildSubtypeMap() {
      try {
        const taskOptions: TaskOption[] = await getTaskOptions();
        const subtypeMap2: SubtypeMap = taskOptions.reduce((map, option) => {
          map[option.type] = option.subtypes; // Use the task type as the key
          return map;
        }, {} as SubtypeMap);
        const types: string[] = taskOptions.map((option) => option.type);

        setSubtypeMap(subtypeMap2);
        setTypes(types);
      } catch {
        console.error("Failed to fetch task options");
        setSubtypeMap({});
        setTypes([]);
      }
    }
    buildSubtypeMap();
  }, []);

  // Fetch current log on app load
  useEffect(() => {
    async function getCurrentLog2() {
      try {
        const currentLog = await getCurrentLog();
        if (currentLog) {
          setCurrentLog(currentLog);
          console.log("Found a current log");
          console.log(currentLog);
        }
      } catch (error) {
        console.error("Error loading current log:", error);
      }
      setCurrentLogFetched(true);
    }
    getCurrentLog2();
  }, []);

  // Save current log whenever it changes
  useEffect(() => {
    // dont overwrite the current log in the database until we've first fetched it
    if (currentLogFetched) {
      saveCurrentLog(currentLog).catch((error) => {
        console.error("Error saving current log:", error);
      });
    }
  }, [currentLog]);

  let getNotes: () => string | null = () => null;
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {}, 1000); // Update every second

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
              // width: "100%",
              display: "flex",
              gap: "10px",
              flexDirection: "column", // Stack items vertically
              alignItems: "center", // Optional: Center horizontally
              justifyContent: "center", // Optional: Center vertically
              // height: "100vh",         // Optional: Take full viewport height
            }}
          >
            <StartTimeLabel time={currentLog.dateStart} />
            <DurationTimeLabel dateStart={currentLog.dateStart} />

            <TaskInput
              currentLog={currentLog}
              types={types}
              onTypeSelected={(newType) => {
                setCurrentLog({
                  ...currentLog,
                  type: newType,
                  subtype: null,
                  notes: null,
                });
              }}
            />
            <SubtypeInput
              currentLog={currentLog}
              onSubtypeSelected={(subtype) => {
                setCurrentLog({
                  ...currentLog,
                  subtype: subtype,
                });
              }}
              subtypes={
                currentLog.type === null ? [] : subtypeMap[currentLog.type]!
              }
            />
            <TaskNotes
              currentLog={currentLog}
              onChange={(notes) => {
                setCurrentLog({ ...currentLog, notes: notes });
              }}
              // onGetNotes={(getNotesFunction) => {
              //   getNotes = getNotesFunction;
              // }}
            />
            <LogButton
              currentLog={currentLog}
              onClick={() => {
                const log: TaskLog = {
                  ...currentLog,
                  type: currentLog.type!,
                  dateEnd: new Date(),
                };
                logTask.mutate(log);
                setCurrentLog({
                  type: null,
                  subtype: null,
                  dateStart: new Date(),
                  notes: null,
                });
                // setDateStart(new Date());
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
