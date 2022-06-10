import PostCard from "../post/PostCard";
import { Grid, Container } from "@mui/material";

const Posts = ({ data, noBorder }) => {
  const containerBorderStyle = noBorder ? {} : {
    border: { md: "solid lightgray 1px", xl: "solid lightgray 1px" },
    borderRadius: "10px",
  };

  return (
    <Container disableGutters>
      <Grid container spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }} justifyContent="center" sx={containerBorderStyle}>
        {data.map((post) => {
          return (
            <Grid item key={post._id}>
              <PostCard post={post} />
            </Grid>
          )
        })}
      </Grid>
    </Container>
  );
};

export default Posts;
