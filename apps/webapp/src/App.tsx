import { useEffect, useState } from "react";
import "./App.css";
import { TaskInput, taskDuration, readableTaskDuration } from "./TaskInput.js";
import { TaskNotes } from "./TaskNotes.js";
import { LogButton } from "./LogButton.js";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import { StartTimeLabel } from "./StartTimeLabel.js";
import { DurationTimeLabel } from "./DurationTimeLabel.js";
import { TaskLog, TaskOption } from "@shared/types.js";

export let taskDatabase: TaskLog[] = [];
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export async function setTaskDatabase(log: TaskLog) {
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

async function getTaskDatabase(): Promise<TaskLog[]> {
  await new Promise((r) => setTimeout(r, 1));
  return taskDatabase; // use fetch here
}

// const tasks = getTasks()
// const tasks = await getTasks()

function App() {
  const [count, setCount] = useState(0);
  const [selectedTask, setSelectedTask] = useState<TaskOption | null>(null);
  const [dateStart, setDateStart] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [taskNotes, setTaskNotes] = useState<String | null>(null);

  console.log("Task Database: ", taskDatabase);
  useEffect(() => {
    console.log("Effect Used");
  }, [count]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const queryGetTasks = useQuery({
    queryKey: ["tasks"],
    queryFn: getTaskDatabase,
  });

  if (queryGetTasks.isPending || queryGetTasks.isError) {
    return <CircularProgress />;
  }

  return (
    <>
      <StartTimeLabel time={dateStart} />
      <DurationTimeLabel dateStart={dateStart} />

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <div style={{ padding: "10px" }}>
          <TaskInput
            onTaskSelected={(selectedTask) => {
              setSelectedTask(selectedTask);
            }}
            selectedTask={selectedTask}
          />
        </div>
        <div style={{ padding: "10px" }}>
          <TaskNotes
            selectedTask={selectedTask !== null}
            onChange={(notes) => {
              setTaskNotes(notes);
            }}
          />
        </div>
      </div>

      <LogButton
        active={selectedTask !== null}
        currentTask={selectedTask}
        dateStart={dateStart}
        notes={taskNotes}
        onClick={() => {
          setSelectedTask(null);
          setDateStart(new Date());
          setTaskNotes(null);
        }}
      />
      {queryGetTasks.data
        .slice()
        .reverse()
        .map((task, index) => (
          <p key={index}>
            {task.task}: {readableTaskDuration(taskDuration(task))}
            {task.notes ? `  "${task.notes}"` : ""}
          </p>
        ))}
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}
      {/* <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            setCount(count + 1);
            setCount((count) => count + 1);
          }}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  );
}

export default App;
