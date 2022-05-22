import React, { useState, useEffect } from 'react';
import { Stack, Box, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import Posts from '../posts/Posts';
import AddPost from '../add-post/AddPost'

const tabs = ['Near By', 'Recently Added', 'Add post'];

const Home = () => {
    const [activeTabNumber, setActiveTabNumber] = useState(0);
    const handleTabChange = (event, newTabNumber) => setActiveTabNumber(newTabNumber);

    const [posts, setPosts] = useState([]);
    useEffect(() => { loadPosts(); }, []);
    const loadPosts = () => {
        axios.get('/api/posts/').then(res => {
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

    const TabPanel = ({ children, value, index }) => {
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

    return (
        <Stack direction="column" justifyContent="flex-start" alignItems="center" spacing={{ xs: 1, sm: 1, md: 5, lg: 5 }}>
            <Logo />

            <Box sx={{ width: 'auto' }}>
                <Tabs value={activeTabNumber} onChange={handleTabChange} >
                    <Tab label={tabs[0]} />
                    <Tab label={tabs[1]} />
                    <Tab label={tabs[2]} />
                </Tabs>
                <TabPanel value={activeTabNumber} index={0}>
                    <Posts posts={posts} />
                </TabPanel>
                <TabPanel value={activeTabNumber} index={1}>
                    <Posts posts={posts.sort((a, b) => a - b)} />
                </TabPanel>

                <TabPanel value={activeTabNumber} index={2}>
                    <AddPost/>
                </TabPanel>
            </Box>

        </Stack>
    );
}

export default Home;
