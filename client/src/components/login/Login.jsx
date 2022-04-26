import { useOutletContext } from "react-router-dom";
import { Container, Typography } from '@mui/material';

const Login = () => {
    
    const {noUser, userData} = useOutletContext();


    return (
        <Container>
            <Typography variant="h5">Login Page</Typography>
            <Typography variant="h2">noUser = {noUser}</Typography>
            <Typography variant="h2">userData = {userData}</Typography>
        </Container>
    );
}

export default Login;