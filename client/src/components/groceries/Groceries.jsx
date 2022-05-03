import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import { Button, Container, Box } from '@mui/material';
import { Grid } from '@mui/material';
import axios from 'axios';
import GroceryCard from './GroceryCard';

const Groceries = () => {
  const [groceries, setGroceries] = useState([]);
  useEffect(() => { loadGroceries(); }, []);
  const loadGroceries = () => {
    axios.get('/api/groceries/').then(res => {
      setGroceries(res.data.groceries);
    });
  };

  const containerStyle = {
    margin: "50px auto"
  };

  const groceryList = groceries.map(grocery => {
    return (
      <Grid item key={grocery._id}>
        <GroceryCard id={grocery._id} name={grocery.name} amount={grocery.amount} />
      </Grid>
    );
  });

  return (
    <>
      <Container sx={containerStyle}>
        <TextField
          fullWidth
          id="standard-bare"
          variant="outlined"
          placeholder="Search for Grocery..."
          InputProps={{
            endAdornment: (
              <Button>
                <SearchOutlined />
              </Button>
            ),
          }}
        />

      </Container>
      <Box sx={{ display: "flex", flexWrap: "wrap", margin: "0 auto" }}>
        {groceryList}
      </Box>
    </>
  );
};

export default Groceries;

