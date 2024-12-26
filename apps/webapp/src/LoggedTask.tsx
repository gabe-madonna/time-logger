import { useState } from "react";
import { X } from "lucide-react";
import { TaskLog } from "@shared/types.js";
import { taskDuration, readableTaskDuration } from "./TaskOptionInput.js";
import { Button } from "@mui/material";

function logSummaryString(log: TaskLog): string {
  const subtype: string = log.subtype === null ? "" : " (" + log.subtype + ")";
  // const duration: string = readableTaskDuration(taskDuration(log));
  const notes: string = log.notes ? `  "${log.notes}"` : "";

  // const logString: string = duration + " " + log.type + subtype + notes;
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
      key={index}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%", // Make the container span full width
        cursor: "pointer",
        color: isSelected ? "red" : "inherit",
      }}
      onClick={() => setIsSelected(!isSelected)}
    >
      {/* Left side content */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px", // Add spacing between the elements
        }}
      >
        <label>{readableTaskDuration(taskDuration(log)) + " "}</label>
        <label>{logSummaryString(log)}</label>
      </div>

      {/* Right side content */}
      {isSelected && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={{
              background: "none",
              border: "none",
              color: "red",
              fontSize: "inherit",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsSelected(false);
              onDelete(log);
            }}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}
