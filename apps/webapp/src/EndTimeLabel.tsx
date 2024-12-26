import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { CurrentTaskLog } from "@shared/types.js";

export function validTaskEndDate(currentLog: CurrentTaskLog): boolean {
  const validType =
    currentLog.dateEnd === null ||
    (currentLog.dateEnd > currentLog.dateStart &&
      currentLog.dateEnd < new Date());
  return validType;
}

type EndTimeLabelProps = {
  currentLog: CurrentTaskLog;
  onTimeSelected: (time: Date | null) => void;
};

export function EndTimeLabel(props: EndTimeLabelProps) {
  // const [value, setValue] = useState<Dayjs | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (newValue: Dayjs | null) => {
    if (newValue === null) {
      // setValue(null);
      props.onTimeSelected(null);
      setIsEditing(false);
    } else {
      props.onTimeSelected(newValue.toDate());
      // setValue(newValue || null); // Default to current time if value is cleared
      // setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // if (
    //   props.currentLog.dateEnd !== null &&
    //   props.currentLog.dateEnd > new Date()
    // ) {
    //   props.onTimeSelected(null);
    // } else if (
    //   props.currentLog.dateEnd !== null &&
    //   props.currentLog.dateEnd <= props.currentLog.dateStart
    // ) {
    //   props.onTimeSelected(null);
    // }
    setIsEditing(false);
  };

  const renderValue = () => {
    if (props.currentLog.dateEnd === null) return "Now";
    // return dayjs() from Date type
    return dayjs(props.currentLog.dateEnd).format("hh:mm A");
    // return props.time.format("hh:mm A");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "30px",
        color: validTaskEndDate(props.currentLog) ? "inherit" : "Red",
        fontFamily: "inherit",
        fontSize: "inherit",
      }}
    >
      <label>End Time:</label>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div>
          {isEditing ? (
            <DateTimeField
              value={
                props.currentLog.dateEnd === null
                  ? dayjs()
                  : dayjs(props.currentLog.dateEnd)
              }
              onChange={handleSave}
              onBlur={handleCancel}
              format="MM-DD hh:mm A"
              autoFocus
              sx={{
                background: "none",
                border: "none",
                outline: "none",
                padding: 0,
                "& .MuiOutlinedInput-root": {
                  padding: 0,
                  color: validTaskEndDate(props.currentLog) ? "inherit" : "Red",
                  "& input": {
                    textAlign: "right",
                  },

                  "&.Mui-focused": {
                    outline: "none",
                    boxShadow: "none",
                    border: "none",
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              style={
                {
                  // cursor: "pointer",
                  // width: "100%",
                }
              }
            >
              {renderValue()}
            </div>
          )}
        </div>
      </LocalizationProvider>
    </div>
  );
}
