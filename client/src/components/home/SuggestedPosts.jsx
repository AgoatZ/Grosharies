
import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Divider, useMediaQuery, Pagination, Skeleton } from "@mui/material";
import { AppContext } from "../../App";
import Posts from "../posts/Posts";
import axios from "../../utils/axios";

const SuggestedPosts = () => {
    const { loggedIn } = useContext(AppContext);
    const [suggestedPosts, setSuggestedPosts] = useState([]);
    const mobileScreen = useMediaQuery('(max-width:480px)');
    const limitPerPage = mobileScreen ? 3 : 5;
    // eslint-disable-next-line
    useEffect(() => { loadPosts(1) }, []);

    const loadPosts = (page) => {
        if (!loggedIn)
            return [];
        axios
            .get("posts/suggested/current/?page=" + page + "&limit=" + limitPerPage)
            .then((res) => setSuggestedPosts(res.data.posts))
            .catch((e) => console.log("Error getting suggested posts"));
    }

    const handleChangePage = (event, newPage) => { loadPosts(newPage) };

    return (
        <Box sx={{ width: "fit-content", padding: "2%" }} hidden={!loggedIn}>

            <Divider variant="middle" sx={{ mb: "2%" }}>
                <Typography variant="h5">Recommended For You</Typography>
            </Divider>

            {suggestedPosts.length > 0 ?
                <Posts data={suggestedPosts} /> :
                <Skeleton variant="rectangular" sx={{ width: "100%", height: "500px" }} />}

            <Divider variant="middle" sx={{ mt: "2%" }}>
                <Pagination count={5} onChange={handleChangePage} sx={{ width: "max-content" }} />
            </Divider>
        </Box>
    );
}

export default SuggestedPosts;
