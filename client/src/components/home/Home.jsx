import React, { useState, useEffect, useCallback } from 'react';
import { Stack, Typography, Box, Tabs, Tab, Container } from '@mui/material';
import axios from 'axios';
import Posts from '../posts/Posts';

const tabs = ['Near By', 'Recently Added'];

const Home = () => {

    const [posts, setPosts] = useState([]);
    useEffect(() => { loadPosts(); }, []);

    const loadPosts = () => {
        axios.get('/api/posts/').then(res => {
            //console.log('data = ' + JSON.stringify(res.data.posts) + ", status = " + res.status);
            console.log(res.status);
            console.log(res.data.posts);
            setPosts(res.data.posts);
        });
    };

    const Logo = () => {
        return (
            <Box >
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <img src={'assets/logo.png'} height='300px' width='300px' />
                </Box>
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <img src={'assets/logo.png'} height='150px' width='150px' />
                </Box>
            </Box>
        )
    };

    const TabPanel = (props) => {
        const { children, value, index } = props;
        return (
            <div role="tabpanel" hidden={value !== index}>
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        {children}
                    </Box>
                )}
            </div>
        );
    }

    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Stack direction="column" justifyContent="flex-start" alignItems="center" spacing={{ xs: 1, sm: 1, md: 5, lg: 5 }}>
            <Logo />

            <Box sx={{ width: 'auto'}}>
                <Tabs value={value} onChange={handleChange} >
                    <Tab label={tabs[0]} />
                    <Tab label={tabs[1]} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <Posts posts={posts} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Posts posts={posts.sort((a, b) => a - b)} />
                </TabPanel>
            </Box>

        </Stack>
    );
}

export default Home;
