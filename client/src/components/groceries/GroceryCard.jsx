import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GroceryCard = ({ groceryDetails }) => {
    let navigate = useNavigate();
    const displayCardDetails = () => {
        navigate("./" + groceryDetails.name, { state: groceryDetails });
    };

    return (
        <Container sx={{ marginBottom: '20px' }}>
            <Card onClick={displayCardDetails} sx={{ display: 'flex', cursor: 'pointer', ":hover": { backgroundColor: 'gray' } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h5">
                            {groceryDetails.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            {groceryDetails.amount}
                        </Typography>
                    </CardContent>
                </Box>
                <CardMedia
                    component="img"
                    sx={{
                        padding: 1,
                        textAlign: 'center',
                        borderRadius: "10px",
                        width: "100px",
                        height: "100px",
                    }}
                    image="/assets/logo.png"
                    alt="Live from space album cover"
                />
            </Card>
        </Container>
    );
}

export default GroceryCard;