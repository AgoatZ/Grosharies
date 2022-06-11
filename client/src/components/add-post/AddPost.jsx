import * as React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { SearchOutlined } from "@material-ui/icons";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import CardMedia from "@mui/material/CardMedia";
import Input from "@mui/material/Input";

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
  const [fromDate, setFromDate] = React.useState();
  const [endDate, setEndDate] = React.useState();
  const [images, setImages] = React.useState();

  const [checked, setChecked] = React.useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.findIndex((i) => {
      return i.grocery._id === value._id;
    });
    const newChecked = [...checked];

    if (!newChecked[currentIndex].isChecked) {
      newChecked[currentIndex].isChecked = true;
    } else {
      newChecked[currentIndex].isChecked = false;
    }

    setChecked(newChecked);
  };

  const handleToggleAmount = (e, value) => {
    const currentIndex = checked.findIndex((i) => {
      return i.grocery === value;
    });

    checked[currentIndex].amount = e.target.value;

    console.log(checked);
  };

  React.useEffect(() => {
    loadGroceries();
  }, []);

  const loadGroceries = () => {
    axios.get("/groceries/").then((res) => {
      setAllGroceries(res.data.groceries);
      setGroceries(res.data.groceries);
      const initialChecked = res.data.groceries.map((grocery) => {
        return { grocery, amount: 0, isChecked: false };
      });

      setChecked(initialChecked);
    });
  };

  const loadFilteredGroceries = (e) => {
    const searchValue = e.target.value;

    const filteredGroceries = allGroceries.filter((grocery) => {
      return grocery.name.toLowerCase().includes(searchValue.toLowerCase());
    });

    const checkedGroceries = filteredGroceries.filter((filteredGrocery) => {
      return checked.some((checkedGrocery) => {
        return (
          checkedGrocery.isChecked &&
          checkedGrocery.grocery._id === filteredGrocery._id
        );
      });
    });

    if (checkedGroceries.length == 0 && searchValue === "") {
      setGroceries([]);
      return;
    } else if (checkedGroceries.length > 0 && searchValue === "") {
      setGroceries(checkedGroceries);
      return;
    }

    setGroceries(filteredGroceries);
  };

  const handleSubmit = (event) => {
    const data = new FormData(event.currentTarget);

    const headline = data.get("headline");
    const address = data.get("address");
    const description = data.get("description");

    const from = fromDate;
    const until = endDate;
    const repeated = data.get("repeat");

    const groceries = checked.map((grocery) => {
      if (grocery.isChecked) {
        return { id: grocery._id, amount: grocery.amount };
      }
    });

    event.preventDefault();
    if (
      headline === "" ||
      address == "" ||
      fromDate == null ||
      endDate == null
    ) {
      MySwal.fire({
        title: <strong>Something went wrong</strong>,
        text: "Some of the fields are empty",
        icon: "error",
      });
      return;
    }

    axios
      .post(serverRoutes.AddPost, {
        headline,
        address,
        description,
        pickUpDates: [{ from, until /*, repeated*/ }],
        groceries,
      })
      .then((res) => {
        axios
          .post("/posts/updateImage " + res.post._id, { images })
          .then((res) => {
            MySwal.fire({
              title: <strong>Post created Successfully!</strong>,
              icon: "success",
            });
          });
      })
      .catch((e) => {
        MySwal.fire({
          title: <strong>Something Went Wrong</strong>,
          icon: "error",
        });
        console.log(e);
      });
  };

  const onChangeImages = (event) => {
    setImages(event.target.files);
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
                  onChange={(e) => {}}
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
                  onChange={(e) => {}}
                  type="text"
                  id="address"
                  label="address"
                  name="address"
                  autoComplete="address"
                />
              </Grid>

              {/* description */}

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  onChange={(e) => {}}
                  type="text"
                  id="description"
                  label="description"
                  name="description"
                  autoComplete="description"
                />
              </Grid>

              {/* fromDate */}

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    renderInput={(props) => (
                      <TextField sx={{ width: "100%" }} {...props} />
                    )}
                    label="From date"
                    value={fromDate}
                    onChange={(newValue) => {
                      setFromDate(newValue);
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              {/* endDate */}

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    renderInput={(props) => (
                      <TextField sx={{ width: "100%" }} {...props} />
                    )}
                    label="end date"
                    value={endDate}
                    onChange={(newValue) => {
                      setEndDate(newValue);
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              {/* checkbox */}

              <Grid item xs={12}>
                <Checkbox name="repeat"></Checkbox>
                <label>Repeat every day same hours</label>
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
                <List
                  sx={{
                    width: "100%",
                    maxWidth: "500px",
                    bgcolor: "background.paper",
                  }}
                >
                  {groceries.map((value) => {
                    const labelId = `checkbox-list-label-${value._id}`;

                    return (
                      <ListItem
                        key={value._id}
                        disablePadding
                        sx={{ mb: "5px" }}
                      >
                        <Checkbox
                          edge="start"
                          onClick={handleToggle(value)}
                          checked={
                            checked.findIndex(
                              (i) =>
                                i.grocery._id == value._id &&
                                i.isChecked === true
                            ) !== -1
                          }
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                        <TextField
                          fullWidth
                          type="text"
                          id={`${value.name}`}
                          label={`${value.name}`}
                          name={`${value.name}`}
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
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
              <Grid item xs={12}>
                <Input type="file" onChange={onChangeImages}></Input>
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
    </ThemeProvider>
  );
}
