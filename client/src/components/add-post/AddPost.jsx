import * as React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { SearchOutlined } from "@material-ui/icons";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Stack from '@mui/material/Stack';
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "../../utils/axios";
import serverRoutes from "../../utils/server-routes";
import validator from "validator";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import CardMedia from "@mui/material/CardMedia";

const theme = createTheme();

const alertStyle = {
  color: "red",
};

const MySwal = withReactContent(Swal);

export default function AddPost() {
  const [isHeadlineError, setIsHeadlineError] = React.useState(false);
  const [isAddressError, setisAddressError] = React.useState(false);
  const [allGroceries, setAllGroceries] = React.useState([]);
  const [groceries, setGroceries] = React.useState([]);

  const [checked, setChecked] = React.useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.findIndex(i => i.grocery._id == value._id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push({ grocery: value, amount: 0 });
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleToggleAmount = (e, value) => {
    const currentIndex = checked.findIndex(i => i.grocery == value);
    if (currentIndex !== -1) {
      checked[currentIndex].amount = e.target.value
    }
    else {
      e.target.value = 0
    }
    console.log(checked)
  }
  React.useEffect(() => {
    loadGroceries();
  }, []);

  const loadGroceries = () => {
    axios.get("/groceries/").then((res) => {
      setAllGroceries(res.data.groceries);
      setGroceries([]);
    });
  };

  const loadFilteredGroceries = (e) => {
    const searchValue = e.target.value;
    const filteredGroceries = allGroceries.filter((grocery) => {
      return grocery.name.toLowerCase().includes(searchValue.toLowerCase());
    });
    setGroceries(filteredGroceries);
  };


  const handleSubmit = (event) => {
    const data = new FormData(event.currentTarget);

    const headline = data.get("headline");
    const address = data.get("address");
    const fromDate = data.get("from_date");
    const endDate = data.get("end_date");
    // const password = data.get("password");

    event.preventDefault();
    debugger
    if (headline === '' || address == '' || fromDate == null || endDate == null) {
      MySwal.fire({
        title: <strong>Something went wrong</strong>,
        text: "Some of the fields are empty",
        icon: "error",
      });
      return;
    }


    axios
      .post(serverRoutes.Register, {
        headline,
        address
      })
      .then((res) => {
        MySwal.fire({
          title: <strong>Post created Successfully!</strong>,
          icon: "success",
        });
        console.log(res.data);
      })
      .catch((e) => {
        MySwal.fire({
          title: <strong>Something Went Wrong</strong>,
          icon: "error",
        });
        console.log(e);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Add Post
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            {/* headline */}
            <Grid container spacing={4}>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={!isHeadlineError}
                  onChange={(e) => {
                  }}
                  type="text"
                  id="headline"
                  label="Headline"
                  name="headline"
                  autoComplete="headline"
                />
              </Grid>

              {/* address */}


              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={!isAddressError}
                  onChange={(e) => {
                  }}
                  type="text"
                  id="address"
                  label="address"
                  name="address"
                  autoComplete="address"
                />
              </Grid>



              {/* fromDate */}

              <Grid item xs={12}>
                <Stack noValidate spacing={6}>
                  <TextField
                    id="from_date"
                    label="From date"
                    name="from_date"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Stack>
              </Grid>

              {/* endDate */}

              <Grid item xs={12}>
                <Stack noValidate spacing={6}>
                  <TextField
                    id="end_date"
                    label="End date"
                    type="date"
                    name="end_date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
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
              </Grid>

              <Grid item xs={12}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  {groceries.map((value) => {
                    const labelId = `checkbox-list-label-${value._id}`;

                    return (
                      <ListItem
                        key={value._id}
                       
                        disablePadding
                      >
                        <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={checked.findIndex(i => i.grocery._id == value._id) !== -1}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </ListItemIcon>
                          <ListItemText id={labelId} primary={`${value.name}`} />
                          <TextField
                            fullWidth
                            defaultValue={()=>{
                              const findIndex = checked.findIndex(i => i.grocery._id == value._id)
                              if(findIndex === -1){

                              }
                              else{
                                checked[findIndex].amount
                              }
                            }}
                            variant="outlined"
                            placeholder="amount"
                            onChange={(e) => handleToggleAmount(e, value)}
                          />
                          <CardMedia
                            component="img"
                            sx={{
                              padding: 1,
                              width: "50px",
                              height: "50px",
                            }}
                            image="/assets/logo.svg"
                            alt="Live from space album cover"
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Add Post
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider >
  );
}
