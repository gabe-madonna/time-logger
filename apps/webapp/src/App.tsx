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
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import { StartTimeLabel } from "./StartTimeLabel.js";
import { DurationTimeLabel } from "./DurationTimeLabel.js";
import { TaskLog, TaskOption } from "@shared/types.js";

export let taskLogs: TaskLog[] = [];
export const apiUrl = import.meta.env.VITE_BACKEND_URL;

async function getTaskLogs(): Promise<TaskLog[]> {
  console.log("Getting tasks");
  const response = await fetch(apiUrl + "/logs/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  // convert dates from strings...sigh
  const logs: TaskLog[] = (await response.json()).map((log: any) => ({
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

export async function getTaskOptions(): Promise<TaskOption[]> {
  console.log("Getting task options");

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
  console.log("Got task options on frontend");
  console.log(options);
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
  const [taskNotes, setTaskNotes] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 100); // Update every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const queryGetTasks = useQuery({
    queryKey: ["taskLogs"],
    queryFn: getTaskLogs,
  });

  if (queryGetTasks.isPending || queryGetTasks.isError) {
    return <CircularProgress />;
  }

  return (
    <>
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
            setTaskNotes(null);
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
        <TaskNotes selectedTask={selectedTask} />
        <LogButton
          active={selectedTask !== null}
          currentTaskOption={selectedTask}
          currentTaskSubtype={selectedTaskSubtype}
          dateStart={dateStart}
          notes={taskNotes}
          onClick={() => {
            setSelectedTask(null);
            setDateStart(new Date());
            setTaskNotes(null);
          }}
        />
      </div>
      {queryGetTasks.data
        .slice()
        .reverse()
        .map((task, index) => (
          <p key={index}>
            {task.type} ({task.subtype}):{" "}
            {readableTaskDuration(taskDuration(task))}
            {task.notes ? `  "${task.notes}"` : ""}
          </p>
        ))}
    </>
  );
}

export default App;
