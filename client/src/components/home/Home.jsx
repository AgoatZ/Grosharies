import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Home.scss';
import Posts from '../posts/Posts';

const Home = () => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = () => {
        axios.get('/api/posts/').then(posts => {
            console.log('data = ' + JSON.stringify(posts.data) + ", status = " + posts.status);
            setPosts(posts.data);
        });
    };

    return (
        <div>
            <div className='img'>
                <img src={'assets/logo.png'} height='300px' width='300px' />
            </div>,
            <Posts posts={posts} />
        </div>
    );
}

export default Home;
