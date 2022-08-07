import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { Typography, Box, CardMedia, Divider, Button, ButtonGroup, Stack } from "@mui/material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
//Icons
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeleteIcon from '@mui/icons-material/Delete';

const MySwal = withReactContent(Swal);

const PostCard = ({ post }) => {
    let navigate = useNavigate();
    const toPostPage = () => navigate("/post/" + post._id);
    // const toEditPostPage = (post) => navigate("/post/" + post._id + '/edit');       //TODO: Edit Post Page

    const deletePost = (post) => {
        MySwal.fire({
            title: <strong>Are you sure you want to delete this post?</strong>,
            icon: "info",
            showCancelButton: true,
            cancelButtonText: "no",
            showConfirmButton: true,
            confirmButtonText: "yes",
            backdrop: false
        }).then((result) => {
            if (result.isConfirmed) {
                //Delete post in db
                axios.delete('posts/' + post._id, { post })
                    .then((res) => { window.location.reload(); })
                    .catch(e => console.log("Error deleting post id:" + post._id));
            }
        });
    };

    return (
        <>
            {/* Large Screen Setup */}
            <Box sx={{ display: { xs: "none", md: "flex" }, width: "100%" }}>
                <Stack direction="column" spacing={1} sx={{ mr: 2, width: "33%" }}>
                    <CardMedia component="img" image={"data:image/jpg;base64, " + post.images[0]}
                        sx={{ padding: 1, borderRadius: "10px", height: "auto", width: "200px" }} />
                </Stack>
                <Stack direction="column" spacing={1} sx={{ flexShrink: 0, width: "50%", mr: 2 }}>
                    <Typography variant="overline">{post.status}</Typography>
                    <Typography variant="h5" >{post.headline}</Typography>
                    <Typography variant="h6" ><LocationOnIcon /> {post.address}</Typography>
                    <Divider />
                    <Button variant="text" onClick={toPostPage}>Go To Post</Button>
                </Stack>
                <Stack direction="column" spacing={1} sx={{ alignSelf: 'center', width: "33%" }}>
                    {/* <Button variant="outlined" startIcon={<EditIcon />} onClick={() => toEditPostPage(post)}>Edit Post</Button> */}
                    <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => deletePost(post)}>Delete Post</Button>
                </Stack>
            </Box>

            {/* Small Screen Setup */}
            <Stack direction="column" spacing={1}
                sx={{ display: { xs: "flex", md: "none" }, width: "100%" }}>
                <Typography variant="overline">{post.status}</Typography>
                <CardMedia component="img" image={"data:image/jpg;base64, " + post.images[0]}
                    sx={{ padding: 1, borderRadius: "10px", height: "130px", width: "auto" }} />
                <Typography variant="h5" >{post.headline}</Typography>
                <Typography variant="h6" ><LocationOnIcon /> {post.address}</Typography>
                <Divider />
                <Button variant="text" onClick={toPostPage}>Go To Post</Button>
                <ButtonGroup fullWidth>
                    {/* <Button variant="outlined" startIcon={<EditIcon />} onClick={() => toEditPostPage(post)}>Edit Post</Button> */}
                    <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => deletePost(post)}>Delete Post</Button>
                </ButtonGroup>
            </Stack>
        </>
    )
}


export default PostCard;