import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import axios from "axios";
import { Button, Container, Typography, Box, Tooltip, Stack } from "@mui/material";
import { UserImage } from "../common/Images";
import { Input } from "@material-ui/core";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CheckIcon from "@mui/icons-material/Check";

const Profile = () => {
  const { userData } = useContext(AppContext);
  const [edit, setEdit] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [EditedUserImage, setEditeduserImage] = useState();
  let navigate = useNavigate();

  const EditUser = () => {
    console.log(JSON.stringify(editedUser));
    axios
      .put("/user/current", editedUser)
      .then((res) => {
        /*if (EditedUserImage) {
          console.log('uploading image');
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
                setEdit(false);
              });
          };
          reader.readAsArrayBuffer(images);
        }*/
        setEdit(false);
      })
      .catch((err) => { });
  };

  // <Container sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginTop: "5%", }}    >
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
            onChange={(e) => { setEditeduserImage(e.target.files[0]); }}
          />
          <Tooltip title="Upload Files">
            <AddBoxIcon
              fill
              sx={{
                color: "green", visibility: edit ? "visible" : "hidden", position: "absolute", right: "37%", top: "45%",
                width: "30px", height: "30px", margin: "0", ":hover": { cursor: "pointer", color: "gray" },
              }}
            ></AddBoxIcon>
          </Tooltip>
        </label>

        <UserImage src={userData.profileImage} width="200px" height="200px" />

        <Typography variant="h4" align="center" sx={{ visibility: !edit ? "visible" : "hidden", marginTop: "2%", fontWeight: "bold", }}>
          {userData.firstName} {userData.lastName}{" "}
          <Typography style={{ fontWeight: "1", fontSize: "15px" }}>({userData.emailAddress})</Typography>
        </Typography>

        {edit ? (
          <>
            <Input defaultValue={userData.firstName} onChange={(e) => { setEditedUser({ ...editedUser, firstName: e.target.value }); }} />
            <Input defaultValue={userData.lastName} onChange={(e) => { setEditedUser({ ...editedUser, lastName: e.target.value }); }} />
            <Input placeholder="password" onChange={(e) => { setEditedUser({ ...editedUser, password: e.target.value }); }} />
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
          <Button variant="contained" onClick={() => { navigate("/my-posts"); }} sx={{ margin: "10%", }}>My Posts</Button>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
          <Button variant="contained" onClick={() => { navigate("/my-orders"); }} sx={{ margin: "10%", }}>My Orders</Button>
        </Box>
      </Box>
    </Stack>
  );
};

export default Profile;
