import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import ProductsList from "../myOrders/ProductsList";
import { useNavigate } from "react-router-dom";
import { Typography, Box, CardMedia, Divider, Button, ButtonGroup, Stack, Accordion, AccordionDetails, AccordionSummary, List, ListItemButton, ListItemText, Collapse, ListSubheader, Fab } from "@mui/material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
//Icons
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from '@mui/icons-material/LocationOn';

const MySwal = withReactContent(Swal);

//TODO: Open Socket for order timeout and setTimeLeft(null) setIsCancelled

const OrderCard = ({ pendingPost, role = "collector", finished = false, cancelled = false }) => {
    let navigate = useNavigate();
    const toPostPage = () => navigate("/post/" + pendingPost.sourcePost);
    const viewdByCollector = (role === "collector");
    const viewdByPublisher = (role === "publisher");
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(pendingPost));
    //TODO: When post mark as collected by the collector stil appears under pending posts in MyOrders page
    const [isFinished, setIsFinished] = useState(finished || (viewdByCollector && pendingPost.status.collectorStatement === "collected"));
    const [isCancelled, setIsCancelled] = useState(cancelled);

    useEffect(() => {
        const interval = setInterval(() => { setTimeLeft(calculateTimeLeft(pendingPost)); }, 60000);
    })

    const Status = () => {
        return (
            <>
                {timeLeft && pendingPost.status.finalStatus === "pending" && pendingPost.status.collectorStatement === "pending" && pendingPost.status.publisherStatement === "pending" ?
                    (<Typography variant="overline">Waiting for pickup</Typography>) : null}

                {viewdByCollector ?
                    pendingPost.status.collectorStatement === "cancelled" ? <Typography variant="overline">Canceled by you</Typography> :
                        pendingPost.status.publisherStatement === "cancelled" ? <Typography variant="overline">Canceled by the publisher</Typography> :
                            pendingPost.status.collectorStatement === "collected" ? <Typography variant="overline">Collected by you</Typography> :
                                pendingPost.status.publisherStatement === "collected" ? <Typography variant="overline">Collected by publisher</Typography> :
                                    pendingPost.status.finalStatus === "collected" ? <Typography variant="overline">Collected</Typography> :
                                        null : null}

                {viewdByPublisher ?
                    pendingPost.status.collectorStatement === "cancelled" ? <Typography variant="overline">Canceled by collector</Typography> :
                        pendingPost.status.publisherStatement === "cancelled" ? <Typography variant="overline">Canceled by you</Typography> :
                            pendingPost.status.collectorStatement === "collected" ? <Typography variant="overline">Collected by collector</Typography> :
                                pendingPost.status.publisherStatement === "collected" ? <Typography variant="overline">Collected by you</Typography> :
                                    pendingPost.status.finalStatus === "collected" ? <Typography variant="overline">Collected</Typography> :
                                        null : null}

                {timeLeft ?
                    <Typography variant="p" sx={{ color: "red" }}><AccessTimeIcon /> {timeLeft}</Typography> :
                    <Typography variant="overline"><AccessTimeIcon /> Expired</Typography>}

            </>
        )
    }

    if (viewdByPublisher) {
        return (
            <>
                {/* when this order is viewed by the post publisher */}
                <Stack direction="row" spacing={2} sx={{ ml: 3, justifyContent: 'stretch', justifyItems: 'stretch' }}>
                    <Stack direction="column" spacing={1} sx={{ width: '33%' }}>
                        <Typography>{"Order By " + pendingPost.collector}</Typography>
                        <Status pendingPost={pendingPost} />
                    </Stack>
                    <Stack direction="column" spacing={1} sx={{ width: '50%' }}>
                        <ProductsList content={pendingPost.content} role="publisher" />
                    </Stack>
                    <Stack direction="column" spacing={1} sx={{ width: '33%' }}>
                        <Button disabled={!timeLeft || isFinished || isCancelled} variant="text" startIcon={<CheckIcon />}
                            onClick={() => completeOrder(pendingPost._id, viewdByPublisher)}>Complete</Button>
                        <Button disabled={!timeLeft || isFinished || isCancelled} variant="text" startIcon={<CloseIcon />}
                            onClick={() => cancelOrder(pendingPost._id, viewdByPublisher)}>Cancel</Button>
                    </Stack>
                </Stack>
            </>
        );
    }

    return (
        <>
            {/* Large Screen Setup */}
            <Box sx={{ display: { xs: "none", md: "flex" }, width: '100%' }}>
                <Stack direction="column" spacing={1} sx={{ mr: 2, width: '33%' }} >
                    <CardMedia component="img" image="/assets/default-post-image.svg"
                        sx={{ padding: 1, borderRadius: "10px", height: "auto", width: "200px" }} />
                </Stack>
                <Stack direction="column" spacing={1} sx={{ flexShrink: 0, width: "50%", mr: 2 }}>
                    <Status pendingPost={pendingPost} />
                    <Typography variant="h5" >{pendingPost.headline}</Typography>
                    <Typography variant="h6" ><LocationOnIcon /> {pendingPost.address}</Typography>
                    <Divider />
                    <Button variant="text" onClick={toPostPage}>
                        {(timeLeft && !isFinished && !isCancelled) ? 'Review Order In Post Page' : 'Go To Post Page'}
                    </Button>
                </Stack>
                <Stack direction="column" spacing={1} sx={{ alignSelf: 'center', width: "33%" }} >
                    <Button disabled={!timeLeft || isFinished || isCancelled} variant="outlined" startIcon={<CheckIcon />}
                        onClick={() => completeOrder(pendingPost._id)}>Complete Order</Button>
                    <Button disabled={!timeLeft || isFinished || isCancelled} variant="outlined" startIcon={<CloseIcon />}
                        onClick={() => cancelOrder(pendingPost._id)}>Cancel Order</Button>
                </Stack>
            </Box>

            {/* Small Screen Setup */}
            <Stack direction="column" spacing={1}
                sx={{ display: { xs: "flex", md: "none" }, width: "100%" }}>
                <Status pendingPost={pendingPost} />
                <CardMedia component="img" image="/assets/default-post-image.svg"
                    sx={{ padding: 1, borderRadius: "10px", height: "130px", width: "auto" }} />
                <Typography variant="h5" >{pendingPost.headline}</Typography>
                <Typography variant="h6" ><LocationOnIcon /> {pendingPost.address}</Typography>
                <ButtonGroup fullWidth >
                    <Button disabled={!timeLeft || isFinished || isCancelled} variant="outlined" startIcon={<CheckIcon />}
                        onClick={() => completeOrder(pendingPost._id)}>Complete</Button>
                    <Button disabled={!timeLeft || isFinished || isCancelled} variant="outlined" startIcon={<CloseIcon />}
                        onClick={() => cancelOrder(pendingPost._id)}>Cancel</Button>
                </ButtonGroup>
                <Divider />
                <Button variant="text" onClick={toPostPage}>
                    {(timeLeft && !isFinished && !isCancelled) ? 'Review Order In Post Page' : 'Go To Post Page'}
                </Button>
            </Stack>
        </>
    );
}

