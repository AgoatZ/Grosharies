import React, { useState, useEffect, useCallback } from 'react';
import { Stack } from '@mui/material';
import axios from 'axios';
import Posts from '../posts/Posts';

const Home = () => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = () => {
        axios.get('/api/posts/').then(res => {
            console.log('data = ' + JSON.stringify(res.data.posts) + ", status = " + res.status);
            setPosts(res.data.posts);
        });
    };

    return (
        <Stack direction="column" justifyContent="flex-start" alignItems="center" spacing={{ xs: 1, sm: 1, md: 5, lg: 5 }}>
            <img src={'assets/logo.png'} height='300px' width='300px' />
            <Posts posts={posts} />
        </Stack>
    );
}

export default Home;
