import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { Button, CardActionArea, CardActions, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { PostImage } from '../common/Images';

//TODO: set content acording to height 
const cardStyle = {
  width: 300,
  height: 305,
  padding: 1,
  textAlign: 'center'
}

const cardActionsStyle = {
  display: { xs: 'none', sm: 'none', md: 'block', xl: 'block' }
}

const PostCard = (props) => {
  let navigate = useNavigate();
  const toPostPage = () => navigate("./post/" + props.id, { state: props });

  return (
    <Card>
      <CardActionArea sx={cardStyle} onClick={toPostPage} >
        <CardMedia height='128' image='/assets/default-post-image.svg'/>
          <PostImage height='128'/>
        <CardContent>
          <Typography gutterBottom variant="h5">{props.title}</Typography>
          <Typography variant="body2" color="text.secondary">{props.description}</Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={cardActionsStyle} >
        <Button fullWidth variant="contained" onClick={toPostPage} >
          See More
        </Button>
      </CardActions>
    </Card>
  );
}

export default PostCard;