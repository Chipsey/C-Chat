import React from "react";
import {
  Grid,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const Filtering = ({
  options,
  selectedOptions,
  handleSearch,
  handleSelectionChange,
  handleReload,
}) => {
  // Determine if all selected options are empty
  const allOptionsEmpty = Object.values(selectedOptions).every(
    (value) => value === "" || value === null
  );

  return (
    <Box>
      <Grid container xl={12} mt={3} mb={1} mr={0}>
        <Grid xl={12}>
          <input
            onChange={(event) => handleSearch(event.target.value)}
            type="text"
            placeholder="Let's Start Searching.."
            style={{
              width: "95.5%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              border: "1px solid white",
              borderRadius: "50px",
              padding: windowWidth * 0.008,
              outline: "none",
            }}
            className="font-small"
          />
        </Grid>
      </Grid>
      <Grid
        container
        xl={12}
        spacing={2}
        mb={5}
        justifyContent="center"
        alignItems="center"
      >
        {Object.keys(options).map((key, index) => (
          <Grid item xl={4} key={index}>
            <FormControl
              variant="filled"
              sx={{
                backgroundColor: "grey",
                borderRadius: "10px",
                fontSize: "0.75rem",
              }}
              fullWidth
            >
              <InputLabel
                id={`${key}-label`}
                sx={{
                  fontSize: "0.75rem",
                  "&.Mui-focused": {
                    color: "white", // Change the color to white when the label is focused
                  },
                }}
              >
                {options[key].title}
              </InputLabel>
              <Select
                sx={{
                  color: "white",
                  backgroundColor: "rgba(230, 230, 230, 0.3)",
                  fontSize: "0.75rem",
                }}
                labelId={`${key}-label`}
                id={key}
                value={selectedOptions[key] || ""}
                onChange={(event) => handleSelectionChange(event, key)}
              >
                {options[key].values.map((optionValue, optionIndex) => (
                  <MenuItem
                    value={optionValue}
                    key={optionIndex}
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {optionValue}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}

        <Grid>
          <Button
            variant="contained"
            color="success"
            onClick={handleReload}
            sx={{
              marginTop: 1,
              color: "white",
              fontSize: "0.75rem",
            }}
            disabled={allOptionsEmpty}
          >
            Clear All Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Filtering;
