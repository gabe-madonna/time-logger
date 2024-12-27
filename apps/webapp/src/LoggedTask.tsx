import { useState } from "react";
import { TaskLog } from "@shared/types.js";
import { taskDuration, readableTaskDuration } from "./TaskOptionInput.js";

function logSummaryString(log: TaskLog): string {
  const subtype: string = log.subtype === null ? "" : " (" + log.subtype + ")";
  const notes: string = log.notes ? `  "${log.notes}"` : "";
  const logString: string = log.type + subtype + notes;
  return logString;
}

type LoggedTaskProps = {
  log: TaskLog;
  index: number;
  onDelete: (log: TaskLog) => void;
};

export function LoggedTask({ log, index, onDelete }: LoggedTaskProps) {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div
      key={String(index) + ""}
      style={{
        // height: "30px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        color: isSelected ? "red" : "inherit",
        padding: "5px 0", // Add vertical spacing for breathing room
        borderBottom: "1px solid #444", // Optional: Divider between rows
      }}
      onClick={() => {
        // only the first row can be selected / deleted
        if (index > 0) return;
        setIsSelected(!isSelected);
      }}
    >
      <div
        key={String(index) + "summary"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px", // Add spacing between the elements
        }}
      >
        <label key={String(index) + "duration"}>
          {readableTaskDuration(taskDuration(log)) + " "}
        </label>
        <label key={String(index) + "details"}>{logSummaryString(log)}</label>
      </div>
      <div
        key={String(index) + "delete"}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <button
          key={String(index) + "deleteButton"}
          style={{
            background: "none",
            border: "none",
            color: "red",
            fontSize: "inherit",
            cursor: "pointer",
            opacity: isSelected ? 1 : 0,
            // remove outline
            outline: "none",
            height: "100%", // Ensure consistent height
          }}
          onClick={(e) => {
            if (!isSelected) return;
            e.stopPropagation();
            setIsSelected(false);
            onDelete(log);
          }}
        >
          X
        </button>
      </div>
    </div>
  );
}
