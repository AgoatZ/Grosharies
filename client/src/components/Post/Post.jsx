import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { Typography } from '@mui/material';

const Post = () => {
    //Get post data from passed state
    const post = useLocation().state;
    console.log('post', post);

    return (
        <div>
            <img src='/assets/empty_photo.png' height='140' width='auto' alt='postPhoto' />
            <Typography gutterBottom variant="h5">{post.title}</Typography>
            <Typography variant="body2" color="text.secondary">{post.description}</Typography>
        </div>
    );
}

export default Post;
