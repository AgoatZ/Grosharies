import { Container, Typography } from '@mui/material';
import { useLocation } from "react-router-dom";

const MyOrderDetails = () => {
    const res = useLocation().state;
    console.log(JSON.stringify(res));
    return (
        <Container>
            <Typography variant="h5">My Order Details Page</Typography>
        </Container>
    );
}

export default MyOrderDetails;

