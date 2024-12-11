import { readableTaskDuration } from "./TaskOptionInput";

type DurationTimeLabelProps = {
  dateStart: Date;
};

export function DurationTimeLabel(props: DurationTimeLabelProps) {
  const duration = new Date().getTime() - props.dateStart.getTime();
  const durationReadable = readableTaskDuration(duration, true);
  return (
    <div>
      <label>Duration: {durationReadable}</label>
    </div>
  );
}
