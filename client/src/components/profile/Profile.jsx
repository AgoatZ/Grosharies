import { useOutletContext } from "react-router-dom";
import { Container, Typography } from '@mui/material';

const Profile = () => {

  const { noUser, userData } = useOutletContext();

  return (
    <Container>
      <Typography variant="h5">Profile Page</Typography>
      <Typography variant="p">{userData.firstName} {userData.lastName}</Typography>
    </Container>
  );
}

export default Profile;

