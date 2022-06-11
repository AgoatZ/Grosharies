import React, { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import { Button, Container, Box } from "@mui/material";
import { Grid } from "@mui/material";
import axios from "axios";
import GroceryCard from "./GroceryCard";

const Groceries = () => {
  const [allGroceries, setAllGroceries] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [clearLatestTimeout, setClearLatestTimeout] = useState(true);
  const [timeoutState, setTimeoutState] = useState();

  useEffect(() => {
    loadGroceries();
  }, []);
  const loadGroceries = () => {
    axios.get("/api/groceries/").then((res) => {
      setAllGroceries(res.data.groceries);
      setGroceries(res.data.groceries);
    });
  };

  const setTimeoutToSearchRequest = (searchValue, clearBefore) => {
    if (clearBefore) {
      clearTimeout(timeoutState);
    }

    setTimeoutState(
      setTimeout(() => {
        console.log("request");
        axios.get("/api/groceries/search/" + searchValue).then((res) => {
          setGroceries(res.data.groceries);
        });

        setClearLatestTimeout(true);
      }, 2000)
    );
    setClearLatestTimeout(false);
  };

  const loadFilteredGroceries = (e) => {
    const searchValue = e.target.value;
    if (clearLatestTimeout) {
      setTimeoutToSearchRequest(searchValue, false);
    } else {
      setTimeoutToSearchRequest(searchValue, true);
    }
  };

  const groceryList = groceries.map((grocery) => {
    return (
      <Grid item key={grocery._id}>
        <GroceryCard groceryDetails={grocery} />
      </Grid>
    );
  });

  return (
    <>
      <Container sx={{ margin: "50px auto" }}>
        <TextField
          fullWidth
          id="search"
          variant="outlined"
          placeholder="Search for Grocery..."
          InputProps={{
            endAdornment: (
              <Button>
                <SearchOutlined />
              </Button>
            ),
          }}
          onChange={loadFilteredGroceries}
        />
      </Container>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {groceryList}
      </Box>
    </>
  );
};

export default Groceries;
