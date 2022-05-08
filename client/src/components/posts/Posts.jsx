import PostCard from "../post/PostCard";
import { Grid, Container } from "@mui/material";

const containerStyle = {
  border: { md: "solid lightgray 1px", xl: "solid lightgray 1px" },
  borderRadius: "10px",
};

const Posts = (props) => {
  const posts = props.posts.map((post) => {
    return (
      <Grid item key={post._id}>
        <PostCard
          id={post._id}
          post={post}
          title={post.headline}
          description={post.description}
        />
      </Grid>
    );
  });

  return (
    <Container disableGutters>
      <Grid
        container
        spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }}
        justifyContent="center"
        sx={props.noBorder ? "" : containerStyle}
      >
        {posts}
      </Grid>
    </Container>
  );
};

export default Posts;
