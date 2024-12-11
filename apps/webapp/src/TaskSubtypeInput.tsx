import { Autocomplete, TextField } from "@mui/material";

type SubtypeInputProp = {
  selectedSubtype: string | null;
  subtypeOptions: string[];
  onSubtypeSelected: (subtype: string | null) => void;
};

export function SubtypeInput(props: SubtypeInputProp) {
  return (
    <Autocomplete
      disablePortal
      options={props.subtypeOptions}
      value={props.selectedSubtype}
      // sx={{ width: 300 }}
      sx={{
        width: "250px", // Full-width layout
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          // label={props.selectedSubtype ? props.selectedSubtype : "None"}
          sx={{
            backgroundColor: props.selectedSubtype ? "white" : "gray",
          }}
        />
      )}
      // getOptionLabel={(option) => option.seelct}
      onChange={(event, newTask) => {
        props.onSubtypeSelected(newTask);
      }}
      color="#000000" // doesnt seem to change anything...
    />
  );
}
