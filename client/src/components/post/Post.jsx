import { useForm, Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";
import Slider from "react-input-slider"
import { Typography, Box } from '@mui/material';
import CardMedia from "@mui/material/CardMedia";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

const Post = () => {
    const res = useLocation().state;
    console.log(res.post);
    const { handleSubmit, control } = useForm();
    const onSubmit = (data) => console.log(JSON.stringify(data));


    const imagesAndVideos = [
        {
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
        },
    ];

    // const getAmount = (event) => {
    //     console.log('name: ' + event.target.name + ', value: ' + event.target.value);
    //     return { name: event.target.name, value: event.target.value };
    // }

    const products = res.post.content.map((grocery) => {
        return (
            <Box sx={{ display: 'flex', margin: '3% 0', justifyContent: 'space-evenly', width: '45%' }}>
                <CardMedia
                    component="img"
                    sx={{
                        padding: 1,
                        borderRadius: "10px",
                        height: "160px",
                        width: "auto"
                    }}
                    image='/assets/default-post-image.svg'
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', margin: 'auto 10% auto 0' }}>
                    <Typography component="div" variant="h6" mb='2%' fontFamily='Roboto'>
                        {`Name: ${grocery.name}`}
                    </Typography>
                    <Typography component="div" variant="h6" mb='2%' fontFamily='Roboto'>
                        {`Total Amount: ${grocery.amount} ${grocery.scale}`}
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        component="div"
                    >
                        {`Your Amount: `}
                        <Box sx={{ width: '300px' }}>
                            <Controller
                                control={control}
                                name="test"
                                defaultValue={50}
                                render={({ field: { value, onChange } }) => (
                                    <Slider
                                        aria-label="Small steps"
                                        defaultValue={0}
                                        step={1}
                                        marks
                                        min={0}
                                        max={grocery.amount}
                                        valueLabelDisplay="auto"
                                        onChange={({ x }) => onChange(x)}
                                        name={grocery.name}
                                        x={value}
                                    />
                                )}
                            />

                        </Box>
                    </Typography>
                </Box>
            </Box >);
    });

    return (
        <>
            <Box sx={{ margin: '0 10%' }}>
                <Box sx={{ justifyContent: 'space-between', display: 'flex', margin: '3% 0' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', margin: 'auto 10% auto 0' }}>
                        <Typography component="div" variant="h3" mb='2%' fontFamily='Roboto'>
                            {res.post.headline}
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            component="div"
                        >
                            {res.post.description}
                        </Typography>
                    </Box>
                    <CardMedia
                        component="img"
                        sx={{
                            padding: 1,
                            borderRadius: "10px",
                            height: "250px",
                            width: "auto"
                        }}
                        image='/assets/default-post-image.svg'
                    />
                </Box>
                <Box sx={{ flexDirection: 'row', display: 'flex' }}>
                    <LocationOnIcon color='primary' fontSize='large' />
                    <Typography gutterBottom fontSize='25px' fontWeight='bold' color="text.secondary">{res.post.address}</Typography>
                </Box>

                <Box sx={{ width: '600px', height: '600px', margin: '0 auto' }}>

                    <Typography gutterBottom fontSize='25px' fontWeight='bold' color="text.secondary">Gallery</Typography>
                    <ImageGallery items={imagesAndVideos} autoPlay />
                </Box>

                <Typography gutterBottom fontSize='25px' fontWeight='bold' color="text.secondary">Products</Typography>
            </Box >
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* {products} */}
                <Controller
                    control={control}
                    defaultValue={0}
                    name="test"
                    render={({ field: { value, onChange } }) => (
                        <Slider
                            aria-label="Small steps"
                            x={value}
                            axis={"x"}
                            xstep={1}
                            marks

                            xmin={0}
                            xmax={12}
                            scale={(val) => val}
                            valueLabelDisplay="auto"
                            onChange={({ x }) => {
                                console.log("x ", x);
                                onChange(x)
                            }}
                            name="slider"
                        // sx={{ width: "50%" }}
                        />
                    )}
                />
                <input type="submit" />
            </form>
        </>






    );
}

export default Post;