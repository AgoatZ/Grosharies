import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import axios from "axios";
import { Button, Typography, Box, Tooltip, Stack } from "@mui/material";
import { UserImage } from "../common/Images";
import { Input } from "@material-ui/core";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import Icon from '@mui/material/Icon';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const MySwal = withReactContent(Swal);

const Profile = () => {
  const { userData, setUserData } = useContext(AppContext);
  const [tempImage, setTempImage] = useState("");
  const [edit, setEdit] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [EditedUserImage, setEditeduserImage] = useState();
  const [passwordError, setPasswordError] = useState(false)
  let navigate = useNavigate();

  const EditUser = () => {
    const userEditedData = {}
    if (passwordError) return;

    for (const key of Object.keys(editedUser)) {
      if (editedUser[key])
        userEditedData[key] = editedUser[key];
    }

    if (Object.keys(userEditedData).length === 0 && !EditedUserImage) {
      MySwal.fire({ title: "Nothing to update", icon: "info", timer: 1000 });
      return;
    }

    axios
      .put("api/users/current", userEditedData)
      .then((res) => {
        if (EditedUserImage) {
          const reader = new FileReader();
          reader.onload = function (evt) {
            const contents = evt.target.result;
            axios
              .post("api/users/updateImage/current", contents, {
                headers: {
                  'Content-Type': 'image/*'
                }
              })
              .then((res) => {
                setEdit(false);
                setTempImage(res.data.newUser.profileImage);
                setUserData(res.data.newUser);
                MySwal.fire({ title: "Updated successfully!", icon: "success", timer: 1000, showConfirmButton: false });
              });
          };
          reader.readAsArrayBuffer(EditedUserImage);
          return;
        }
        else {
          setEdit(false);
          setUserData(res.data.newUser);
          MySwal.fire({ title: "Updated successfully!", icon: "success", timer: 1000, showConfirmButton: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Stack direction="column" alignItems="center" flexWrap="wrap" spacing={{ xs: 2, sm: 2, md: 3, lg: 3 }}>
      {/* Card */}
      <Box sx={{ border: "1px solid", padding: "5%", borderRadius: "30px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", flexWrap: "wrap" }}>

        <EditIcon sx={{
          visibility: !edit ? "visible" : "hidden", position: "absolute", right: "5%", top: "5%",
          ":hover": { cursor: "pointer", color: "gray" },
        }}
          onClick={() => { setEdit(true); }}
        ></EditIcon>

        <ClearIcon
          sx={{
            color: "red", visibility: edit ? "visible" : "hidden", position: "absolute", right: "5%", top: "5%",
            width: "30px", height: "30px", ":hover": { cursor: "pointer", color: "gray" },
          }}
          onClick={() => { setEdit(false); }}
        ></ClearIcon>

        <CheckIcon
          sx={{
            color: "green", visibility: edit ? "visible" : "hidden", position: "absolute", right: "5%", top: "90%",
            width: "30px", height: "30px", ":hover": { cursor: "pointer", color: "gray" },
          }}
          onClick={EditUser}
        ></CheckIcon>

        <label>
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) => { 
              setEditeduserImage(e.target.files[0]);
              // TODO: convert into base64 in order to see the preview after change file
              setTempImage(e.target.files[0]);
            }}
          />
          <Tooltip title="Upload Files">
            <Icon
              color="success"

              sx={{
                color: "green", visibility: edit ? "visible" : "hidden", position: "absolute", right: "35%", top: "38%",
                width: "30px", height: "30px", margin: "0", ":hover": { cursor: "pointer", color: "gray" },
              }}
            >add_circle</Icon>
          </Tooltip>
        </label>
        <UserImage src={"data:image/jpg;base64, " + tempImage} key={tempImage} width="200px" height="200px" />

        <Typography variant="h4" align="center" sx={{ visibility: !edit ? "visible" : "hidden", marginTop: "2%", fontWeight: "bold", }}>
          {userData.firstName} {userData.lastName}{" "}
          <Typography style={{ fontWeight: "1", fontSize: "15px" }}>({userData.emailAddress})</Typography>
        </Typography>

        {edit ? (
          <>
            <Input defaultValue={userData.firstName} onChange={(e) => { setEditedUser({ ...editedUser, firstName: e.target.value }); }} />
            <Input defaultValue={userData.lastName} onChange={(e) => { setEditedUser({ ...editedUser, lastName: e.target.value }); }} />
            <Input type="password" placeholder="password" onBlur={(e) => {
              let isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(
                e.target.value
              );
              if (!e.target.value) {
                setPasswordError(false)
                return;
              }
              if (!isPasswordValid) {
                setPasswordError(true);
              } else {
                setPasswordError(false);
                setEditedUser({ ...editedUser, password: e.target.value });
              }
            }} />
            <label style={{ visibility: !passwordError ? "hidden" : "visible", color: "red", margin: "20px", width: "70%" }}>Password must be at least 8 characters and contain characters and numbers</label>
          </>
        ) : null}

      </Box>

      {/* Rank */}
      <Box sx={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center" }}>
        <StarIcon fontSize="large" sx={{ color: "gold", verticalAlign: "text-top", mr: "0.5%" }}> </StarIcon>
        <Typography variant="h4">Rank: {userData.rank}</Typography>
      </Box>


      {/* Buttons */}
      <Box sx={{ marginTop: "20%", display: "flex", flexDirection: "row", width: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
          <Button variant="contained" onClick={() => { navigate("/my-posts"); }} sx={{ margin: "10%" }}>My Posts</Button>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
          <Button variant="contained" onClick={() => { navigate("/my-orders"); }} sx={{ margin: "10%" }}>My Orders</Button>
        </Box>
      </Box>
    </Stack >
  );
};

export default Profile;
