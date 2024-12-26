type StartTimeLabelProps = {
  time: Date;
};

export function StartTimeLabel(props: StartTimeLabelProps) {
  // make a startTime that updates when the parent
  const { time } = props;
  const startTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
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
      <label style={{ textAlign: "left" }}>Start Time:</label>
      <label>{startTime}</label>
    </div>
  );
}
