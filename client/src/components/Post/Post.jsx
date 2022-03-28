import * as React from 'react';
import { Button, CardActionArea, CardActions, Card, CardContent, CardMedia, Typography } from '@mui/material';

const Post = (props) => {
  return (
    <Card sx={{ width: 300, height: 305, backgroundColor: 'rgb(251 255 248)', position: 'relative' }}>
      <CardActionArea sx={{ marginBottom: '10em' }}>
        <CardMedia
          component="img"
          height="140"
          image="/assets/default-post.svg"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
            {props.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ width: '100%', backgroundColor: 'rgb(58, 173, 135)', position: 'absolute', bottom: 0 }}>
        <Button size="small" color="primary" sx={{ width: '100%', margin: '0 auto', color: 'white' }}>
          See More
        </Button>
      </CardActions>
    </Card>
  );
}

export default Post;
