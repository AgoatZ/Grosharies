import * as React from 'react';
import { Button, CardActionArea, CardActions, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  card: {
    ["@media only screen and (min-width: 1363px) and (max-width: 1636px)"]: {
      width: 250
    },
    ["@media only screen and (max-width: 1363px)"]: {
      width: 200
    }
  }
});

const Post = (props) => {
  const classes = useStyles();

  return (
    <Card className={classes.card} sx={{ width: 300, height: 312, backgroundColor: 'rgb(251 255 248)', position: 'relative' }}>
      <CardActionArea sx={{ marginBottom: '10em', height: '88%', cursor: 'default' }}>
        <CardMedia
          component="img"
          height="50%"
          image="/assets/default-post.svg"
          alt="green iguana"
        /> 
        <CardContent sx={{ height: '50%' }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
            {props.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ width: '100%', backgroundColor: 'rgb(58, 173, 135)', position: 'absolute', bottom: 0, height: '12%' }}>
        <Button size="small" color="primary" sx={{ width: '100%', margin: '0 auto', color: 'white' }}>
          See More
        </Button>
      </CardActions>
    </Card>
  );
}

export default Post;
