import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import Posts from '../posts/Posts';

const GroceryDetails = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => { loadPostsByGroceries(); }, []);
    const grocery = useLocation().state;

    const loadPostsByGroceries = () => {
        axios.post('/api/posts/bygroceries', {
            groceries: [grocery.name]
        }).then(res => {
            console.log(res.data.posts);
            setPosts(res.data.posts);

        });
    };
    return (
        <Container sx={{ marginBottom: '20px' }}>
            {(posts.length === 0) ?
                (<h1>There's no posts related to that grocery</h1>) : <Posts posts={posts} />
            }
        </Container>
    );
}

export default GroceryDetails;