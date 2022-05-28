import React, { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { Stack, Box, Tabs, Tab, Typography, Divider } from '@mui/material';
import axios from "../../utils/axios";
import Posts from '../posts/Posts';
import AddPost from '../add-post/AddPost';

const tabs = ['Near By', 'Recently Added', 'Add post'];

const Home = () => {
    const { loggedIn, userData } = useOutletContext();

    const [activeTabNumber, setActiveTabNumber] = useState(0);
    const handleTabChange = (event, newTabNumber) => setActiveTabNumber(newTabNumber);

    const [suggestedPosts, setSuggestedPosts] = useState([]);
    const [nearbyPosts, setNearbyPosts] = useState([]);
    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(() => loadPosts(), []);
    const loadPosts = () => {
        axios.get('posts/suggested/current').then(res => setSuggestedPosts(res.data.posts));
        //TODO: Posts nearby and Posts recently added
        axios.get('/posts/').then(res => setNearbyPosts(res.data.posts));
        axios.get('/posts/').then(res => setRecentPosts(res.data.posts));
    };

    const Logo = () => {
        return (
            <Box >
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <img src={'assets/logo.svg'} height='300px' width='300px' />
                </Box>
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <img src={'assets/logo.svg'} height='150px' width='150px' />
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

            <Box sx={{ width: 'auto' }} hidden={!loggedIn}>
                <Divider variant="middle">
                    <Typography variant='h5' margin='10px'>Recommended For You</Typography>
                </Divider>
                <Posts data={suggestedPosts} noBorder />
            </Box>

            <Box sx={{ width: 'auto' }}>
                <Tabs value={activeTabNumber} onChange={handleTabChange} >
                    <Tab label={tabs[0]} />
                    <Tab label={tabs[1]} />
                    <Tab label={tabs[2]} />
                </Tabs>
                <TabPanel value={activeTabNumber} index={0}>
                    <Posts data={nearbyPosts} />
                </TabPanel>
                <TabPanel value={activeTabNumber} index={1}>
                    <Posts data={recentPosts} />
                </TabPanel>
                <TabPanel value={activeTabNumber} index={2}>
                    <AddPost />
                </TabPanel>
            </Box>

        </Stack>
    );
}

export default Home;
