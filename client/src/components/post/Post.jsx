import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { Container, Typography } from '@mui/material';
import { PostImage } from '../common/Images';

const Post = () => {
    //Get post data from passed state
    const post = useLocation().state;

    return (
        <Container>
            <PostImage src='/assets/default-post-image.svg' height='140' width='auto' />
            <Typography gutterBottom variant="h5">{post.title}</Typography>
            <Typography variant="body2" color="text.secondary">{post.description}</Typography>
        </Container>
    );
}

export default Post;