import PostCard from "../post/PostCard";
import { Grid, Container } from '@mui/material';

const containerStyle = {
    border: 'black solid 1px',
    borderRadius: '10px',
    marginBottom: '5em',
    padding: 1,
}

const Posts = (props) => {
    const posts = props.posts.map(post => {
        return (
            //Set grow behavior acording to screen size (grow if xs or sm only)
            <Grid item xs sm md='false' lg='false'>     
                <PostCard id={post._id} title={post.headline} description={post.description} />
            </Grid>
        );
    });

    return (
        <Container fixed sx={containerStyle}>
            <Grid container spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }}  justifyItems='center' justifyContent='center'>
                {posts}
            </Grid>
        </Container>
    );
}

export default Posts;