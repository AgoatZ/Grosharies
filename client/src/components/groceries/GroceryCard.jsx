import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Container, Typography } from '@mui/material';

const GroceryCard = (props) => {
    return (
        <Container>
            <Card sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h5">
                            {props.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            {props.amount}
                        </Typography>
                    </CardContent>
                </Box>
                <CardMedia
                    component="img"
                    sx={{
                        padding: 1,
                        textAlign: 'center',
                        borderRadius: "10px"
                    }}
                    image="/static/images/cards/live-from-space.jpg"
                    alt="Live from space album cover"
                />
            </Card>
        </Container>
    );
}

export default GroceryCard;