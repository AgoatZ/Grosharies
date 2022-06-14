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

const OrderCard = ({ pendingPost, role = "collector", finished = false, cancelled = false }) => {
    let navigate = useNavigate();
    const toPostPage = () => navigate("/post/" + pendingPost.sourcePost);
    const viewdByCollector = (role === "collector");
    const viewdByPublisher = (role === "publisher");
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(pendingPost));
    const [isFinished, setIsFinished] = useState(finished);
    const [isCancelled, setIsCancelled] = useState(cancelled);
    const isWaiting = timeLeft && pendingPost.status.finalStatus === "pending" && pendingPost.status.collectorStatement === "collected" && pendingPost.status.publisherStatement === "pending";

    const [collectorName, setCollectorName] = useState("");

    useEffect(() => {
        const interval = setInterval(() => { setTimeLeft(calculateTimeLeft(pendingPost)); }, 60000);
        //For publisher view
        axios.get("users/profile/" + pendingPost.collectorId)
            .then((res) => setCollectorName(res.data.user.firstName + ' ' + res.data.user.lastName))
            .catch(e => console.log("Error getting collector profile"));
    }, []);

    const Status = () => {
        return (
            <>
                {timeLeft && pendingPost.status.finalStatus === "pending" && pendingPost.status.collectorStatement === "pending" && pendingPost.status.publisherStatement === "pending" ?
                    <Typography variant="overline">Waiting for pickup</Typography> : null}

                {viewdByCollector ?
                    isWaiting ? <Typography variant="overline">Waiting for publisher</Typography> :

                        pendingPost.status.collectorStatement === "cancelled" ? <Typography variant="overline">Canceled by you</Typography> :
                            pendingPost.status.publisherStatement === "cancelled" ? <Typography variant="overline">Canceled by the publisher</Typography> :
                                pendingPost.status.finalStatus === "cancelled" ? <Typography variant="overline">Canceled</Typography> :

                                    pendingPost.status.collectorStatement === "collected" ? <Typography variant="overline">Collected by you</Typography> :
                                        pendingPost.status.finalStatus === "collected" ? <Typography variant="overline">Collected</Typography> :
                                            null : null}

                {viewdByPublisher ?
                    isWaiting ? <Typography variant="overline">Waiting for your approval</Typography> :

                        pendingPost.status.collectorStatement === "cancelled" ? <Typography variant="overline">Canceled by collector</Typography> :
                            pendingPost.status.publisherStatement === "cancelled" ? <Typography variant="overline">Canceled by you</Typography> :

                                pendingPost.status.collectorStatement === "collected" ? <Typography variant="overline">Collected by collector</Typography> :
                                    pendingPost.status.finalStatus === "collected" ? <Typography variant="overline">Collected</Typography> :
                                        null : null}

                {timeLeft ?
                    <Typography sx={{ color: "red" }}>
                        <AccessTimeIcon fontSize="small" sx={{ verticalAlign: "text-top", mr: "0.5%" }} />{timeLeft}</Typography> :
                    <Typography variant="overline">
                        <AccessTimeIcon fontSize="small" sx={{ verticalAlign: "text-top", mr: "0.5%" }} /> Expired</Typography>}
            </>
        )
    }

    if (viewdByPublisher) {
        return (
            <>
                {/* when this order is viewed by the post publisher */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ ml: 3, justifyContent: 'stretch', justifyItems: 'stretch' }}>
                    <Stack direction="column" flexWrap="wrap" spacing={1}>
                        <Typography variant="b">{"Order By " + collectorName}</Typography>
                        <Status />
                    </Stack>
                    <Stack direction="column" flexWrap="wrap" spacing={1} sx={{ width: '50%' }}>
                        <ProductsList content={pendingPost.content} role="publisher" />
                    </Stack>
                    <Stack direction="column" flexWrap="wrap" justifyContent="center" spacing={1}>
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
            <Box sx={{ display: { xs: "none", md: "flex" }, width: '100%', padding: "1%" }}>
                <Stack direction="column" spacing={1} sx={{ flexShrink: 0, width: "70%", mr: 2, ml: 2 }}>
                    <Status />
                    <Typography variant="h5" >{pendingPost.headline}</Typography>
                    <Typography variant="h6" ><LocationOnIcon /> {pendingPost.address}</Typography>
                    <Divider />
                    <Button variant="text" onClick={toPostPage}>
                        {(timeLeft && !isFinished && !isCancelled) ? 'Review Order In Post Page' : 'Go To Post Page'}
                    </Button>
                </Stack>
                <Stack direction="column" spacing={1} sx={{ alignSelf: 'center', width: "33%" }} >
                    <Button disabled={!timeLeft || isFinished || isCancelled || isWaiting} variant="outlined" startIcon={<CheckIcon />}
                        onClick={() => completeOrder(pendingPost._id)}>Complete Order</Button>
                    <Button disabled={!timeLeft || isFinished || isCancelled || isWaiting} variant="outlined" startIcon={<CloseIcon />}
                        onClick={() => cancelOrder(pendingPost._id)}>Cancel Order</Button>
                </Stack>
            </Box>

            {/* Small Screen Setup */}
            <Stack direction="column" spacing={1}
                sx={{ display: { xs: "flex", md: "none" }, width: "100%", padding: "1.5%" }}>
                <Status />
                <Typography variant="h5" >{pendingPost.headline}</Typography>
                <Typography variant="h6" ><LocationOnIcon /> {pendingPost.address}</Typography>
                <ButtonGroup fullWidth >
                    <Button disabled={!timeLeft || isFinished || isCancelled || isWaiting} variant="outlined" startIcon={<CheckIcon />}
                        onClick={() => completeOrder(pendingPost._id)}>Complete</Button>
                    <Button disabled={!timeLeft || isFinished || isCancelled || isWaiting} variant="outlined" startIcon={<CloseIcon />}
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