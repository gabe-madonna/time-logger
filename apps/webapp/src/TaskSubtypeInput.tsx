import { Autocomplete, TextField, Popper } from "@mui/material";
import { CurrentTaskLog } from "@shared/types.js";
import { styled } from "@mui/system";

type SubtypeInputProp = {
  currentLog: CurrentTaskLog;
  subtypes: string[];
  onSubtypeSelected: (subtype: string | null) => void;
};

const StyledPopper = styled(Popper)({
  "& .MuiAutocomplete-listbox": {
    maxHeight: 150, // Enforce a fixed dropdown height
    overflowY: "auto", // Enable scrolling
  },
});

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
      PopperComponent={(props) => <StyledPopper {...props} />}
      ListboxProps={{
        style: {
          maxHeight: 150, // Match the Popper height
          overflowY: "auto",
        },
      }}
    />
  );
}
