import * as React from 'react';
import { Button, CardActionArea, CardActions, Card, CardContent, CardMedia, Typography } from '@mui/material';

const Post = () => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="/assets/default-post.svg"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
            Grocery
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This is a grocery that is gonna be replace with a real description, once we make it e2e
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ backgroundColor: 'rgb(58, 173, 135)' }}>
        <Button size="small" color="primary" sx={{ width: '100%', margin: '0 auto', color: 'white' }}>
          See More
        </Button>
      </CardActions>
    </Card>
  );
}

export default Post;
