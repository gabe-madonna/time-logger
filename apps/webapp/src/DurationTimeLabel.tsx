import { CurrentTaskLog } from "@shared/types.js";
import { readableTaskDuration } from "./TaskOptionInput.js";
import { useEffect, useState } from "react";

type DurationTimeLabelProps = {
  currentLog: CurrentTaskLog;
  logStart: Date | null;
};

export function DurationTimeLabel({
  currentLog,
  logStart,
}: DurationTimeLabelProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  let duration = 0;
  if (logStart) {
    duration = Math.max(
      (currentLog.dateEnd?.getTime() || currentTime.getTime()) -
        logStart.getTime(),
      0
    );
  }
  const durationReadable = readableTaskDuration(duration, true);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <label style={{ textAlign: "left" }}>Duration:</label>
      <label>{durationReadable}</label>
    </div>
  );
}
