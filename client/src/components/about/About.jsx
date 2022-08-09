import { Stack, Typography } from '@mui/material';

const About = () => {
    return (
        <Stack direction="column" alignItems="left" flexWrap="wrap" spacing={1}>
            <Typography variant="h5" sx={{ fontSize: "35px", fontWeight: "bold", textAlign: "center", mb: "2%", mt: "3%" }}>About GroSharies</Typography>

            <Typography sx={{ fontSize: "20px" }}>Our world is encountering a fast-growing problem of food waste, in fact – about one third of the food in the world is thrown away. </Typography>
            <Typography sx={{ fontSize: "20px" }}>The idea of our project is to help to reduce the amount of that massive waste. </Typography >
            <Typography sx={{ fontSize: "20px" }}>To do so, we offer a community - based platform that will allow people to share good, fresh food, which is about to be thrown away unreasonably. </Typography >
            <Typography sx={{ fontSize: "20px" }}>The project is based on a freegan, anti - consumerist ideology and will be 100 % free to use, as well as the goods that are being shared. </Typography >

            <Typography sx={{ position: "fixed", bottom: "50px", fontSize: "10px" }}>@All right reserved to:
                Ohad Koren, Or Shemesh, Mor Daby, Ran Berant, Amit Zilber, Inbar Darshani.</Typography>
        </Stack >
    );
}

export default About;