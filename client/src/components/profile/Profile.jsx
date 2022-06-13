import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import { Button, Container, Typography, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import { UserImage } from "../common/Images";
import ClearIcon from "@mui/icons-material/Clear";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CheckIcon from "@mui/icons-material/Check";
import { Input } from "@material-ui/core";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";

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
      .catch((err) => {});
  };

  return (
    <Container
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        marginTop: "5%",
      }}
    >
      <Box
        sx={{
          border: "1px solid",
          padding: "15px 150px",
          borderRadius: "30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <EditIcon
          sx={{
            visibility: !edit ? "visible" : "hidden",
            position: "absolute",
            right: "5%",
            top: "5%",
            ":hover": { cursor: "pointer", color: "gray" },
          }}
          onClick={() => {
            setEdit(true);
          }}
        ></EditIcon>

        <ClearIcon
          sx={{
            color: "red",
            visibility: edit ? "visible" : "hidden",
            position: "absolute",
            right: "5%",
            top: "5%",
            width: "30px",
            height: "30px",
            ":hover": { cursor: "pointer", color: "gray" },
          }}
          onClick={() => {
            setEdit(false);
          }}
        ></ClearIcon>
        <CheckIcon
          sx={{
            color: "green",
            visibility: edit ? "visible" : "hidden",
            position: "absolute",
            right: "5%",
            top: "90%",
            width: "30px",
            height: "30px",
            ":hover": { cursor: "pointer", color: "gray" },
          }}
          onClick={EditUser}
        ></CheckIcon>
        <label>
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) => {
              setEditeduserImage(e.target.files[0]);
            }}
          />
          <Tooltip title="Upload Files">
            <AddBoxIcon
              fill
              sx={{
                visibility: edit ? "visible" : "hidden",
                position: "absolute",
                right: "37%",
                top: "45%",
                width: "30px",
                color: "green",
                height: "30px",
                margin: "0",
                ":hover": { cursor: "pointer", color: "gray" },
              }}
            ></AddBoxIcon>
          </Tooltip>
        </label>
        <UserImage src={userData.profileImage} width="200px" height="200px" />

        <Typography
          variant="h4"
          sx={{
            visibility: !edit ? "visible" : "hidden",
            marginTop: "2%",
            fontWeight: "bold",
          }}
        >
          {userData.firstName} {userData.lastName}{" "}
          <label style={{ fontWeight: "1", fontSize: "15px" }}>
            ({userData.emailAddress})
          </label>
        </Typography>

        {edit ? (
          <>
            <Input
              defaultValue={userData.firstName}
              onChange={(e) => {
                setEditedUser({ ...editedUser, firstName: e.target.value });
              }}
            />
            <Input
              defaultValue={userData.lastName}
              onChange={(e) => {
                setEditedUser({ ...editedUser, lastName: e.target.value });
              }}
            />
            <Input
              placeholder="password"
              onChange={(e) => {
                setEditedUser({ ...editedUser, password: e.target.value });
              }}
            />
          </>
        ) : null}

        <Box sx={{ display: "flex", flexDirection: "row", marginTop: "1%" }}>
          <StarIcon sx={{ color: "gold" }}> </StarIcon>
          <Typography variant="h6">Rank: {userData.rank}</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          marginTop: "20%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/my-posts");
            }}
            sx={{
              marginRight: "100px",
            }}
          >
            My Posts
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/my-orders");
            }}
            sx={{
              marginLeft: "100px",
            }}
          >
            My Orders
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