const calculateTimeLeft = (pendingPost) => {
    const today = new Date();
    const untilDate = new Date(pendingPost.pendingTime.until);
    const days = parseInt((untilDate - today) / (1000 * 60 * 60 * 24));
    const hours = parseInt((Math.abs(untilDate - today) / (1000 * 60 * 60)) % 24);
    const minutes = parseInt((Math.abs(untilDate.getTime() - today.getTime()) / (1000 * 60)) % 60);
    const seconds = parseInt((Math.abs(untilDate.getTime() - today.getTime()) / 1000) % 60);

    if (today.getTime() < untilDate.getTime()) {
        if (days > 0)
            return (("" + days).slice(-2) + " days and " + ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + " hours left");

        if (hours > 0)
            return (("0" + hours).slice(-2) + " hours and " + ("0" + minutes).slice(-2) + " minutes left");

        if (minutes > 0)
            return (("0" + minutes).slice(-2) + " minutes left");
    }
};

const completeOrder = (pendingPostId, viewdByPublisher) => {
    MySwal.fire({
        title: <strong>Are you sure you want to mark all as collected?</strong>,
        icon: "info",
        showCancelButton: true,
        cancelButtonText: "no",
        showConfirmButton: true,
        confirmButtonText: "yes",
        backdrop: false
    }).then((result) => {
        if (result.isConfirmed) {
            if (viewdByPublisher) {
                axios.post("pendings/finish/" + pendingPostId).then((res) => {
                    console.log("Pending response", res.data);
                    window.location.reload();
                });
            } else {
                axios.post("pendings/collector/finish/" + pendingPostId).then((res) => {
                    console.log("Pending response", res.data);
                    window.location.reload();
                });
            }
        }
    });
};

const cancelOrder = (pendingPostId) => {
    MySwal.fire({
        title: <strong>Are you sure you want to cancel the order?</strong>,
        icon: "info",
        showCancelButton: true,
        cancelButtonText: "no",
        showConfirmButton: true,
        confirmButtonText: "yes",
        backdrop: false
    }).then((result) => {
        if (result.isConfirmed) {
            axios.post("pendings/cancel/" + pendingPostId).then((res) => {
                console.log(res.data);
                window.location.reload();
            });
        }
    });
};

export default OrderCard;