import * as React from 'react';
import { Button, CardActionArea, CardActions, Card, CardContent, CardMedia, Typography } from '@mui/material';

const cardStyle = {
  minWidth: 300,
  minHeight: 305,
  padding: 1,
  textAlign: 'center'
}

const PostCard = (props) => {
  return (
    <Card sx={cardStyle}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="/assets/default-post.svg"
        />
        <CardContent>
          <Typography gutterBottom variant="h5">
            {props.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button>
          See More
        </Button>
      </CardActions>
    </Card>
  );
}

export default PostCard;
