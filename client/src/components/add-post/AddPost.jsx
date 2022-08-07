import * as React from "react";
import { useNavigate } from "react-router-dom";
import "react-phone-input-2/lib/style.css";
import Button from "@mui/material/Button";
import { SearchOutlined } from "@material-ui/icons";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "../../utils/axios";
import serverRoutes from "../../utils/server-routes";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import CardMedia from "@mui/material/CardMedia";
import Input from "@mui/material/Input";
import Geocode from "react-geocode";

const alertStyle = {
  color: "red",
};

const MySwal = withReactContent(Swal);

export default function AddPost() {
  const navigate = useNavigate();
  const [isHeadlineError, setIsHeadlineError] = React.useState("");
  const [isAddressError, setIsAddressError] = React.useState("");
  const [isDescriptionError, setIsDescriptionError] = React.useState("");
  const [isFromDateError, setIsFromDateError] = React.useState("");
  const [isEndDateError, setIsEndDateError] = React.useState("");
  const [isQuantityError, setIsQuantityError] = React.useState("");
  const [allGroceries, setAllGroceries] = React.useState([]);
  const [groceries, setGroceries] = React.useState([]);
  const [checked, setChecked] = React.useState([]);
  const [setHeadline] = React.useState("");
  const [setAddress] = React.useState("");
  const [setDescription] = React.useState("");
  const [fromDate, setFromDate] = React.useState();
  const [endDate, setEndDate] = React.useState();
  const [images, setImages] = React.useState();

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
    checked[currentIndex].amount =
      e.target.value === "" ? 0 : parseInt(e.target.value);
  };

  React.useEffect(() => {
    loadGroceries();
    setFromDate(new Date());
    setEndDate(new Date());
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

    if (checkedGroceries.length === 0 && searchValue === "") {
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
    event.preventDefault();
    if (headline === "") {
      setIsHeadlineError(
        "headline is empty"
      );
      return
    }
    if (until <= fromDate) {
      setIsEndDateError(
        "end date must be greater from fromDate"
      );
      return;
    }
    if (description === "") {
      setIsDescriptionError(
        "description is empty"
      );
      return
    }
    if (address === "") {
      setIsAddressError(
        "address is empty"
      );
      return
    }
    if (
      isHeadlineError !== "" ||
      isDescriptionError !== "" ||
      isAddressError !== "" ||
      isFromDateError !== "" ||
      isEndDateError !== "" ||
      isQuantityError !== ""
    ) {
      if (isFromDateError !== "") {

      }
      return;
    }
    // eslint-disable-next-line
    const groceries = checked.map((grocery) => {
      if (grocery.isChecked) {
        return { id: grocery.grocery._id, amount: grocery.amount };
      }
    });
    const groceriesToSend = groceries.filter(grocery => grocery !== null);
    axios
      .post(serverRoutes.AddPost, {
        headline,
        address,
        description,
        pickUpDates: [{ from, until, repeated }],
        groceriesToSend,
      })
      .then((res) => {
        if (images) {
          const reader = new FileReader();
          reader.onload = function (evt) {
            const contents = evt.target.result;
            axios
              .post("/posts/updateImage/" + res.data.post._id, contents, {
                headers: {
                  'Content-Type': 'image/*'
                }
              })
              .then((res) => {
                MySwal.fire({
                  title: <strong>Post created Successfully!</strong>,
                  icon: "success",
                  timer: 1000,
                  showConfirmButton: false,
                  backdrop: false,
                });
                setTimeout(() => {
                  navigate("/my-posts", {});
                }, 1000);
              });
          };
          reader.readAsArrayBuffer(images);
        }
      })
      .catch((e) => {
        MySwal.fire({
          title: <strong>Something Went Wrong</strong>,
          icon: "error",
          backdrop: false,
        });
        console.log(e);
      });
  };

  const onChangeImages = (event) => {
    setImages(event.target.files[0]);
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", }}>
        <Typography variant="h5">New Post</Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>

          {/* headline */}
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                required
                error={isHeadlineError !== ""}
                fullWidth
                onChange={(e) => {
                  if (e.target.value.length < 2) {
                    setIsHeadlineError(
                      "headline must be at least 2 characters"
                    );
                  } else {
                    setIsHeadlineError("");
                  }
                  setHeadline(e.target.value);
                }}
                type="text"
                id="headline"
                label="Headline"
                name="headline"
                autoComplete="headline"
              />
              {isHeadlineError !== "" ? (
                <label style={alertStyle}>{isHeadlineError}</label>
              ) : null}
            </Grid>

            {/* address */}

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                error={isAddressError !== ""}
                onChange={async (e) => {

                  if (e.target.value.length < 2) {
                    setIsAddressError(
                      "address must be at least 2 characters"
                    )
                  }

                  try {
                    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
                    const response = await Geocode.fromAddress(e.target.value);
                    if (!response.results[0].geometry.location) {
                      setIsAddressError(
                        "The address is not valid"
                      );
                    } else {
                      setIsAddressError("");
                    }
                  } catch (e) {
                    setIsAddressError(
                      "The address is not valid"
                    );
                  }
                  setAddress(e.target.value);

                }}
                placeholder="18 King George, Tel Aviv"
                type="text"
                id="address"
                label="address"
                name="address"
                autoComplete="address"
              />
              {isAddressError !== "" ? (
                <label style={alertStyle}>{isAddressError}</label>
              ) : null}
            </Grid>

            {/* description */}

            <Grid item xs={12}>
              <TextField
                required
                error={isDescriptionError !== ""}
                fullWidth
                onChange={(e) => {
                  if (e.target.value.length < 2) {
                    setIsDescriptionError(
                      "description must be at least 2 characters"
                    );
                  } else {
                    setIsDescriptionError("");
                  }
                  setDescription(e.target.value);
                }}
                type="text"
                id="description"
                label="description"
                name="description"
                autoComplete="description"
              />
              {isDescriptionError ? (
                <label style={alertStyle}>{isDescriptionError}</label>
              ) : null}
            </Grid>

            {/* fromDate */}

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  renderInput={(props) => (
                    <TextField sx={{ width: "100%" }} {...props} />
                  )}
                  error={isFromDateError !== ""}
                  label="From date"
                  value={fromDate}
                  onChange={(newValue) => {
                    const today = new Date();
                    if (newValue < today) {
                      setIsFromDateError(
                        "From date is required and must be greater from now"
                      );
                    } else {
                      setIsFromDateError("");
                    }
                    setFromDate(newValue);
                  }}
                />
              </LocalizationProvider>
              {isFromDateError !== "" ? (
                <label style={alertStyle}>{isFromDateError}</label>
              ) : null}
            </Grid>

            {/* endDate */}

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  renderInput={(props) => (
                    <TextField sx={{ width: "100%" }} {...props} />
                  )}
                  error={isEndDateError !== ""}
                  label="end date"
                  value={endDate}
                  onChange={(newValue) => {
                    if (newValue > fromDate) {
                      setIsEndDateError("");
                    } else {
                      setIsEndDateError(
                        "end date must be greater from fromDate"
                      );
                    }
                    setEndDate(newValue);
                  }}
                />
                {isEndDateError !== "" ? (
                  <label style={alertStyle}>{isEndDateError}</label>
                ) : null}
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
                              i.grocery._id === value._id &&
                              i.isChecked === true
                          ) !== -1
                        }
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                      <TextField
                        fullWidth
                        error={isQuantityError !== ""}
                        InputProps={{
                          inputProps: { min: 0 }
                        }}
                        type="number"
                        id={`${value.name}`}
                        label={`${value.name}`}
                        name={`${value.name}`}
                        onChange={(e) => {

                          if (e.target.value < 0) {
                            setIsQuantityError(
                              "must be positive"
                            );

                          } else {
                            setIsQuantityError(
                              ""
                            );
                            handleToggleAmount(e, value)
                          }
                        }}

                      />
                      <CardMedia
                        component="img"
                        sx={{
                          padding: 1,
                          width: "50px",
                          height: "50px",
                        }}
                        image={"data:image/jpg;base64, " + value.images}
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
  );
}
