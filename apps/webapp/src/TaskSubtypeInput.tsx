import { Autocomplete, TextField } from "@mui/material";
import { CurrentTaskLog } from "@shared/types.js";

type SubtypeInputProp = {
  currentLog: CurrentTaskLog;
  subtypes: string[];
  onSubtypeSelected: (subtype: string | null) => void;
};

export function SubtypeInput(props: SubtypeInputProp) {
  return (
    <Autocomplete
      disablePortal
      options={props.subtypes}
      value={props.currentLog.subtype}
      // sx={{ width: 300 }}
      sx={{
        width: "100%", // Full-width layout
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          // label={props.selectedSubtype ? props.selectedSubtype : "None"}
          sx={{
            backgroundColor:
              props.currentLog.subtype !== null ? "white" : "gray",
          }}
        />
      )}
      // getOptionLabel={(option) => option.seelct}
      onChange={(event, newSubtype) => {
        props.onSubtypeSelected(newSubtype);
      }}
      color="#000000" // doesnt seem to change anything...
      slotProps={{
        popper: {
          sx: {
            "& .MuiAutocomplete-paper": {
              maxHeight: "150px", // Limit height of the dropdown
              // overflowY: "auto", // Add scroll if items exceed height
            },
          },
        },
      }}
    />
  );
}
