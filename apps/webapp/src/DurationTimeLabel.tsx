import { readableTaskDuration } from "./TaskOptionInput.js";
import { useEffect, useState } from "react";

type DurationTimeLabelProps = {
  dateStart: Date;
};

export function DurationTimeLabel({ dateStart }: DurationTimeLabelProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const duration = currentTime.getTime() - dateStart.getTime();
  const durationReadable = readableTaskDuration(duration, true);
  return (
    <div>
      <label>Duration: {durationReadable}</label>
    </div>
  );
}
